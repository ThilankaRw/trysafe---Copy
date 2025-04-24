"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, Mail, Phone, MapPin, Check, Loader2 } from "lucide-react";

function ContactContent() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormState({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    }, 1500);
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
                Contact Us
              </h1>
              <p className="text-xl text-slate-600 dark:text-gray-300 max-w-2xl">
                We&apos;re here to help with any questions about our secure
                storage solutions
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
          className="max-w-6xl mx-auto"
        >
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center text-teal-500 dark:text-teal-400 hover:text-teal-600 dark:hover:text-teal-300 transition-colors mb-8"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="md:col-span-1">
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md p-8 space-y-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                  Get in Touch
                </h2>

                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-teal-100 dark:bg-teal-900/30 p-3 rounded-full">
                      <Mail className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                    </div>
                    <div>
                      <h3 className="text-base font-medium text-slate-900 dark:text-white">
                        Email Us
                      </h3>
                      <p className="mt-1 text-sm text-slate-600 dark:text-gray-400">
                        Our friendly team is here to help.
                      </p>
                      <a
                        href="mailto:trisafeteam@gmail.com"
                        className="mt-2 inline-block text-sm text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 transition-colors"
                      >
                        trisafeteam@gmail.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
                      <Phone className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-base font-medium text-slate-900 dark:text-white">
                        Call Us
                      </h3>
                      <p className="mt-1 text-sm text-slate-600 dark:text-gray-400">
                        Mon-Fri from 8am to 5pm EST.
                      </p>
                      <a
                        href="tel:066-8731798"
                        className="mt-2 inline-block text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                      >
                        066-8731798
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-emerald-100 dark:bg-emerald-900/30 p-3 rounded-full">
                      <MapPin className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="text-base font-medium text-slate-900 dark:text-white">
                        Visit Us
                      </h3>
                      <p className="mt-1 text-sm text-slate-600 dark:text-gray-400">
                        Come say hello at our office HQ.
                      </p>
                      <p className="mt-2 text-sm text-slate-800 dark:text-gray-300">
                        No 115 ,
                        <br />
                        Meepe, Padukka , Sri Lanka
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-200 dark:border-gray-800">
                  <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-4">
                    Follow Us
                  </h3>
                  <div className="flex space-x-4">
                    <a
                      href="#"
                      className="bg-slate-100 dark:bg-gray-800 p-2 rounded-full hover:bg-slate-200 dark:hover:bg-gray-700 transition-colors"
                      aria-label="Twitter"
                    >
                      <svg
                        className="h-5 w-5 text-slate-600 dark:text-gray-400"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                      </svg>
                    </a>

                    <a
                      href="#"
                      className="bg-slate-100 dark:bg-gray-800 p-2 rounded-full hover:bg-slate-200 dark:hover:bg-gray-700 transition-colors"
                      aria-label="GitHub"
                    >
                      <svg
                        className="h-5 w-5 text-slate-600 dark:text-gray-400"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </a>

                    <a
                      href="#"
                      className="bg-slate-100 dark:bg-gray-800 p-2 rounded-full hover:bg-slate-200 dark:hover:bg-gray-700 transition-colors"
                      aria-label="LinkedIn"
                    >
                      <svg
                        className="h-5 w-5 text-slate-600 dark:text-gray-400"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md p-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                  Send us a Message
                </h2>

                {isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-lg p-6 text-center"
                  >
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-teal-100 dark:bg-teal-900/30 mb-4">
                      <Check className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                    </div>
                    <h3 className="text-lg font-medium text-teal-800 dark:text-teal-300 mb-2">
                      Message Sent Successfully!
                    </h3>
                    <p className="text-teal-700 dark:text-teal-400 mb-4">
                      Thank you for reaching out. We&apos;ll get back to you as
                      soon as possible.
                    </p>
                    <Button
                      onClick={() => setIsSubmitted(false)}
                      className="bg-teal-600 hover:bg-teal-700 text-white dark:bg-teal-700 dark:hover:bg-teal-600 transition-colors"
                    >
                      Send Another Message
                    </Button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2"
                        >
                          Full Name
                        </label>
                        <Input
                          id="name"
                          name="name"
                          value={formState.name}
                          onChange={handleChange}
                          placeholder="John Doe"
                          required
                          className="w-full border-slate-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-slate-900 dark:text-gray-100 focus:ring-teal-500 dark:focus:ring-teal-400 focus:border-teal-500 dark:focus:border-teal-400"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2"
                        >
                          Email Address
                        </label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formState.email}
                          onChange={handleChange}
                          placeholder="john@example.com"
                          required
                          className="w-full border-slate-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-slate-900 dark:text-gray-100 focus:ring-teal-500 dark:focus:ring-teal-400 focus:border-teal-500 dark:focus:border-teal-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="subject"
                        className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2"
                      >
                        Subject
                      </label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formState.subject}
                        onChange={handleChange}
                        placeholder="How can we help you?"
                        required
                        className="w-full border-slate-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-slate-900 dark:text-gray-100 focus:ring-teal-500 dark:focus:ring-teal-400 focus:border-teal-500 dark:focus:border-teal-400"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="message"
                        className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2"
                      >
                        Message
                      </label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formState.message}
                        onChange={handleChange}
                        placeholder="Tell us how we can help you..."
                        rows={6}
                        required
                        className="w-full border-slate-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-slate-900 dark:text-gray-100 focus:ring-teal-500 dark:focus:ring-teal-400 focus:border-teal-500 dark:focus:border-teal-400"
                      />
                    </div>

                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-gradient-to-r from-teal-400 to-[#4299e1] dark:from-teal-500 dark:to-blue-600 hover:opacity-90 text-white shadow-md dark:shadow-teal-500/10 transition-all duration-200 px-8 py-2"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          "Send Message"
                        )}
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-gray-800 py-8 bg-white dark:bg-gray-900 px-8 mt-12">
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

export default function ContactPage() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <ContactContent />
    </ThemeProvider>
  );
}
