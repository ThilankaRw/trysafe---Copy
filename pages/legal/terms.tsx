"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

function TermsOfServiceContent() {
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
                Terms of Service
              </h1>
              <p className="text-xl text-slate-600 dark:text-gray-300 max-w-2xl">
                Guidelines for using TRISAFE&apos;s secure cloud storage service
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
                  Welcome to TRISAFE
                </h2>
                <p className="text-slate-600 dark:text-gray-300">
                  These Terms of Service (&quot;Terms&quot;) govern your use of
                  TRISAFE&apos;s cloud storage service, website, and any related
                  applications or services (collectively, the
                  &quot;Service&quot;). By using our Service, you agree to be
                  bound by these Terms.
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
                  1. Account Registration
                </h2>
                <p className="text-slate-600 dark:text-gray-300">
                  You must register for an account to use our Service. You agree
                  to provide accurate, current, and complete information during
                  the registration process and to update such information to
                  keep it accurate, current, and complete.
                </p>
                <p className="text-slate-600 dark:text-gray-300">
                  You are responsible for safeguarding your password and for all
                  activities that occur under your account. You agree to notify
                  us immediately of any unauthorized use of your account.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  2. User Responsibilities
                </h2>
                <p className="text-slate-600 dark:text-gray-300">
                  You are responsible for all content that you upload, store, or
                  share through our Service. You represent and warrant that:
                </p>
                <ul className="list-disc pl-6 text-slate-600 dark:text-gray-300 space-y-1">
                  <li>
                    You own or have the necessary rights to your content and the
                    right to use it with our Service
                  </li>
                  <li>
                    Your content does not violate the rights of any third party,
                    including privacy rights, publicity rights, copyright,
                    trademark, or other intellectual property rights
                  </li>
                  <li>
                    Your content does not violate any applicable laws or
                    regulations
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  3. Prohibited Activities
                </h2>
                <p className="text-slate-600 dark:text-gray-300">
                  You agree not to use our Service to:
                </p>
                <ul className="list-disc pl-6 text-slate-600 dark:text-gray-300 space-y-1">
                  <li>
                    Upload, store, or share any content that is illegal,
                    harmful, threatening, abusive, harassing, defamatory, or
                    otherwise objectionable
                  </li>
                  <li>
                    Engage in any activity that violates the privacy or
                    intellectual property rights of others
                  </li>
                  <li>
                    Distribute malware, viruses, or any other malicious code
                  </li>
                  <li>
                    Interfere with or disrupt the integrity or performance of
                    the Service
                  </li>
                  <li>
                    Attempt to gain unauthorized access to the Service or
                    related systems
                  </li>
                  <li>Use the Service for any illegal purpose</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  4. Subscription and Billing
                </h2>
                <p className="text-slate-600 dark:text-gray-300">
                  Some aspects of our Service require a paid subscription. You
                  agree to pay all fees associated with your subscription plan.
                  Subscription fees are billed in advance and are non-refundable
                  except as required by law or as explicitly stated in these
                  Terms.
                </p>
                <p className="text-slate-600 dark:text-gray-300">
                  We may change our subscription fees at any time. Any changes
                  to the pricing will be communicated to you in advance. If you
                  do not agree with the price changes, you have the right to
                  cancel your subscription before the changes take effect.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  5. Data Security and Privacy
                </h2>
                <p className="text-slate-600 dark:text-gray-300">
                  We take data security seriously and implement appropriate
                  technical and organizational measures to protect your content.
                  However, no security system is impenetrable, and we cannot
                  guarantee that your content will never be accessed, disclosed,
                  altered, or destroyed.
                </p>
                <p className="text-slate-600 dark:text-gray-300">
                  Our Privacy Policy, which is incorporated into these Terms,
                  explains how we collect, use, and disclose information about
                  you in connection with your use of the Service.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  6. Intellectual Property Rights
                </h2>
                <p className="text-slate-600 dark:text-gray-300">
                  The Service and its original content, features, and
                  functionality are owned by TRISAFE and are protected by
                  international copyright, trademark, patent, trade secret, and
                  other intellectual property or proprietary rights laws.
                </p>
                <p className="text-slate-600 dark:text-gray-300">
                  You retain all rights to your content. By uploading content to
                  our Service, you grant us a limited license to use, store, and
                  copy that content solely for the purpose of providing the
                  Service to you.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  7. Limitation of Liability
                </h2>
                <p className="text-slate-600 dark:text-gray-300">
                  To the maximum extent permitted by law, TRISAFE and its
                  affiliates, officers, employees, agents, partners, and
                  licensors shall not be liable for any indirect, incidental,
                  special, consequential, or punitive damages, including without
                  limitation, loss of profits, data, use, goodwill, or other
                  intangible losses, resulting from:
                </p>
                <ul className="list-disc pl-6 text-slate-600 dark:text-gray-300 space-y-1">
                  <li>
                    Your access to or use of or inability to access or use the
                    Service
                  </li>
                  <li>
                    Any conduct or content of any third party on the Service
                  </li>
                  <li>
                    Unauthorized access, use, or alteration of your
                    transmissions or content
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  8. Term and Termination
                </h2>
                <p className="text-slate-600 dark:text-gray-300">
                  These Terms will remain in full force and effect while you use
                  the Service. We may terminate or suspend your account and
                  access to the Service immediately, without prior notice or
                  liability, for any reason whatsoever, including without
                  limitation if you breach these Terms.
                </p>
                <p className="text-slate-600 dark:text-gray-300">
                  Upon termination, your right to use the Service will
                  immediately cease. If you wish to terminate your account, you
                  may simply discontinue using the Service or contact us to
                  request account deletion.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  9. Changes to Terms
                </h2>
                <p className="text-slate-600 dark:text-gray-300">
                  We reserve the right to modify or replace these Terms at any
                  time. We will provide notice of any material changes through
                  the Service or by other means. Your continued use of the
                  Service after any such changes constitutes your acceptance of
                  the new Terms.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  10. Contact Us
                </h2>
                <p className="text-slate-600 dark:text-gray-300">
                  If you have any questions about these Terms, please contact us
                  at:
                </p>
                <div className="p-4 bg-slate-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-slate-600 dark:text-gray-300">
                    <strong>Email:</strong> legal@trisafe.com
                    <br />
                    <strong>Address:</strong> 123 Security Lane, Encryption
                    City, EC 12345
                    <br />
                    <strong>Phone:</strong> +1 (555) 123-4567
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
                className="text-sm text-slate-600 dark:text-gray-400 hover:text-teal-400 dark:hover:text-teal-300 transition-colors font-semibold"
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

export default function TermsPage() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TermsOfServiceContent />
    </ThemeProvider>
  );
}
