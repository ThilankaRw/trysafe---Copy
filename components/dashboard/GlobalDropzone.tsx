import { motion, AnimatePresence } from "framer-motion";
import { ArrowDown, Plus } from "lucide-react";

interface GlobalDropzoneProps {
  isDragActive: boolean;
}

export default function GlobalDropzone({ isDragActive }: GlobalDropzoneProps) {
  return (
    <AnimatePresence>
      {isDragActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[rgb(15,23,42)]/90 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-[80%] h-[80%] max-w-4xl max-h-[800px] rounded-[32px] border-[3px] border-dashed border-[rgb(99,102,241)] bg-[rgb(30,27,75)]/50 flex flex-col items-center justify-center"
          >
            {/* Drop Icon Container */}
            <div className="mb-8 relative">
                <div className="w-24 h-24 rounded-full bg-[rgb(99,102,241)] flex items-center justify-center shadow-lg shadow-[rgb(99,102,241)]/40 animate-bounce">
                    <ArrowDown className="w-10 h-10 text-white" />
                </div>
            </div>

            {/* Text */}
            <h2 className="text-3xl font-medium text-white mb-2 tracking-tight">Drop media to import</h2>
            
            {/* Simulated "Dragging" Item - Optional visual polish */}
            <div className="absolute right-[-40px] top-[40%] w-48 h-32 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 shadow-2xl rotate-12 pointer-events-none hidden lg:block">
                {/* Mock thumbnail content */}
                <div className="w-full h-full bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-lg flex items-center justify-center">
                    <div className="absolute -bottom-4 -right-4 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-lg border-2 border-[#1e1b4b]">
                        <Plus className="w-6 h-6 text-white" />
                    </div>
                </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

