import { TwoFactorForm } from "@/components/TwoFactorForm";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

export default function TwoFactorVerifyPage() {
  const searchParams = useSearchParams();
  const method = (searchParams.get("method") || "totp") as "totp" | "email";

  const methodInfo = {
    totp: {
      title: "Authenticator App",
      description: "Enter the 6-digit code from your authenticator app",
    },
    email: {
      title: "Email Verification",
      description: "We've sent a 6-digit code to your email",
    },
  }[method] || {
    title: "Two-Factor Authentication",
    description: "Enter the 6-digit verification code",
  };

  return (
    <main className="flex min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
      <div className="flex flex-col md:flex-row w-full">
        <div className="hidden md:flex md:w-1/2 bg-cyan-700 justify-center items-center p-12">
          <div className="max-w-md text-white">
            <h1 className="text-4xl font-bold mb-6">Secure Access</h1>
            <p className="text-xl mb-6">
              Protecting your account with advanced security measures.
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>Enhanced account protection</li>
              <li>Prevents unauthorized access</li>
              <li>Quick and easy verification process</li>
              <li>Multiple verification methods available</li>
            </ul>
          </div>
        </div>
        <div className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-12">
          <div className="w-full max-w-md space-y-8">
            <div className="flex justify-center">
              <Image
                src="/2ss.png"
                alt="EnterpriseCore Logo"
                width={80}
                height={80}
              />
            </div>
            <TwoFactorForm method={method} methodInfo={methodInfo} />
          </div>
        </div>
      </div>
    </main>
  );
}
