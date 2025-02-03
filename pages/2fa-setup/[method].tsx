import { useState, useEffect } from "react";
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
import Image from "next/image";
import type React from "react"; // Added import for React
import { LoaderCircle } from "lucide-react";
import { authClient } from "@/lib/auth-client";

type TwoFactorMethod = "totp" | "email";

export default function TwoFactorSetupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const router = useRouter();
  const method = router.query.method as TwoFactorMethod;

  const handleSetup2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call to verify and set up 2FA
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    toast.success("Two-factor authentication set up successfully");
    router.push("/dashboard");
  };

  const handleSkip = () => {
    toast.info("Two-factor authentication setup skipped");
    router.push("/dashboard");
  };

  useEffect(() => {
    if (!method) return;
    if (!["totp", "email"].includes(String(method))) {
      router.push("/404");
    }

    if (method === "email") {
    }
  }, [method]);

  const renderSetupInstructions = () => {
    switch (method) {
      case "totp":
        return (
          <>
            <p>Scan this QR code with your authenticator app:</p>
            <div className="flex justify-center my-4">
              <Image
                src="/placeholder.svg?height=200&width=200"
                alt="TOTP QR Code"
                width={200}
                height={200}
                className="border border-gray-300 rounded"
              />
            </div>
            <p>Or enter this code manually: ABCD EFGH IJKL MNOP</p>
          </>
        );
      case "email":
        return (
          <>
            <p>
              We&apos;ll send a verification code to your email: {contactInfo}
            </p>
            <Button
              onClick={() => toast.success("Verification code sent")}
              variant="outline"
              className="mt-2"
            >
              Send Code
            </Button>
          </>
        );
      default:
        return <p>Invalid method selected</p>;
    }
  };

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
                Follow the instructions below to complete setup
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {renderSetupInstructions()}
              <form onSubmit={handleSetup2FA}>
                <div className="space-y-2">
                  <Label htmlFor="verificationCode">Verification Code</Label>
                  <Input
                    id="verificationCode"
                    placeholder="Enter verification code"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    required
                  />
                </div>
              </form>
            </CardContent>
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
          </Card>
        </div>
      </div>
    </main>
  );
}
