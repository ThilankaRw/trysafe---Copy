import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Label } from "../components/ui/label";

export function TwoFactorMethodSelection() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(event.currentTarget);
    const method = formData.get("method") as string;

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (method && ["sms", "totp", "email"].includes(method)) {
      router.push(`/2fa-verification?method=${method}`);
    } else {
      setError("Invalid 2FA method selected");
    }

    setIsLoading(false);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Choose 2FA Method</CardTitle>
        <CardDescription>
          Select your preferred two-factor authentication method
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <RadioGroup name="method" className="space-y-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="sms" id="sms" />
              <Label htmlFor="sms">SMS</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="totp" id="totp" />
              <Label htmlFor="totp">Authenticator App (TOTP)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="email" id="email" />
              <Label htmlFor="email">Email</Label>
            </div>
          </RadioGroup>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Processing..." : "Continue"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
