"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/ui/theme-toggle";

function PricingPageContent() {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">(
    "monthly"
  );

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

      <main className="flex-1 px-8 py-12">
        <div className="container max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900 dark:text-white">
              Simple{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-[#4299e1] dark:from-teal-300 dark:to-blue-400">
                Pricing
              </span>{" "}
              Plans
            </h1>
            <p className="text-xl text-slate-600 dark:text-gray-300 max-w-2xl mx-auto">
              Choose the perfect plan for your storage needs
            </p>

            <div className="flex items-center justify-center mt-8">
              <div className="bg-slate-100 dark:bg-gray-800 p-1 rounded-full inline-flex">
                <button
                  onClick={() => setBillingPeriod("monthly")}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    billingPeriod === "monthly"
                      ? "bg-white dark:bg-gray-700 text-slate-900 dark:text-white shadow-sm"
                      : "text-slate-600 dark:text-gray-400"
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingPeriod("yearly")}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    billingPeriod === "yearly"
                      ? "bg-white dark:bg-gray-700 text-slate-900 dark:text-white shadow-sm"
                      : "text-slate-600 dark:text-gray-400"
                  }`}
                >
                  Yearly{" "}
                  <span className="text-teal-400 dark:text-teal-300">-20%</span>
                </button>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Free Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-700 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl dark:hover:shadow-teal-500/5 transition-all duration-300"
            >
              <div className="p-8">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                  Free
                </h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-slate-900 dark:text-white">
                    $0
                  </span>
                  <span className="text-slate-500 dark:text-gray-400">
                    /month
                  </span>
                </div>
                <p className="text-slate-600 dark:text-gray-300 mb-6">
                  For personal use with basic security features
                </p>

                <Button
                  className="w-full bg-gradient-to-r from-teal-400 to-[#4299e1] dark:from-teal-500 dark:to-blue-600 hover:opacity-90 text-white shadow-md dark:shadow-teal-500/10 transition-all duration-200"
                  asChild
                >
                  <Link href="/create-account">Get Started</Link>
                </Button>
              </div>

              <div className="border-t border-slate-200 dark:border-gray-700 p-8">
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-teal-400 dark:text-teal-300 mr-2 flex-shrink-0" />
                    <span className="text-slate-600 dark:text-gray-300">
                      10GB secure storage
                    </span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-teal-400 dark:text-teal-300 mr-2 flex-shrink-0" />
                    <span className="text-slate-600 dark:text-gray-300">
                      Basic encryption
                    </span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-teal-400 dark:text-teal-300 mr-2 flex-shrink-0" />
                    <span className="text-slate-600 dark:text-gray-300">
                      File sharing (up to 100MB)
                    </span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-teal-400 dark:text-teal-300 mr-2 flex-shrink-0" />
                    <span className="text-slate-600 dark:text-gray-300">
                      Email support
                    </span>
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* Pro Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-900 border-2 border-teal-400 dark:border-teal-500 rounded-2xl shadow-xl overflow-hidden relative transform scale-105 hover:shadow-xl dark:hover:shadow-teal-500/10 transition-all duration-300"
            >
              <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-teal-400 to-[#4299e1] dark:from-teal-500 dark:to-blue-600 text-white text-xs font-medium py-1 text-center">
                MOST POPULAR
              </div>

              <div className="p-8 pt-12">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                  Pro
                </h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-slate-900 dark:text-white">
                    ${billingPeriod === "monthly" ? "9.99" : "7.99"}
                  </span>
                  <span className="text-slate-500 dark:text-gray-400">
                    /month
                  </span>
                </div>
                <p className="text-slate-600 dark:text-gray-300 mb-6">
                  Advanced security for individuals & small teams
                </p>

                <Button
                  className="w-full bg-gradient-to-r from-teal-400 to-[#4299e1] dark:from-teal-500 dark:to-blue-600 hover:opacity-90 text-white shadow-lg shadow-cyan-500/20 dark:shadow-cyan-500/5 transition-all duration-200"
                  asChild
                >
                  <Link href="/create-account?plan=pro">Get Started</Link>
                </Button>
              </div>

              <div className="border-t border-slate-200 dark:border-gray-700 p-8">
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-teal-400 dark:text-teal-300 mr-2 flex-shrink-0" />
                    <span className="text-slate-600 dark:text-gray-300">
                      100GB secure storage
                    </span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-teal-400 dark:text-teal-300 mr-2 flex-shrink-0" />
                    <span className="text-slate-600 dark:text-gray-300">
                      Advanced encryption
                    </span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-teal-400 dark:text-teal-300 mr-2 flex-shrink-0" />
                    <span className="text-slate-600 dark:text-gray-300">
                      Unlimited file sharing
                    </span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-teal-400 dark:text-teal-300 mr-2 flex-shrink-0" />
                    <span className="text-slate-600 dark:text-gray-300">
                      Priority support
                    </span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-teal-400 dark:text-teal-300 mr-2 flex-shrink-0" />
                    <span className="text-slate-600 dark:text-gray-300">
                      Two-factor authentication
                    </span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-teal-400 dark:text-teal-300 mr-2 flex-shrink-0" />
                    <span className="text-slate-600 dark:text-gray-300">
                      30-day version history
                    </span>
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* Enterprise Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-700 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl dark:hover:shadow-teal-500/5 transition-all duration-300"
            >
              <div className="p-8">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                  Enterprise
                </h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-slate-900 dark:text-white">
                    ${billingPeriod === "monthly" ? "29.99" : "23.99"}
                  </span>
                  <span className="text-slate-500 dark:text-gray-400">
                    /month
                  </span>
                </div>
                <p className="text-slate-600 dark:text-gray-300 mb-6">
                  Maximum security & control for organizations
                </p>

                <Button
                  className="w-full bg-gradient-to-r from-teal-400 to-[#4299e1] dark:from-teal-500 dark:to-blue-600 hover:opacity-90 text-white shadow-md dark:shadow-teal-500/10 transition-all duration-200"
                  asChild
                >
                  <Link href="/create-account?plan=enterprise">
                    Get Started
                  </Link>
                </Button>
              </div>

              <div className="border-t border-slate-200 dark:border-gray-700 p-8">
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-teal-400 dark:text-teal-300 mr-2 flex-shrink-0" />
                    <span className="text-slate-600 dark:text-gray-300">
                      1TB secure storage
                    </span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-teal-400 dark:text-teal-300 mr-2 flex-shrink-0" />
                    <span className="text-slate-600 dark:text-gray-300">
                      Military-grade encryption
                    </span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-teal-400 dark:text-teal-300 mr-2 flex-shrink-0" />
                    <span className="text-slate-600 dark:text-gray-300">
                      Team collaboration features
                    </span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-teal-400 dark:text-teal-300 mr-2 flex-shrink-0" />
                    <span className="text-slate-600 dark:text-gray-300">
                      24/7 phone & email support
                    </span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-teal-400 dark:text-teal-300 mr-2 flex-shrink-0" />
                    <span className="text-slate-600 dark:text-gray-300">
                      Advanced security controls
                    </span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-teal-400 dark:text-teal-300 mr-2 flex-shrink-0" />
                    <span className="text-slate-600 dark:text-gray-300">
                      Unlimited version history
                    </span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-teal-400 dark:text-teal-300 mr-2 flex-shrink-0" />
                    <span className="text-slate-600 dark:text-gray-300">
                      Custom integration options
                    </span>
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>

          <div className="mt-20 bg-slate-100 dark:bg-gray-900 rounded-2xl p-8 md:p-12">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">
                Frequently Asked Questions
              </h2>
              <p className="text-slate-600 dark:text-gray-300 max-w-2xl mx-auto">
                Find answers to common questions about our pricing and plans
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md dark:hover:shadow-teal-500/5 transition-all duration-300">
                <h3 className="text-lg font-medium mb-2 text-slate-900 dark:text-white">
                  Can I change plans later?
                </h3>
                <p className="text-slate-600 dark:text-gray-300">
                  Yes, you can upgrade or downgrade your plan at any time.
                  Changes to your subscription will be applied immediately.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md dark:hover:shadow-teal-500/5 transition-all duration-300">
                <h3 className="text-lg font-medium mb-2 text-slate-900 dark:text-white">
                  Is there a trial period?
                </h3>
                <p className="text-slate-600 dark:text-gray-300">
                  We offer a 14-day free trial for our Pro and Enterprise plans.
                  No credit card required until you decide to continue.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md dark:hover:shadow-teal-500/5 transition-all duration-300">
                <h3 className="text-lg font-medium mb-2 text-slate-900 dark:text-white">
                  How secure is my data?
                </h3>
                <p className="text-slate-600 dark:text-gray-300">
                  All plans include end-to-end encryption. Pro and Enterprise
                  plans offer additional security features like two-factor
                  authentication and advanced access controls.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md dark:hover:shadow-teal-500/5 transition-all duration-300">
                <h3 className="text-lg font-medium mb-2 text-slate-900 dark:text-white">
                  Do you offer refunds?
                </h3>
                <p className="text-slate-600 dark:text-gray-300">
                  We offer a 30-day money-back guarantee if you&apos;re not
                  satisfied with our service. We&apos;re here to help! Contact
                  our support team for assistance.
                </p>
              </div>
            </div>
          </div>
        </div>
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
                className="text-sm text-slate-600 dark:text-gray-400 hover:text-teal-400 dark:hover:text-teal-300 transition-colors"
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

export default function PricingPage() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <PricingPageContent />
    </ThemeProvider>
  );
}
