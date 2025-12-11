"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronDown, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

function FAQContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "What is TRISAFE?",
      answer:
        "TRISAFE is a secure cloud storage service that allows you to store, access, and share your files with end-to-end encryption. We prioritize your privacy and security while providing an easy-to-use platform for all your file storage needs.",
    },
    {
      question: "How does encryption work on TRISAFE?",
      answer:
        "TRISAFE uses end-to-end encryption to protect your files. Files are encrypted on your device before being uploaded to our servers using your unique passphrase. This means only you can decrypt and access your files - even we cannot see the contents of your files.",
    },
    {
      question: "What happens if I forget my passphrase?",
      answer:
        "Your passphrase is the key to decrypting your files. For security reasons, we do not store your passphrase and cannot recover it if forgotten. We strongly recommend safely storing your passphrase. If forgotten, you will not be able to access your encrypted files.",
    },
    {
      question: "Is there a file size limit?",
      answer:
        "Free accounts have a 2GB file size limit per upload. Premium accounts can upload files up to 10GB in size. If you need to transfer larger files, you can split them into smaller parts or contact our support team for assistance.",
    },
    {
      question: "How much storage do I get?",
      answer:
        "Free accounts include 5GB of storage. Our Premium plan provides 100GB, and our Business plan offers 1TB of secure storage. Custom enterprise solutions with larger storage options are also available for organizations with specific needs.",
    },
    {
      question: "Can I share files with others?",
      answer:
        "Yes, you can share files securely with others, even if they don't have a TRISAFE account. You can generate secure links with optional password protection, expiration dates, and download limits to maintain control over your shared content.",
    },
    {
      question: "Is TRISAFE available on mobile devices?",
      answer:
        "Yes, TRISAFE is available as a web application and has dedicated apps for iOS and Android devices. You can access, upload, and manage your files from any device with an internet connection.",
    },
    {
      question: "How secure is TRISAFE?",
      answer:
        "TRISAFE employs industry-leading security measures including end-to-end encryption, two-factor authentication, and regular security audits. Your files are encrypted before they leave your device, ensuring maximum privacy and protection against unauthorized access.",
    },
    {
      question: "What file types can I store?",
      answer:
        "TRISAFE supports all file types including documents, images, videos, audio files, archives, and more. There are no restrictions on the types of files you can store, as long as they comply with our terms of service.",
    },
    {
      question: "How do I cancel my subscription?",
      answer:
        "You can cancel your subscription at any time from your account settings. Navigate to 'Subscription' and click on 'Cancel Subscription'. Your account will remain active until the end of the current billing period.",
    },
  ];

  const filteredFaqs = searchQuery
    ? faqs.filter(
        (faq) =>
          faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : faqs;

  const toggleAccordion = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

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
                Frequently Asked Questions
              </h1>
              <p className="text-xl text-slate-600 dark:text-gray-300 max-w-2xl">
                Find answers to common questions about TRISAFE&apos;s secure
                storage solution
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

            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md p-8">
              {/* Search box */}
              <div className="mb-8">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-gray-500" />
                  <Input
                    type="text"
                    placeholder="Search for questions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 border-slate-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-slate-900 dark:text-gray-100"
                  />
                </div>
              </div>

              {/* FAQ accordions */}
              <div className="space-y-4">
                {filteredFaqs.length > 0 ? (
                  filteredFaqs.map((faq, index) => (
                    <div
                      key={index}
                      className="border border-slate-200 dark:border-gray-800 rounded-lg overflow-hidden"
                    >
                      <button
                        onClick={() => toggleAccordion(index)}
                        className="w-full flex justify-between items-center p-4 bg-slate-50 dark:bg-gray-800 hover:bg-slate-100 dark:hover:bg-gray-700 transition-colors text-left"
                      >
                        <h3 className="font-medium text-slate-900 dark:text-white">
                          {faq.question}
                        </h3>
                        <ChevronDown
                          className={`w-5 h-5 text-slate-500 dark:text-gray-400 transition-transform ${
                            expandedIndex === index
                              ? "transform rotate-180"
                              : ""
                          }`}
                        />
                      </button>
                      {expandedIndex === index && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="p-4 bg-white dark:bg-gray-900 text-slate-600 dark:text-gray-300"
                        >
                          <p>{faq.answer}</p>
                        </motion.div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-slate-600 dark:text-gray-400">
                      No results found for &quot;{searchQuery}&quot;. Try a
                      different search term.
                    </p>
                    <Button
                      onClick={() => setSearchQuery("")}
                      variant="outline"
                      className="mt-4"
                    >
                      Clear search
                    </Button>
                  </div>
                )}
              </div>

              {/* Still have questions section */}
              <div className="mt-12 pt-8 border-t border-slate-200 dark:border-gray-800">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                    Still have questions?
                  </h2>
                  <p className="text-slate-600 dark:text-gray-300 mb-6">
                    Can&apos;t find the answer you&apos;re looking for? Our
                    support team is ready to help.
                  </p>
                  <Button
                    asChild
                    className="bg-gradient-to-r from-teal-400 to-[#4299e1] dark:from-teal-500 dark:to-blue-600 hover:opacity-90 text-white shadow-md"
                  >
                    <Link href="/support/contact">Contact Support</Link>
                  </Button>
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
                className="text-sm text-slate-600 dark:text-gray-400 hover:text-teal-400 dark:hover:text-teal-300 transition-colors"
              >
                <Link href="/legal/privacy">Privacy</Link>
              </Button>
              <Button
                asChild
                variant="link"
                className="text-sm text-slate-600 dark:text-gray-400 hover:text-teal-400 dark:hover:text-teal-300 transition-colors font-semibold"
              >
                <Link href="/support/faq">FAQ</Link>
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

export default function FAQPage() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <FAQContent />
    </ThemeProvider>
  );
}
