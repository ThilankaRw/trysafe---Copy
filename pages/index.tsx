"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { LinkedButton } from "@/components/ui/linked-button";
import {
  Shield,
  Zap,
  Globe,
  ArrowRight,
  Database,
  Lock,
  Home,
  FileText,
  Clock,
  Trash,
  Share2,
  Sun,
  Moon,
} from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ThemeProvider } from "@/components/theme-provider";
import { useTheme } from "next-themes";
import Link from "next/link";

export default function CloudStorageLanding() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <LandingPageContent />
    </ThemeProvider>
  );
}

function LandingPageContent() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // Ensure theme toggle only renders client-side to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.8 } },
  };

  const slideIn = {
    hidden: { x: -60, opacity: 0 },
    show: {
      x: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100, damping: 20 },
    },
  };

  const slideUp = {
    hidden: { y: 100, opacity: 0 },
    show: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100, damping: 20 },
    },
  };

  const stagger = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-gray-950 transition-colors duration-300">
      {/* Header */}
      <header className="px-8 border-b border-slate-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/90 backdrop-blur-sm sticky top-0 z-10">
        <div className="container flex h-20 items-center justify-between">
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

          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="#features"
              className="text-sm font-medium text-slate-600 dark:text-gray-300 hover:text-teal-400 dark:hover:text-teal-300 transition-colors"
            >
              Features
            </Link>
            <a
              href="#pricing"
              className="text-sm font-medium text-slate-600 dark:text-gray-300 hover:text-teal-400 dark:hover:text-teal-300 transition-colors"
            >
              Pricing
            </a>
            <a
              href="#faq"
              className="text-sm font-medium text-slate-600 dark:text-gray-300 hover:text-teal-400 dark:hover:text-teal-300 transition-colors"
            >
              FAQ
            </a>
          </nav>

          <div className="flex items-center gap-4">
            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="rounded-full w-9 h-9 bg-transparent dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white transition-all duration-200"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>
            )}
            <LinkedButton
              href="/login"
              variant="ghost"
              className="hidden md:inline-flex text-slate-700 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-gray-800 transition-all duration-200"
            >
              Log in
            </LinkedButton>
            <LinkedButton
              href="/create-account"
              className="bg-gradient-to-r from-teal-400 to-[#4299e1] dark:from-teal-500 dark:to-blue-600 hover:opacity-90 text-white shadow-md dark:shadow-teal-500/10 transition-all duration-200"
            >
              Sign up
            </LinkedButton>
          </div>
        </div>
      </header>

      <main className="flex-1 px-8">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 md:py-32">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-white dark:from-gray-950 dark:to-gray-900 -z-10" />

          <div className="absolute top-0 right-0 -z-10 opacity-10 dark:opacity-5">
            <svg
              width="800"
              height="800"
              viewBox="0 0 800 800"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="400" cy="400" r="400" fill="url(#paint0_linear)" />
              <defs>
                <linearGradient
                  id="paint0_linear"
                  x1="400"
                  y1="0"
                  x2="400"
                  y2="800"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#2BBCBA" />
                  <stop offset="1" stopColor="#4299e1" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <div className="container grid gap-8 md:grid-cols-2 items-center">
            <div className="flex flex-col gap-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-slate-900 dark:text-white">
                Welcome to{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-[#4299e1] dark:from-teal-300 dark:to-blue-400">
                  Trisafe
                </span>
              </h1>
              <p className="text-xl text-slate-600 dark:text-gray-300">
                Secure, Reliable, and Seamless Cloud Storage
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <LinkedButton
                    href="/create-account"
                    size="lg"
                    className="bg-gradient-to-r from-teal-400 to-[#4299e1] dark:from-teal-500 dark:to-blue-600 hover:opacity-90 text-white shadow-lg shadow-cyan-500/20 dark:shadow-cyan-500/5"
                  >
                    Get Started
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{
                        repeat: Number.POSITIVE_INFINITY,
                        duration: 1.5,
                      }}
                    >
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </motion.div>
                  </LinkedButton>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link href="#features">
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-slate-300 dark:border-gray-700 text-slate-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-gray-800 dark:hover:border-gray-600 transition-all duration-200"
                    >
                      Learn More
                    </Button>
                  </Link>
                </motion.div>
              </div>
            </div>

            <div className="relative h-[300px] md:h-[400px] flex items-center justify-center">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-full h-full max-w-[500px] max-h-[400px]">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-gradient-to-r from-teal-400 to-[#4299e1] rounded-full blur-3xl opacity-20 dark:opacity-15" />
                  <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-teal-400 rounded-full blur-2xl opacity-10 dark:opacity-10" />
                  <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-[#4299e1] rounded-full blur-xl opacity-10 dark:opacity-10" />

                  <div className="relative z-10 grid grid-cols-2 gap-4 p-4">
                    <motion.div
                      whileHover={{ rotate: 0, scale: 1.05 }}
                      className="bg-white dark:bg-gray-800 backdrop-blur-sm border border-slate-200 dark:border-gray-700 rounded-xl shadow-lg p-4 transform rotate-3 transition-all"
                    >
                      <Database className="h-8 w-8 text-teal-400 dark:text-teal-300 mb-2" />
                      <h3 className="font-medium text-slate-900 dark:text-white">
                        Storage
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-gray-400">
                        100GB Free
                      </p>
                    </motion.div>
                    <motion.div
                      whileHover={{ rotate: 0, scale: 1.05 }}
                      className="bg-white dark:bg-gray-800 backdrop-blur-sm border border-slate-200 dark:border-gray-700 rounded-xl shadow-lg p-4 transform -rotate-3 transition-all"
                    >
                      <Lock className="h-8 w-8 text-[#4299e1] dark:text-blue-400 mb-2" />
                      <h3 className="font-medium text-slate-900 dark:text-white">
                        Security
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-gray-400">
                        End-to-end
                      </p>
                    </motion.div>
                    <motion.div
                      whileHover={{ rotate: 0, scale: 1.05 }}
                      className="bg-white dark:bg-gray-800 backdrop-blur-sm border border-slate-200 dark:border-gray-700 rounded-xl shadow-lg p-4 transform -rotate-6 transition-all"
                    >
                      <Zap className="h-8 w-8 text-teal-400 dark:text-teal-300 mb-2" />
                      <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">
                        Speed
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-gray-400">
                        Fast sync
                      </p>
                    </motion.div>
                    <motion.div
                      whileHover={{ rotate: 0, scale: 1.05 }}
                      className="bg-white dark:bg-gray-800 backdrop-blur-sm border border-slate-200 dark:border-gray-700 rounded-xl shadow-lg p-4 transform rotate-6 transition-all"
                    >
                      <Globe className="h-8 w-8 text-[#4299e1] dark:text-blue-400 mb-2" />
                      <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">
                        Access
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-gray-400">
                        Anywhere
                      </p>
                    </motion.div>
                  </div>

                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 flex items-center justify-center"
                  >
                    <Image
                      src="/2ss.png"
                      alt="TRISAFE Shield Logo"
                      width={160}
                      height={160}
                      className="w-40 h-40 drop-shadow-xl"
                    />
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-white dark:bg-gray-900">
          <div className="container">
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeIn}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white">
                Why Choose{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-[#4299e1] dark:from-teal-300 dark:to-blue-400">
                  TRISAFE
                </span>
                ?
              </h2>
              <p className="text-xl text-slate-600 dark:text-gray-300 max-w-2xl mx-auto">
                Our cloud storage solution offers the perfect balance of
                security, accessibility, and performance.
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              variants={stagger}
              className="grid md:grid-cols-3 gap-8"
            >
              <motion.div
                variants={slideUp}
                whileHover={{ y: -10, transition: { duration: 0.2 } }}
                className="bg-gradient-to-br from-slate-50 to-white dark:from-gray-800 dark:to-gray-900 p-8 rounded-xl border border-slate-200 dark:border-gray-700 shadow-lg shadow-slate-200/50 dark:shadow-none"
              >
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="w-12 h-12 bg-gradient-to-r from-teal-400/20 to-[#4299e1]/20 dark:from-teal-500/20 dark:to-blue-600/20 rounded-lg flex items-center justify-center mb-4"
                >
                  <Shield className="h-6 w-6 text-teal-400 dark:text-teal-300" />
                </motion.div>
                <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">
                  Bank-Level Security
                </h3>
                <p className="text-slate-600 dark:text-gray-300">
                  Your files are encrypted end-to-end, ensuring only you can
                  access your sensitive data.
                </p>
              </motion.div>

              <motion.div
                variants={slideUp}
                whileHover={{ y: -10, transition: { duration: 0.2 } }}
                className="bg-gradient-to-br from-slate-50 to-white dark:from-gray-800 dark:to-gray-900 p-8 rounded-xl border border-slate-200 dark:border-gray-700 shadow-lg shadow-slate-200/50 dark:shadow-none"
              >
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="w-12 h-12 bg-gradient-to-r from-teal-400/20 to-[#4299e1]/20 dark:from-teal-500/20 dark:to-blue-600/20 rounded-lg flex items-center justify-center mb-4"
                >
                  <Globe className="h-6 w-6 text-[#4299e1] dark:text-blue-400" />
                </motion.div>
                <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">
                  Access Anywhere
                </h3>
                <p className="text-slate-600 dark:text-gray-300">
                  Reach your files from any device, anywhere in the world, at
                  any time.
                </p>
              </motion.div>

              <motion.div
                variants={slideUp}
                whileHover={{ y: -10, transition: { duration: 0.2 } }}
                className="bg-gradient-to-br from-slate-50 to-white dark:from-gray-800 dark:to-gray-900 p-8 rounded-xl border border-slate-200 dark:border-gray-700 shadow-lg shadow-slate-200/50 dark:shadow-none"
              >
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="w-12 h-12 bg-gradient-to-r from-teal-400/20 to-[#4299e1]/20 dark:from-teal-500/20 dark:to-blue-600/20 rounded-lg flex items-center justify-center mb-4"
                >
                  <Zap className="h-6 w-6 text-teal-400 dark:text-teal-300" />
                </motion.div>
                <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">
                  Lightning Fast Sync
                </h3>
                <p className="text-slate-600 dark:text-gray-300">
                  Our advanced technology ensures your files sync quickly across
                  all your devices.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Navigation Preview */}
        <section className="py-20 bg-slate-50 dark:bg-gray-950">
          <div className="container">
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeIn}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white">
                Simple &{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-[#4299e1] dark:from-teal-300 dark:to-blue-400">
                  Intuitive
                </span>{" "}
                Navigation
              </h2>
              <p className="text-xl text-slate-600 dark:text-gray-300 max-w-2xl mx-auto">
                Access all your files with our easy-to-use interface
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              variants={slideIn}
              whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
              className="max-w-5xl mx-auto bg-white dark:bg-gray-900 rounded-xl border border-slate-200 dark:border-gray-700 shadow-xl overflow-hidden"
            >
              <div className="flex">
                {/* Sidebar */}
                <div className="w-64 border-r border-slate-200 dark:border-gray-800 p-4 hidden md:block">
                  <div className="space-y-1">
                    <motion.div
                      whileHover={{ x: 5, transition: { duration: 0.2 } }}
                    >
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-slate-700 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-gray-800"
                      >
                        <Home className="mr-2 h-4 w-4" />
                        Home
                      </Button>
                    </motion.div>
                    <motion.div
                      whileHover={{ x: 5, transition: { duration: 0.2 } }}
                    >
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-teal-400 dark:text-teal-300 bg-slate-100 dark:bg-gray-800"
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        My Drive
                      </Button>
                    </motion.div>
                    <motion.div
                      whileHover={{ x: 5, transition: { duration: 0.2 } }}
                    >
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-slate-700 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-gray-800"
                      >
                        <Share2 className="mr-2 h-4 w-4" />
                        Shared
                      </Button>
                    </motion.div>
                    <motion.div
                      whileHover={{ x: 5, transition: { duration: 0.2 } }}
                    >
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-slate-700 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-gray-800"
                      >
                        <Clock className="mr-2 h-4 w-4" />
                        Recent
                      </Button>
                    </motion.div>
                    <motion.div
                      whileHover={{ x: 5, transition: { duration: 0.2 } }}
                    >
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-slate-700 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-gray-800"
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Trash
                      </Button>
                    </motion.div>
                  </div>
                </div>

                {/* Main content */}
                <div className="flex-1 p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                      My Drive
                    </h3>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button className="bg-gradient-to-r from-teal-400 to-[#4299e1] hover:opacity-90 text-white">
                        Upload
                      </Button>
                    </motion.div>
                  </div>

                  <div className="space-y-4">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                      viewport={{ once: true }}
                      whileHover={{ scale: 1.02, x: 5 }}
                      className="p-4 rounded-lg border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-800 flex items-center justify-between"
                    >
                      <div className="flex items-center">
                        <FileText className="h-8 w-8 text-teal-400 mr-3" />
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">
                            Project Report.pdf
                          </p>
                          <p className="text-xs text-slate-500 dark:text-gray-400">
                            2.4 MB • Modified yesterday
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white"
                      >
                        Download
                      </Button>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      viewport={{ once: true }}
                      whileHover={{ scale: 1.02, x: 5 }}
                      className="p-4 rounded-lg border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-800 flex items-center justify-between"
                    >
                      <div className="flex items-center">
                        <FileText className="h-8 w-8 text-[#4299e1] mr-3" />
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">
                            Financial Summary.xlsx
                          </p>
                          <p className="text-xs text-slate-500 dark:text-gray-400">
                            1.8 MB • Modified 3 days ago
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white"
                      >
                        Download
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-20 bg-gradient-to-br from-slate-100 to-white dark:from-gray-900 dark:to-gray-950">
          <div className="container">
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              variants={container}
              className="max-w-3xl mx-auto text-center"
            >
              <motion.h2
                variants={item}
                className="text-3xl md:text-4xl font-bold mb-6 text-slate-900 dark:text-white"
              >
                Ready to{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-[#4299e1] dark:from-teal-300 dark:to-blue-400">
                  secure
                </span>{" "}
                your files?
              </motion.h2>
              <motion.p
                variants={item}
                className="text-xl text-slate-600 dark:text-gray-300 mb-8"
              >
                Join thousands of users who trust TRISAFE with their important
                data. Get started today with 10GB of free storage.
              </motion.p>
              <motion.div
                variants={item}
                className="flex flex-col sm:flex-row justify-center gap-4"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <LinkedButton
                    href="/create-account"
                    size="lg"
                    className="bg-gradient-to-r from-teal-400 to-[#4299e1] dark:from-teal-500 dark:to-blue-600 hover:opacity-90 text-white shadow-lg shadow-cyan-500/20 dark:shadow-cyan-500/5"
                  >
                    Create Free Account
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{
                        repeat: Number.POSITIVE_INFINITY,
                        duration: 1.5,
                      }}
                    >
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </motion.div>
                  </LinkedButton>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-slate-300 dark:border-gray-700 text-slate-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-gray-800 dark:hover:border-gray-600"
                    asChild
                  >
                    <Link href="/pricing">View Pricing</Link>
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </section>
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
              <LinkedButton
                href="/legal/terms"
                variant="link"
                className="text-sm text-slate-600 dark:text-gray-400 hover:text-teal-400 dark:hover:text-teal-300 transition-colors"
              >
                Terms
              </LinkedButton>
              <LinkedButton
                href="/legal/privacy"
                variant="link"
                className="text-sm text-slate-600 dark:text-gray-400 hover:text-teal-400 dark:hover:text-teal-300 transition-colors"
              >
                Privacy
              </LinkedButton>
              <LinkedButton
                href="/support/contact"
                variant="link"
                className="text-sm text-slate-600 dark:text-gray-400 hover:text-teal-400 dark:hover:text-teal-300 transition-colors"
              >
                Contact
              </LinkedButton>
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
