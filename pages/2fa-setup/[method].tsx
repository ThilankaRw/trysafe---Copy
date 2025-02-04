import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import type React from "react";
import { LoaderCircle } from "lucide-react";
import QRCode from "react-qr-code";
import { authClient } from "@/lib/auth-client";
import { Mail, CheckCircle2, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

type TwoFactorMethod = "totp" | "email";

export default function TwoFactorSetupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isInitialSending, setIsInitialSending] = useState(true);
  const [sendFailed, setSendFailed] = useState(false);

  const { data: user, isPending: isUserLoading } = authClient.useSession();
  console.log({ user });

  const [token, setToken] = useState<string | undefined>(undefined);
  const [countdown, setCountdown] = useState(0);
  const [emailSent, setEmailSent] = useState(false);
  const router = useRouter();
  const method = router.query.method as TwoFactorMethod;

  const startCountdown = useCallback(() => {
    setCountdown(600); // 10 minutes in seconds
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

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleSendEmail = async () => {
    setIsLoading(true);
    try {
      const { error } = await authClient.twoFactor.sendOtp();

      if (error) throw new Error(error.message);

      toast.success("Verification code sent successfully");
      startCountdown();
    } catch (error) {
      toast.error("Failed to send verification code");
    }
    setIsLoading(false);
  };

  const handleSetup2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    if (!verificationCode) {
      toast.error("Please enter the verification code");
      setIsLoading(false);
      return;
    }

    if (method === "totp") {
      // verify the code

      const { data, error } = await authClient.twoFactor.verifyTotp({
        code: verificationCode,
      });

      if (error) {
        toast.error(error.message);
        setIsLoading(false);
        return;
      }

      // redirect to dashboard
      toast.success("Two-factor authentication set up successfully");
      router.replace("/dashboard");
    }
  };

  const handleSkip = () => {
    router.push("/dashboard");
  };

  useEffect(() => {
    if (!method) return;
    if (!["totp", "email"].includes(String(method))) {
      router.push("/404");
    }

    if (method === "email") {
      setIsInitialSending(true);
      authClient.twoFactor
        .sendOtp()
        .then(({ error }) => {
          if (error) {
            setSendFailed(true);
            toast.error("Failed to send verification code");
          } else {
            setEmailSent(true);
            startCountdown();
          }
        })
        .finally(() => {
          setIsInitialSending(false);
        });
    } else if (method === "totp") {
      const token = Array.isArray(router.query.token)
        ? router.query.token[0]
        : (router.query.token ?? "");
      const decoded = decodeURIComponent(atob(decodeURIComponent(token)));
      setToken(decoded);
    } else {
      router.push("/404");
    }
  }, [method]);

  useEffect(() => {
    const timer = setTimeout(() => setIsPageLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const QRCodeSkeleton = () => (
    <div className="w-[200px] h-[200px] bg-gray-200 dark:bg-gray-700 animate-pulse rounded" />
  );

  const EmailSetupContent = () => (
    <div className="space-y-6">
      <div className="flex flex-col items-center justify-center space-y-3 py-4">
        <div className="h-16 w-16 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
          <Mail className="h-8 w-8 text-blue-600 dark:text-blue-400" />
        </div>
        <h3 className="text-xl font-semibold text-center">
          Email Verification
        </h3>
      </div>

      <div className="rounded-lg border bg-card p-6 space-y-4">
        <div className="space-y-2">
          <p className="text-sm text-center text-muted-foreground">
            {isInitialSending
              ? "Sending verification code to:"
              : "We'll send a verification code to:"}
          </p>
          <p className="text-lg font-medium text-center">{user?.user.email}</p>
        </div>

        <div className="space-y-4">
          {isInitialSending ? (
            <div className="flex flex-col items-center gap-3 py-4">
              <LoaderCircle className="h-8 w-8 animate-spin text-blue-600" />
              <p className="text-sm text-muted-foreground">
                Sending verification code...
              </p>
            </div>
          ) : sendFailed ? (
            <div className="space-y-3">
              <div className="flex items-center justify-center gap-2 text-red-600 dark:text-red-400">
                <AlertCircle className="h-5 w-5" />
                <span className="text-sm font-medium">
                  Failed to send verification code
                </span>
              </div>
              <Button
                onClick={handleSendEmail}
                className="w-full"
                disabled={isLoading}
              >
                Try Again
              </Button>
            </div>
          ) : emailSent ? (
            <>
              <Input
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Enter 6-digit code"
                maxLength={6}
                className="text-center text-2xl tracking-widest"
                inputMode="numeric"
              />
              <Button
                onClick={handleSetup2FA}
                className="w-full"
                disabled={isLoading || !verificationCode}
              >
                {isLoading ? (
                  <>
                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify Code"
                )}
              </Button>
              <Button
                onClick={handleSendEmail}
                variant="secondary"
                disabled={countdown > 0 || isLoading}
                className="w-full"
              >
                {countdown > 0
                  ? `Request new code in ${formatTime(countdown)}`
                  : "Request new code"}
              </Button>
            </>
          ) : null}
        </div>

        {emailSent && !isInitialSending && !sendFailed && (
          <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400">
            <CheckCircle2 className="h-5 w-5" />
            <span className="text-sm font-medium">
              Code sent! Check your email.
            </span>
          </div>
        )}
      </div>

      {emailSent && !isInitialSending && !sendFailed && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium">Note:</p>
              <ul className="list-disc list-inside space-y-1 mt-1">
                <li>Check your spam folder if you don't see the email</li>
                <li>The code expires in 10 minutes</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderSetupInstructions = () => {
    switch (method) {
      case "totp":
        return (
          <>
            <p>Scan this QR code with your authenticator app:</p>
            <div className="flex justify-center my-4">
              {token === undefined ? (
                <QRCodeSkeleton />
              ) : (
                <QRCode
                  value={token}
                  size={200}
                  level="H"
                  className="border border-gray-300 rounded bg-white p-2"
                />
              )}
            </div>
            <div className="space-y-2 mt-4">
              <p className="font-medium text-sm text-gray-700 dark:text-gray-300">
                After scanning the QR code, the app will display a six-digit
                code that you can enter below.
              </p>
            </div>
          </>
        );
      case "email":
        return <EmailSetupContent />;
      default:
        return <p>Invalid method selected</p>;
    }
  };

  const renderVerificationInput = () => {
    switch (method) {
      case "totp":
        return (
          <div className="space-y-2">
            <Label htmlFor="verificationCode">
              Enter the six-digit code from the authentication app
            </Label>
            <Input
              id="verificationCode"
              placeholder="Enter 6-digit code"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              maxLength={6}
              pattern="[0-9]{6}"
              required
              inputMode="numeric"
              autoComplete="one-time-code"
            />
            <p className="text-sm text-gray-500">
              The code refreshes every 30 seconds
            </p>
          </div>
        );
      case "email":
        return null; // Remove the verification code input for email
      default:
        return null;
    }
  };

  const LoadingView = () => (
    <div className="flex flex-col md:flex-row w-full">
      <div className="hidden md:flex md:w-1/2 bg-blue-600 justify-center items-center p-12">
        <div className="max-w-md text-white space-y-6">
          <Skeleton className="h-12 w-3/4 bg-white/20" />
          <Skeleton className="h-8 w-full bg-white/20" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-2/3 bg-white/20" />
            <Skeleton className="h-6 w-1/2 bg-white/20" />
            <Skeleton className="h-6 w-3/4 bg-white/20" />
          </div>
        </div>
      </div>
      <div className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-12">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-4">
            <div className="space-y-2 text-center">
              <Skeleton className="h-8 w-3/4 mx-auto" />
              <Skeleton className="h-4 w-2/3 mx-auto" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex flex-col items-center space-y-4">
                <Skeleton className="h-16 w-16 rounded-full" />
                <div className="space-y-2 w-full">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6 mx-auto" />
                </div>
                <Skeleton className="h-[200px] w-full rounded-lg" />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <div className="space-y-2 w-full">
              <Skeleton className="h-10 w-full rounded" />
              <Skeleton className="h-10 w-full rounded" />
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );

  if (isUserLoading || isPageLoading) {
    return (
      <main className="flex min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
        <LoadingView />
      </main>
    );
  }

  return (
    <main className="flex min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
      <div className="flex flex-col md:flex-row w-full">
        <div className="hidden md:flex md:w-1/2 bg-blue-600 justify-center items-center p-12">
          <div className="max-w-md text-white">
            <h1 className="text-4xl font-bold mb-6">
              Set Up {String(method).toUpperCase()} Verification
            </h1>
            <p className="text-xl mb-6">
              Follow the instructions to set up your chosen two-factor
              authentication method.
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>Enhanced account security</li>
              <li>Easy to use</li>
              <li>Protects against unauthorized access</li>
            </ul>
          </div>
        </div>
        <div className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-12">
          <Card className="w-full max-w-md">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">
                Set Up {String(method).toUpperCase()} Verification
              </CardTitle>
              <CardDescription className="text-center">
                {method === "email"
                  ? "Verify your email address to secure your account"
                  : "Follow the instructions below to complete setup"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {renderSetupInstructions()}
              {method !== "email" && (
                <form onSubmit={handleSetup2FA}>
                  {renderVerificationInput()}
                </form>
              )}
            </CardContent>
            {method !== "email" && (
              <CardFooter className="flex flex-col justify-between gap-4">
                <Button
                  onClick={handleSetup2FA}
                  className="w-full"
                  disabled={isLoading || !verificationCode}
                >
                  {isLoading ? (
                    <>
                      <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    "Complete Setup"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleSkip}
                  className="w-full"
                  disabled={isLoading}
                >
                  Skip
                </Button>
              </CardFooter>
            )}
          </Card>
        </div>
      </div>
    </main>
  );
}
