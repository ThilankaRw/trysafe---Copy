import { useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { LoginForm } from "../components/loginForm";

export default function LoginPage() {
  const [authMethod, setAuthMethod] = useState("sms");

  return (
    <main className="flex min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="flex flex-col md:flex-row w-full">
        <div
          className="hidden md:flex md:w-1/2 justify-center items-center p-12 relative"
          style={{ backgroundColor: "#1F6F82" }}
        >
          {/* Curved edge */}
          <div
            className="absolute right-0 top-0 h-full w-24"
            style={{
              background: "#1F6F82",
              borderTopRightRadius: "100%",
              transform: "translateX(50%)",
            }}
          />
          <div className="max-w-md text-white relative z-10">
            <h1 className="text-4xl font-bold mb-6">
              Choose Your Security Method
            </h1>
            <p className="text-xl mb-6">
              Enhance your account security by selecting your preferred
              two-factor authentication method.
            </p>
            <ul className="list-disc list-inside space-y-2 opacity-90">
              <li>Additional layer of security</li>
              <li>Quick and easy verification</li>
              <li>Industry-standard protection</li>
            </ul>
          </div>
        </div>
        <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-12">
          <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-xl shadow-lg">
            <div className="flex justify-center">
              <Image
                src="/WhatsApp Image 2025-02-05 at 01.19.34_b7fe2c31.jpg"
                alt="Try Safe Logo"
                width={60}
                height={60}
                className="rounded-full"
                quality={100}
              />
            </div>
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-center text-gray-800">
                Select Authentication Method
              </h2>
              <div className="space-y-4">
                <label className="flex items-center p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                  <input
                    type="radio"
                    name="authMethod"
                    value="sms"
                    checked={authMethod === "sms"}
                    onChange={(e) => setAuthMethod(e.target.value)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="ml-3 font-medium">SMS</span>
                </label>
                <label className="flex items-center p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                  <input
                    type="radio"
                    name="authMethod"
                    value="totp"
                    checked={authMethod === "totp"}
                    onChange={(e) => setAuthMethod(e.target.value)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="ml-3 font-medium">
                    Authenticator App (TOTP)
                  </span>
                </label>
              </div>
              <button className="w-full py-3 px-4 bg-[#1F6F82] text-white rounded-lg hover:bg-[#1a5d6d] transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1F6F82]">
                Continue
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
