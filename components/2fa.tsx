"use client";

import React, { useState } from "react";

export const TwoFactorForm = ({
  method,
  methodInfo,
}: {
  method: string;
  methodInfo: any;
}) => {
  const [token, setToken] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/2fa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "verify",
          userId: "user123", // Replace with the actual user ID from session or context
          token,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setMessage("✅ Verification successful! You are logged in.");
      } else {
        setMessage(
          "❌ Verification failed. Please check your code and try again."
        );
      }
    } catch (error) {
      setMessage("❌ Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">{methodInfo.title}</h2>
      <p className="text-sm text-gray-600 mb-2">{methodInfo.description}</p>
      <p className="text-sm text-gray-800 mb-4 font-semibold">
        {methodInfo.contact}
      </p>

      <form onSubmit={handleVerify} className="space-y-4">
        <div>
          <label
            htmlFor="token"
            className="block text-sm font-medium text-gray-700"
          >
            Enter the 6-digit Code
          </label>
          <input
            id="token"
            type="text"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            maxLength={6}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {isLoading ? "Verifying..." : "Verify"}
        </button>
      </form>

      {message && <p className="mt-4 text-center text-sm">{message}</p>}
    </div>
  );
};
