import { TwoFactorMethodSelection } from "../components/2faMethodSelection";

export default function TwoFactorAuthPage() {
  return (
    <main className="flex min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
      <div className="flex flex-col md:flex-row w-full">
        <div className="hidden md:flex md:w-1/2 bg-blue-600 justify-center items-center p-12">
          <div className="max-w-md text-white">
            <h1 className="text-4xl font-bold mb-6">
              Two-Factor Authentication
            </h1>
            <p className="text-xl mb-6">
              Secure your account with an extra layer of protection.
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>Enhanced Security Protocols</li>
              <li>Seamless Integration</li>
              <li>24/7 IT Support</li>
              <li>Custom Analytics Dashboard</li>
            </ul>
          </div>
        </div>
        <div className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-12">
          <div className="w-full max-w-md space-y-8">
            <div className="flex justify-center">
              {/* <Image
                src="/placeholder.svg?height=80&width=80"
                alt="EnterpriseCore Logo"
                width={80}
                height={80}
                className="bg-blue-600 p-2 rounded-full"
              /> */}
            </div>
            {/* <TwoFactorAuthForm /> */}
            <TwoFactorMethodSelection />
          </div>
        </div>
      </div>
    </main>
  );
}
