import { useEffect, useState } from "react";
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
import { toast } from "sonner";
import Image from "next/image";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { LoaderCircle } from "lucide-react";
import { authClient } from "@/lib/auth-client";

type TwoFactorMethod = "sms" | "totp" | "email";

export default function SecurityOnboardingPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<TwoFactorMethod | null>(
    null
  );
  const [disableTotp, setDisableTotp] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (router.query.token) {
      // get secet from query params
      const secret = router.query.token as string;
      console.log({ secret });
      if (!secret) {
        setDisableTotp(true);
        setSelectedMethod("email");
      } else setDisableTotp(false);
    }
  }, [router.query.token]);

  const handleSetup2FA = async () => {
    const secret = router.query.token as string;

    if (!selectedMethod) {
      toast.error("Please select a two-factor authentication method");
      return;
    }

    const url = new URL(`/2fa-setup/${selectedMethod}`, window.location.origin);
    if (selectedMethod === "totp") {
      if (!secret) {
        toast.error(
          "You cannot set up Authenticator App (TOTP). Please select another method."
        );
        return;
      }
      url.searchParams.set("token", secret);
    }

    if (selectedMethod === "email") {
    }

    router.push(url.toString());
  };

  const handleSkip2FA = () => {
    toast.info("2FA setup skipped");
    router.push("/dashboard");
  };

  return (
    <main className="flex min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
      <div className="flex flex-col md:flex-row w-full">
        <div className="hidden md:flex md:w-1/2 bg-cyan-700 justify-center items-center p-12">
          <div className="max-w-md text-white">
            <h1 className="text-4xl font-bold mb-6">
              Enhance Your Account Security
            </h1>
            <p className="text-xl mb-6">
              Two-factor authentication adds an extra layer of protection to
              your account.
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>Prevent unauthorized access</li>
              <li>Protect against password breaches</li>
              <li>Comply with industry security standards</li>
              <li>Peace of mind for your sensitive data</li>
            </ul>
          </div>
        </div>
        <div className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-12">
          <Card className="w-full max-w-md">
            <CardHeader className="space-y-1">
              <div className="flex justify-center mb-4">
                <Image
                  src="/2ss.png"
                  alt="EnterpriseCore Logo"
                  width={80}
                  height={80}
                />
              </div>
              <CardTitle className="text-2xl font-bold text-center">
                Set Up Two-Step Verification
              </CardTitle>
              <CardDescription className="text-center">
                Choose a method to add an extra layer of security
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <RadioGroup
                onValueChange={(value) =>
                  setSelectedMethod(value as TwoFactorMethod)
                }
                className="space-y-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="totp"
                    id="totp"
                    disabled={disableTotp}
                  />
                  <Label
                    htmlFor="totp"
                    className={disableTotp ? "opacity-50" : ""}
                  >
                    Authenticator App (TOTP)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="email" id="email" />
                  <Label htmlFor="email">Email Verification</Label>
                </div>
              </RadioGroup>
              <p className="text-sm text-muted-foreground">
                You can choose one method for two-factor authentication. You can
                change this later in your account settings.
              </p>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button
                onClick={handleSetup2FA}
                className="w-full"
                disabled={isLoading || !selectedMethod}
              >
                {isLoading ? (
                  <>
                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                    Setting up...
                  </>
                ) : (
                  "Set Up Two-Step Verification"
                )}
              </Button>
              <Button
                onClick={handleSkip2FA}
                variant="outline"
                className="w-full"
              >
                Skip for now
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </main>
  );
}
