import Image from "next/image";
import { CreateAccountForm } from "../components/CreateAccountForm";
import { ThemeProvider } from "@/components/theme-provider";
import ThemeToggle from "@/components/ThemeToggle";

function CreateAccountContent() {
  return (
    <main className="flex min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
      <div className="flex flex-col md:flex-row w-full">
        <div className="hidden md:flex md:w-1/2 bg-cyan-700 justify-center items-center p-12">
          <div className="max-w-md text-white">
            <h1 className="text-4xl font-bold mb-6">Join Try Safe</h1>
            <p className="text-xl mb-6">
              Create your account and start your journey with us.
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>Access to cutting-edge solutions</li>
              <li>Personalized dashboard</li>
              <li>Seamless collaboration tools</li>
              <li>24/7 support</li>
            </ul>
          </div>
        </div>
        <div className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-12">
          <div className="w-full max-w-md space-y-8">
            <div className="flex justify-center items-center">
              <Image
                src="/2ss.png"
                alt="EnterpriseCore Logo"
                width={80}
                height={80}
              />
              <div className="absolute top-4 right-4">
                <ThemeToggle />
              </div>
            </div>
            <CreateAccountForm />
          </div>
        </div>
      </div>
    </main>
  );
}

export default function CreateAccountPage() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <CreateAccountContent />
    </ThemeProvider>
  );
}
