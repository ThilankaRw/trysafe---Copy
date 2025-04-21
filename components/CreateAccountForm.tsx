import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "../lib/auth-client";
import { useSecureStore } from "@/store/useSecureStore";
import { generateSalt, deriveKey } from "@/lib/utils";

export function CreateAccountForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [passwordStrength, setPasswordStrength] = useState<
    "weak" | "medium" | "strong" | "none"
  >("none");
  const router = useRouter();
  const { initializeStorage } = useSecureStore();

  // Check password strength
  const checkPasswordStrength = (
    password: string
  ): "weak" | "medium" | "strong" | "none" => {
    if (password.length === 0) {
      return "none";
    }

    const hasMinLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[^A-Za-z0-9]/.test(password);

    const score = [
      hasMinLength,
      hasUppercase,
      hasLowercase,
      hasNumber,
      hasSpecialChar,
    ].filter(Boolean).length;

    if (score <= 2) return "weak";
    if (score <= 4) return "medium";
    return "strong";
  };

  // Check if passwords match when either field changes
  const checkPasswordsMatch = (password: string, confirmPassword: string) => {
    // Only show error if confirm password field has been touched
    if (confirmPassword === "") {
      setPasswordsMatch(true);
      return;
    }
    setPasswordsMatch(password === confirmPassword);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordStrength(checkPasswordStrength(newPassword));
    checkPasswordsMatch(newPassword, confirmPassword);
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newConfirmPassword = e.target.value;
    setConfirmPassword(newConfirmPassword);
    checkPasswordsMatch(password, newConfirmPassword);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Prevent submission if passwords don't match
    if (password !== confirmPassword) {
      setPasswordsMatch(false);
      return;
    }

    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    // Use the state variable instead of reading from form
    // const password = formData.get("password") as string;

    try {
      // Generate master key from password and salt
      const salt = generateSalt();
      const masterKey = await deriveKey(password, salt);

      // Create account
      const { data, error } = await authClient.signUp.email({
        email: email,
        password: password,
        name: name,
        image: "/404",
      });

      if (error) {
        toast.error(error.message);
        setIsLoading(false);
        return;
      }

      // Initialize secure storage with master key
      try {
        await initializeStorage(password);
      } catch (storageError) {
        console.error("Failed to initialize secure storage:", storageError);
        toast.error("Failed to initialize secure storage. Please try again.");
        setIsLoading(false);
        return;
      }

      toast.success("Account created successfully");

      // Set up 2FA
      const res = await authClient.twoFactor.enable({
        password: password,
      });

      if (res.error) {
        toast.error(res.error.message);
        setIsLoading(false);
        return;
      }

      router.push(
        "/security-onboarding?token=" +
          encodeURIComponent(btoa(res.data.totpURI))
      );
    } catch (error: any) {
      toast.error(error.message);
      setIsLoading(false);
      console.error({
        error,
      });
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Create an Account</CardTitle>
        <CardDescription>
          Enter your details to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" name="name" type="text" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={handlePasswordChange}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            {password.length > 0 && (
              <div className="mt-1">
                <div className="flex items-center space-x-2">
                  <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        passwordStrength === "weak"
                          ? "bg-red-500 w-1/3"
                          : passwordStrength === "medium"
                            ? "bg-yellow-500 w-2/3"
                            : passwordStrength === "strong"
                              ? "bg-green-500 w-full"
                              : ""
                      }`}
                    />
                  </div>
                  <span className="text-xs">
                    {passwordStrength === "weak" && "Weak"}
                    {passwordStrength === "medium" && "Medium"}
                    {passwordStrength === "strong" && "Strong"}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Password should be at least 8 characters with uppercase,
                  lowercase, numbers, and special characters.
                </p>
              </div>
            )}
            {!passwordsMatch && (
              <p className="text-sm text-red-500 mt-1">
                Passwords do not match
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={
              isLoading ||
              !passwordsMatch ||
              password === "" ||
              confirmPassword === "" ||
              passwordStrength === "weak" ||
              passwordStrength === "none"
            }
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Account...
              </>
            ) : (
              "Create Account"
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:underline">
            Login here
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
