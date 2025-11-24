import React from "react";
import { FileText, Image as ImageIcon, Music, Video, Archive, PieChart } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RightPanel() {
  return (
    <aside className="w-80 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 p-6 hidden xl:flex flex-col overflow-y-auto">
      {/* Storage Usage */}
      <div className="mb-8">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Storage usage</h3>
        <div className="flex flex-col items-center justify-center relative mb-4">
            {/* Simple CSS Gauge/Chart representation */}
            <div className="relative w-40 h-20 overflow-hidden">
                <div className="absolute top-0 left-0 w-40 h-40 rounded-full border-[12px] border-gray-100 dark:border-gray-800"></div>
                <div className="absolute top-0 left-0 w-40 h-40 rounded-full border-[12px] border-transparent border-t-[rgb(31,111,130)] border-r-[rgb(31,111,130)] rotate-[-45deg]"></div>
            </div>
            <div className="text-center mt-2">
                <p className="text-xl font-bold text-gray-900 dark:text-white">15.9 GB</p>
                <p className="text-xs text-gray-500">Out Of 100 GB</p>
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
         
         <p className="text-sm font-medium mb-1 opacity-90">Be quick and upgrade</p>
         <p className="text-xs opacity-80 mb-4 leading-relaxed">
           Get enough storage space for all your data before it runs out.
         </p>
         <Button variant="secondary" size="sm" className="w-full bg-white text-[rgb(31,111,130)] hover:bg-gray-100 border-none">
           Upgrade now
         </Button>
      </div>
    </aside>
  );
}

function FileTypeItem({ icon, label, count, size, bg }: { icon: React.ReactNode, label: string, count: string, size: string, bg: string }) {
  return (
    <div className="flex items-center gap-4">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${bg}`}>
        {icon}
      </div>
      <div className="flex-1">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{label}</h4>
        <p className="text-xs text-gray-500">{count} | {size}</p>
      </div>
    </div>
  );
}

