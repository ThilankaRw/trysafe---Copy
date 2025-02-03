"use client";

import { useState } from "react";
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

export function TwoFactorForm({
  method,
  methodInfo,
}: {
  method: TwoFactorMethod;
  methodInfo: MethodInfo;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { data: user, isPending: isUserLoading } = authClient.useSession();

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
    if (method !== "email") return;

    setIsLoading(true);
    try {
      const { error } = await authClient.twoFactor.sendOtp();
      if (error) throw new Error(error.message);

      toast.success("New code sent", {
        description: `A new verification code has been sent to ${user?.user.email}`,
      });
    } catch (error) {
      toast.error("Failed to send code");
    } finally {
      setIsLoading(false);
    }
  };

  if (isUserLoading) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center space-x-2">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-[200px]" />
          </div>
          <Skeleton className="h-4 w-[250px]" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
      </Card>
    );
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
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        {method === "email" && (
          <Button
            variant="link"
            onClick={handleResendCode}
            disabled={isLoading}
          >
            Didn't receive the code? Resend
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
