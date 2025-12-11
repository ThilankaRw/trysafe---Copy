"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertCircle, X } from "lucide-react";
import { useUpload } from "@/contexts/UploadContext";

export default function NotificationArea() {
  const { uploads } = useUpload();
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    const newNotifications = uploads.filter(
      (upload) => upload.status === "completed" || upload.status === "failed"
    );
    setNotifications((prev) => [...prev, ...newNotifications]);

    const timer = setTimeout(() => {
      setNotifications((prev) => prev.slice(1));
    }, 5000);

    return () => clearTimeout(timer);
  }, [uploads]);

  return (
    <div className="fixed bottom-4 right-4 space-y-2 z-50">
      <AnimatePresence>
        {notifications.map((notification) => (
          <Notification
            key={notification.id}
            notification={notification}
            setNotifications={setNotifications}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

interface NotificationProps {
  notification: {
    id: string;
    name: string;
    status: "completed" | "failed";
  };
  setNotifications: React.Dispatch<React.SetStateAction<any[]>>;
}

function Notification({ notification, setNotifications }: NotificationProps) {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 50);

    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
      className={`flex items-center p-4 rounded-lg text-white backdrop-blur-lg ${
        notification.status === "completed" ? "bg-primary/80" : "bg-red-500/80"
      }`}
    >
      {notification.status === "completed" ? (
        <CheckCircle className="w-5 h-5 mr-2" />
      ) : (
        <AlertCircle className="w-5 h-5 mr-2" />
      )}
      <span className="flex-1">
        {notification.name} {notification.status}
      </span>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() =>
          setNotifications((prev) =>
            prev.filter((n) => n.id !== notification.id)
          )
        }
        className="ml-2"
      >
        <X className="w-4 h-4" />
      </motion.button>
      <div
        className="absolute bottom-0 left-0 h-1 bg-white/20 rounded-full"
        style={{ width: `${progress}%` }}
      />
    </motion.div>
  );
}
