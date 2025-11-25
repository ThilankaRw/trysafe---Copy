import React from "react";
import {
  FileText,
  Image as ImageIcon,
  Music,
  Video,
  Archive,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDashboard } from "@/contexts/DashboardContext";
import { motion, AnimatePresence } from "framer-motion";

export default function RightPanel() {
  const { activeRightPanel, setActiveRightPanel } = useDashboard();
  const isOpen = activeRightPanel === "storage";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/20 z-40"
            onClick={() => setActiveRightPanel(null)}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.2, ease: "easeOut" }}
            className="fixed right-0 top-0 bottom-0 w-[400px] bg-white dark:bg-gray-900 shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Storage usage
              </h3>
              <button
                onClick={() => setActiveRightPanel(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Storage Usage */}
              <div className="mb-8">
                <div className="flex flex-col items-center justify-center relative mb-4">
                  {/* Simple CSS Gauge/Chart representation */}
                  <div className="relative w-40 h-20 overflow-hidden">
                    <div className="absolute top-0 left-0 w-40 h-40 rounded-full border-[12px] border-gray-100 dark:border-gray-800"></div>
                    <div className="absolute top-0 left-0 w-40 h-40 rounded-full border-[12px] border-transparent border-t-[rgb(31,111,130)] border-r-[rgb(31,111,130)] rotate-[-45deg]"></div>
                  </div>
                  <div className="text-center mt-2">
                    <p className="text-xl font-bold text-gray-900 dark:text-white">
                      5 GB
                    </p>
                    <p className="text-xs text-gray-500">Out Of 15 GB</p>
                  </div>
                </div>
              </div>

              {/* File Type Breakdown */}
              <div className="flex-1 space-y-6">
                <FileTypeItem
                  icon={<FileText className="w-5 h-5 text-blue-500" />}
                  bg="bg-blue-50 dark:bg-blue-900/20"
                  label="Documents"
                  count="25 files"
                  size="185.8 MB"
                />
                <FileTypeItem
                  icon={<ImageIcon className="w-5 h-5 text-yellow-500" />}
                  bg="bg-yellow-50 dark:bg-yellow-900/20"
                  label="Photos"
                  count="25 files"
                  size="185.8 MB"
                />
                <FileTypeItem
                  icon={<Video className="w-5 h-5 text-green-500" />}
                  bg="bg-green-50 dark:bg-green-900/20"
                  label="Videos"
                  count="25 files"
                  size="185.8 MB"
                />
                <FileTypeItem
                  icon={<Music className="w-5 h-5 text-pink-500" />}
                  bg="bg-pink-50 dark:bg-pink-900/20"
                  label="Music"
                  count="25 files"
                  size="185.8 MB"
                />
                <FileTypeItem
                  icon={<Archive className="w-5 h-5 text-gray-500" />}
                  bg="bg-gray-50 dark:bg-gray-800"
                  label="Others files"
                  count="25 files"
                  size="185.8 MB"
                />
              </div>

              {/* Upgrade Card */}
              <div className="mt-8 bg-[rgb(31,111,130)] rounded-2xl p-6 text-white relative overflow-hidden">
                {/* Abstract shapes for bg decoration */}
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
                <div className="absolute -left-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>

                <p className="text-sm font-medium mb-1 opacity-90">
                  Be quick and upgrade
                </p>
                <p className="text-xs opacity-80 mb-4 leading-relaxed">
                  Get enough storage space for all your data before it runs out.
                </p>
                <Button
                  variant="secondary"
                  size="sm"
                  className="w-full bg-white text-[rgb(31,111,130)] hover:bg-gray-100 border-none"
                >
                  Upgrade now
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function FileTypeItem({
  icon,
  label,
  count,
  size,
  bg,
}: {
  icon: React.ReactNode;
  label: string;
  count: string;
  size: string;
  bg: string;
}) {
  return (
    <div className="flex items-center gap-4">
      <div
        className={`w-12 h-12 rounded-2xl flex items-center justify-center ${bg}`}
      >
        {icon}
      </div>
      <div className="flex-1">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
          {label}
        </h4>
        <p className="text-xs text-gray-500">
          {count} | {size}
        </p>
      </div>
    </div>
  );
}
