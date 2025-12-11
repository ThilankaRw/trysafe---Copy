"use client";

import React from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useTheme } from "next-themes";

function PrivacyPolicyContent() {
  const { theme } = useTheme();

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-gray-950 transition-colors duration-300">
      {/* Header */}
      <header className="px-8 border-b border-slate-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/90 backdrop-blur-sm sticky top-0 z-10">
        <div className="container flex h-20 items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/">
              <div className="flex items-center gap-3">
                <div>
                  <Image
                    src="/2ss.png"
                    alt="TRISAFE Logo"
                    width={80}
                    height={80}
                    className="w-16 h-16"
                  />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-[#4299e1] dark:from-teal-300 dark:to-blue-400">
                    TRISAFE
                  </h1>
                  <span className="text-xs text-slate-500 dark:text-gray-400 hidden sm:inline-block">
                    Secure Cloud Storage
                  </span>
                </div>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button
              variant="ghost"
              asChild
              className="hidden md:inline-flex text-slate-700 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-gray-800 transition-all duration-200"
            >
              <Link href="/login">Log in</Link>
            </Button>
            <Button
              className="bg-gradient-to-r from-teal-400 to-[#4299e1] dark:from-teal-500 dark:to-blue-600 hover:opacity-90 text-white shadow-md dark:shadow-teal-500/10 transition-all duration-200"
              asChild
            >
              <Link href="/create-account">Sign up</Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="bg-gradient-to-r from-teal-50 to-blue-50 dark:from-gray-900 dark:to-gray-900 py-16">
        <div className="container mx-auto px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col items-center text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
                Privacy Policy
              </h1>
              <p className="text-xl text-slate-600 dark:text-gray-300 max-w-2xl">
                How we protect your data and respect your privacy
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      <main className="flex-1 container mx-auto px-8 py-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <div className="mb-12">
            <Link
              href="/"
              className="inline-flex items-center text-teal-500 dark:text-teal-400 hover:text-teal-600 dark:hover:text-teal-300 transition-colors mb-8"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>

            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md p-8 space-y-8">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Introduction
                </h2>
                <p className="text-slate-600 dark:text-gray-300">
                  At TRISAFE, we take your privacy seriously. This Privacy
                  Policy explains how we collect, use, disclose, and safeguard
                  your information when you use our secure file storage service.
                </p>
                <p className="text-slate-600 dark:text-gray-300">
                  Please read this privacy policy carefully. If you do not agree
                  with the terms of this privacy policy, please do not access
                  the application.
                </p>
                <p className="text-slate-600 dark:text-gray-300">
                  Last Updated:{" "}
                  {new Date().toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Information We Collect
                </h2>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-slate-800 dark:text-gray-100">
                    Personal Information
                  </h3>
                  <p className="text-slate-600 dark:text-gray-300">
                    We collect information that you provide directly to us, such
                    as when you create an account, upload files, or contact our
                    support team. This information may include:
                  </p>
                  <ul className="list-disc pl-6 text-slate-600 dark:text-gray-300 space-y-1">
                    <li>
                      Name and contact information (email address, phone number)
                    </li>
                    <li>Account credentials (username, password)</li>
                    <li>
                      Billing information (payment method details, billing
                      address)
                    </li>
                    <li>
                      Files and content you upload, store, or share using our
                      services
                    </li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-slate-800 dark:text-gray-100">
                    Automatically Collected Information
                  </h3>
                  <p className="text-slate-600 dark:text-gray-300">
                    When you use our service, we automatically collect certain
                    information about your device and how you interact with our
                    platform:
                  </p>
                  <ul className="list-disc pl-6 text-slate-600 dark:text-gray-300 space-y-1">
                    <li>
                      Device information (device type, operating system, browser
                      type)
                    </li>
                    <li>
                      Usage data (files accessed, features used, time spent on
                      the platform)
                    </li>
                    <li>Log data (IP address, access times, pages viewed)</li>
                    <li>
                      Location information (country, region based on IP address)
                    </li>
                  </ul>
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  How We Use Your Information
                </h2>
                <p className="text-slate-600 dark:text-gray-300">
                  We use the information we collect for various purposes,
                  including:
                </p>
                <ul className="list-disc pl-6 text-slate-600 dark:text-gray-300 space-y-1">
                  <li>Providing, maintaining, and improving our services</li>
                  <li>Processing transactions and managing your account</li>
                  <li>
                    Communicating with you about our services, updates, and
                    security alerts
                  </li>
                  <li>Customizing and personalizing your experience</li>
                  <li>Analyzing usage patterns to enhance our platform</li>
                  <li>
                    Detecting and preventing fraudulent activities and security
                    breaches
                  </li>
                  <li>Complying with legal obligations</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Data Security
                </h2>
                <p className="text-slate-600 dark:text-gray-300">
                  Security is at the core of our service. We implement robust
                  measures to protect your data:
                </p>
                <ul className="list-disc pl-6 text-slate-600 dark:text-gray-300 space-y-1">
                  <li>End-to-end encryption for all stored files</li>
                  <li>Secure data transmission using TLS/SSL protocols</li>
                  <li>Regular security assessments and penetration testing</li>
                  <li>Multi-factor authentication options</li>
                  <li>Employee access controls and training</li>
                </ul>
                <p className="text-slate-600 dark:text-gray-300">
                  While we implement strong security measures, no method of
                  transmission or storage is 100% secure. We continuously
                  improve our security practices to protect your information.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Data Sharing and Disclosure
                </h2>
                <p className="text-slate-600 dark:text-gray-300">
                  We do not sell your personal information. We may share your
                  information in limited circumstances:
                </p>
                <ul className="list-disc pl-6 text-slate-600 dark:text-gray-300 space-y-1">
                  <li>
                    With service providers who perform services on our behalf
                  </li>
                  <li>With your consent or at your direction</li>
                  <li>To comply with legal obligations</li>
                  <li>
                    In connection with a merger, sale, or acquisition of our
                    business
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Your Privacy Rights
                </h2>
                <p className="text-slate-600 dark:text-gray-300">
                  Depending on your location, you may have certain rights
                  regarding your personal information:
                </p>
                <ul className="list-disc pl-6 text-slate-600 dark:text-gray-300 space-y-1">
                  <li>Access and obtain a copy of your data</li>
                  <li>Correct inaccurate information</li>
                  <li>Delete your personal information</li>
                  <li>Restrict or object to processing</li>
                  <li>Data portability</li>
                </ul>
                <p className="text-slate-600 dark:text-gray-300">
                  To exercise these rights, please contact us at
                  trisafeteam@gmail.com
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Cookies and Tracking Technologies
                </h2>
                <p className="text-slate-600 dark:text-gray-300">
                  We use cookies and similar technologies to enhance your
                  experience, analyze usage, and improve our services. You can
                  manage your cookie preferences through your browser settings.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Changes to This Privacy Policy
                </h2>
                <p className="text-slate-600 dark:text-gray-300">
                  We may update this Privacy Policy from time to time to reflect
                  changes in our practices or for other operational, legal, or
                  regulatory reasons. We will notify you of any material changes
                  by posting the updated policy on our website or through other
                  communication channels.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Contact Us
                </h2>
                <p className="text-slate-600 dark:text-gray-300">
                  If you have any questions or concerns about this Privacy
                  Policy or our data practices, please contact us at:
                </p>
                <div className="p-4 bg-slate-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-slate-600 dark:text-gray-300">
                    <strong>Email:</strong> privacy@trisafe.com
                    <br />
                    <strong>Address:</strong> NO 115, Meepe Padukka, Sri Lanka
                    <br />
                    <strong>Phone:</strong> +94 66-8731798
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-gray-800 py-8 bg-white dark:bg-gray-900 px-8">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Image
                src="/2ss.png"
                alt="TRISAFE Logo"
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <h2 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-[#4299e1] dark:from-teal-300 dark:to-blue-400">
                TRISAFE
              </h2>
            </div>

            <div className="flex gap-8">
              <Button
                asChild
                variant="link"
                className="text-sm text-slate-600 dark:text-gray-400 hover:text-teal-400 dark:hover:text-teal-300 transition-colors"
              >
                <Link href="/legal/terms">Terms</Link>
              </Button>
              <Button
                asChild
                variant="link"
                className="text-sm text-slate-600 dark:text-gray-400 hover:text-teal-400 dark:hover:text-teal-300 transition-colors font-semibold"
              >
                <Link href="/legal/privacy">Privacy</Link>
              </Button>
              <Button
                asChild
                variant="link"
                className="text-sm text-slate-600 dark:text-gray-400 hover:text-teal-400 dark:hover:text-teal-300 transition-colors"
              >
                <Link href="/support/contact">Contact</Link>
              </Button>
            </div>

            <div className="mt-4 md:mt-0 text-sm text-slate-500 dark:text-gray-400">
              &copy; {new Date().getFullYear()} TRISAFE. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function PrivacyPage() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <PrivacyPolicyContent />
    </ThemeProvider>
  );
}
