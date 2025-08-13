import { useState } from "react";
import { motion } from "framer-motion";
import { X, User, Bell, Shield, HardDrive, LoaderCircle } from "lucide-react";
import { Button } from "../ui/button";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

interface UserSettingsProps {
  onClose: () => void;
}

export default function UserSettings({ onClose }: UserSettingsProps) {
  const [activeTab, setActiveTab] = useState("profile");
  const [isRegistering, setIsRegistering] = useState(false);

  const handleRegisterPasskey = async () => {
    setIsRegistering(true);
    try {
      const result = await authClient.passkey.addPasskey({
        authenticatorAttachment: "platform",
      });
      if (result?.error) {
        toast.error(result.error.message || "Failed to register passkey.");
      } else {
        toast.success("Passkey registered successfully!");
      }
    } catch (err) {
      toast.error("An unexpected error occurred while registering passkey.");
      console.error("Passkey registration error:", err);
    } finally {
      setIsRegistering(false);
    }
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
    { id: "storage", label: "Storage", icon: HardDrive },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl"
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold">User Settings</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X />
          </button>
        </div>
        <div className="flex">
          <div className="w-1/4 border-r border-gray-200 dark:border-gray-700">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center w-full p-4 text-left ${
                  activeTab === tab.id
                    ? "bg-gray-100 dark:bg-gray-700 text-primary"
                    : "hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                <tab.icon className="w-5 h-5 mr-2" />
                {tab.label}
              </button>
            ))}
          </div>
          <div className="w-3/4 p-6">
            {activeTab === "profile" && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Profile Settings</h3>
                {/* Add profile settings fields here */}
              </div>
            )}
            {activeTab === "notifications" && (
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Notification Preferences
                </h3>
                {/* Add notification settings here */}
              </div>
            )}
            {activeTab === "security" && (
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Security Settings
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium">Passkeys</h4>
                    <p className="text-sm text-muted-foreground">
                      Use passkeys for a more secure and convenient sign-in
                      experience. Register a passkey using your device's native
                      biometrics (like fingerprint or face ID).
                    </p>
                  </div>
                  <Button
                    onClick={handleRegisterPasskey}
                    disabled={isRegistering}
                  >
                    {isRegistering ? (
                      <>
                        <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                        Follow browser prompts...
                      </>
                    ) : (
                      "Register a new Passkey"
                    )}
                  </Button>
                </div>
              </div>
            )}
            {activeTab === "storage" && (
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Storage Management
                </h3>
                {/* Add storage management options here */}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
