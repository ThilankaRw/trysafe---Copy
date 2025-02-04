"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Loader } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Skeleton } from "./ui/skeleton";

type TwoFactorMethod = "totp" | "email";

interface MethodInfo {
  title: string;
  description: string;
}

const LoadingCard = () => (
  <Card className="w-full max-w-md">
    <CardHeader className="space-y-4">
      <div className="space-y-2">
        <Skeleton className="h-8 w-3/4 mx-auto" />
        <Skeleton className="h-4 w-2/3 mx-auto" />
      </div>
    </CardHeader>
    <CardContent>
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-12 w-full rounded" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      </div>
    </CardContent>
    <CardFooter>
      <Skeleton className="h-4 w-full" />
    </CardFooter>
  </Card>
);

export function TwoFactorForm({
  method,
  methodInfo,
}: {
  method: TwoFactorMethod;
  methodInfo: MethodInfo;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [emailSent, setEmailSent] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const router = useRouter();
  const { data: user, isPending: isUserLoading } = authClient.useSession();

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const startCountdown = useCallback(() => {
    setCountdown(600); // 10 minutes
    setEmailSent(true);
  }, []);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && emailSent) {
      setEmailSent(false);
    }
  }, [countdown, emailSent]);

  useEffect(() => {
    // Simulate loading time for smoother transition
    const timer = setTimeout(() => setIsPageLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(event.currentTarget);
      const code = formData.get("code") as string;

      if (method === "totp") {
        const { error } = await authClient.twoFactor.verifyTotp({
          code,
        });
        if (error) throw new Error(error.message);
      }

      if (method === "email") {
        const { error } = await authClient.twoFactor.verifyOtp({
          code,
        });
        if (error) throw new Error(error.message);
      }

      toast.success("Verification successful!");
      router.push("/dashboard");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Verification failed"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (method !== "email" || countdown > 0) return;

    if (isLoading) return;
    setIsLoading(true);
    try {
      const { error } = await authClient.twoFactor.sendOtp();
      if (error) throw new Error(error.message);

      toast.success("Verification code sent!", {
        description: "Please check your email for the new code",
      });
      startCountdown();
    } catch (error) {
      toast.error("Failed to send verification code");
    } finally {
      setIsLoading(false);
    }
  };

  if (isUserLoading || isPageLoading) {
    return <LoadingCard />;
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <div className="flex items-center space-x-2">
          <CardTitle className="text-2xl font-bold">
            {methodInfo.title}
          </CardTitle>
        </div>
        <CardDescription>{methodInfo.description}</CardDescription>
      </CardHeader>
      <CardContent>
        {method === "email" ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code">Enter verification code</Label>
              <Input
                id="code"
                name="code"
                type="text"
                placeholder="000000"
                required
                maxLength={6}
                pattern="\d{6}"
                className="text-center text-2xl tracking-widest"
                inputMode="numeric"
                autoComplete="one-time-code"
              />
              <p className="text-sm text-muted-foreground">
                Enter the 6-digit code sent to {user?.user.email}
              </p>
            </div>
            <div className="space-y-2">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify Code"
                )}
              </Button>
              <Button
                type="button"
                onClick={handleResendCode}
                variant="secondary"
                disabled={isLoading || countdown > 0}
                className="w-full"
              >
                {countdown > 0
                  ? `Request new code in ${formatTime(countdown)}`
                  : "Request new code"}
              </Button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code">Verification Code</Label>
              <Input
                id="code"
                name="code"
                type="text"
                placeholder="000000"
                required
                maxLength={6}
                pattern="\d{6}"
                className="text-center text-2xl tracking-widest"
                inputMode="numeric"
                autoComplete="one-time-code"
              />
            </div>
            <p className="text-sm text-muted-foreground">
              {method === "totp"
                ? "Enter the 6-digit code from your authenticator app"
                : `Enter the 6-digit code sent to ${user?.user.email}`}
            </p>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify"
              )}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
