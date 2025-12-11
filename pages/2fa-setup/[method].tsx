import { useState, useEffect, useCallback, memo } from "react";
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

interface TwoFactorState {
  isLoading: boolean;
  isPageLoading: boolean;
  isInitialSending: boolean;
  sendFailed: boolean;
  emailSent: boolean;
}

interface EmailSetupContentProps {
  isInitialSending: boolean;
  user: { user: { email: string } } | null;
  sendFailed: boolean;
  emailSent: boolean;
  isLoading: boolean;
  verificationCode: string;
  countdown: number;
  handleSendEmail: () => Promise<void>;
  handleSetup2FA: (e: React.FormEvent) => Promise<void>;
  setVerificationCode: (code: string) => void;
  formatTime: (seconds: number) => string;
}

// Move components outside main component
const QRCodeSkeleton = memo(() => (
  <div className="w-[200px] h-[200px] bg-gray-200 dark:bg-gray-700 animate-pulse rounded" />
));

QRCodeSkeleton.displayName = "QRCodeSkeleton";

const LoadingView = memo(() => (
  <div className="flex flex-col md:flex-row w-full">
    <div className="hidden md:flex md:w-1/2 bg-cyan-700 justify-center items-center p-12">
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
));

LoadingView.displayName = "LoadingView";

const EmailSetupContent = memo<EmailSetupContentProps>(
  ({
    isInitialSending,
    user,
    sendFailed,
    emailSent,
    isLoading,
    verificationCode,
    countdown,
    handleSendEmail,
    handleSetup2FA,
    setVerificationCode,
    formatTime,
  }) => (
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
                <li>Check your spam folder if you don&apos;t see the email</li>
                <li>The code expires in 10 minutes</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
);
EmailSetupContent.displayName = "EmailSetupContent";

export default function TwoFactorSetupPage(): JSX.Element {
  // Consolidate related state
  const [state, setState] = useState<TwoFactorState>({
    isLoading: false,
    isPageLoading: true,
    isInitialSending: true,
    sendFailed: false,
    emailSent: false,
  });

  const [verificationCode, setVerificationCode] = useState("");
  const [token, setToken] = useState<string | undefined>(undefined);
  const [countdown, setCountdown] = useState(0);

  const router = useRouter();
  const method = router.query.method as TwoFactorMethod;
  const { data: user, isPending: isUserLoading } = authClient.useSession();

  // Memoized functions
  const formatTime = useCallback((seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  }, []);

  const startCountdown = useCallback((): void => {
    setCountdown(600);
    setState((prev) => ({ ...prev, emailSent: true }));
  }, []);

  const handleSendEmail = useCallback(async (): Promise<void> => {
    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      const { error } = await authClient.twoFactor.sendOtp();
      if (error) throw error;
      toast.success("Verification code sent successfully");
      startCountdown();
    } catch (error) {
      toast.error("Failed to send verification code");
    }
    setState((prev) => ({ ...prev, isLoading: false }));
  }, [startCountdown]);

  // Optimized effects
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
    } else if (countdown === 0 && state.emailSent) {
      setState((prev) => ({ ...prev, emailSent: false }));
    }
    return () => clearTimeout(timer);
  }, [countdown, state.emailSent]);

  useEffect(() => {
    if (!method || !["totp", "email"].includes(String(method))) {
      router.push("/404");
      return;
    }

    const initMethod = async () => {
      if (method === "email") {
        try {
          const { error } = await authClient.twoFactor.sendOtp();
          setState((prev) => ({
            ...prev,
            sendFailed: !!error,
            emailSent: !error,
            isInitialSending: false,
          }));
          if (error) {
            toast.error("Failed to send verification code");
          } else {
            startCountdown();
          }
        } catch {
          setState((prev) => ({
            ...prev,
            sendFailed: true,
            isInitialSending: false,
          }));
        }
      } else if (method === "totp") {
        const tokenParam = Array.isArray(router.query.token)
          ? router.query.token[0]
          : (router.query.token ?? "");
        const decoded = decodeURIComponent(
          atob(decodeURIComponent(tokenParam))
        );
        setToken(decoded);
      }
    };

    initMethod();
  }, [method, router, startCountdown]);

  const handleSetup2FA = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setState((prev) => ({ ...prev, isLoading: true }));

    try {
      if (!verificationCode) {
        throw new Error("Please enter the verification code");
      }

      if (method === "totp") {
        const { error } = await authClient.twoFactor.verifyTotp({
          code: verificationCode,
        });

        if (error) throw error;

        toast.success("Two-factor authentication set up successfully");
        router.replace("/dashboard");
      } else if (method === "email") {
        const { error } = await authClient.twoFactor.verifyOtp({
          code: verificationCode,
          trustDevice: true,
        });

        if (error) throw error;

        toast.success("Two-factor authentication set up successfully");
        router.replace("/dashboard");
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Verification failed"
      );
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const handleSkip = (): void => {
    router.push("/dashboard");
  };

  useEffect(() => {
    const timer = setTimeout(
      () => setState((prev) => ({ ...prev, isPageLoading: false })),
      500
    );
    return () => clearTimeout(timer);
  }, []);

  const renderSetupInstructions = (): JSX.Element => {
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
        return (
          <EmailSetupContent
            isInitialSending={state.isInitialSending}
            user={user}
            sendFailed={state.sendFailed}
            emailSent={state.emailSent}
            isLoading={state.isLoading}
            verificationCode={verificationCode}
            countdown={countdown}
            handleSendEmail={handleSendEmail}
            handleSetup2FA={handleSetup2FA}
            setVerificationCode={setVerificationCode}
            formatTime={formatTime}
          />
        );
      default:
        return <p>Invalid method selected</p>;
    }
  };

  const renderVerificationInput = (): JSX.Element | null => {
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

  if (isUserLoading || state.isPageLoading) {
    return (
      <main className="flex min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
        <LoadingView />
      </main>
    );
  }

  return (
    <main className="flex min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
      <div className="flex flex-col md:flex-row w-full">
        <div className="hidden md:flex md:w-1/2 bg-cyan-700 justify-center items-center p-12">
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
                  disabled={state.isLoading || !verificationCode}
                >
                  {state.isLoading ? (
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
                  disabled={state.isLoading}
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
