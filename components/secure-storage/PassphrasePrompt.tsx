"use client";

import { useState, useEffect } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react"; // For loading spinner
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../dashboard/ui/dialog";

interface PassphrasePromptProps {
  isOpen: boolean;
  isProcessing?: boolean;
  onClose: () => void;
  onPassphraseEntered: (passphrase: string) => Promise<void> | void;
  title?: string;
  description?: string;
}

export function PassphrasePrompt({
  isOpen,
  isProcessing = false,
  onClose,
  onPassphraseEntered,
  title = "Enter Passphrase",
  description = "Please enter your passphrase to proceed.",
}: PassphrasePromptProps) {
  const [passphrase, setPassphrase] = useState("");

  // Reset passphrase when dialog opens/closes
  useEffect(() => {
    // Only reset if the dialog is actually closing
    if (!isOpen) {
      // Delay reset slightly to allow closing animation if desired
      setTimeout(() => setPassphrase(""), 300);
    } else {
      // Optionally clear or focus when opening (autoFocus on Input handles focus)
      // setPassphrase(''); // Uncomment if you want to clear on open too
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!passphrase || isProcessing) return;
    try {
      await onPassphraseEntered(passphrase);
      // Don't clear passphrase here on error, let the user correct it
      // It will be cleared if the dialog closes on success via isOpen changing in the parent
    } catch (e) {
      // Error handling is done in the parent component (Dashboard.tsx) which calls onPassphraseEntered
      console.error("Error during passphrase submission callback:", e);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSubmit();
    }
  };

  // This function handles the Dialog's built-in close triggers (Escape key, overlay click)
  const handleOpenChange = (open: boolean) => {
    if (!open && !isProcessing) {
      // Only call onClose if dialog is closing AND not processing
      onClose();
    }
    // If 'open' is true, the dialog is opening, do nothing extra here.
  };

  return (
    // Use `onOpenChange` to sync with Dialog's internal state changes
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && ( // Only render description if provided
            <DialogDescription>{description}</DialogDescription>
          )}
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Input
            id="passphrase"
            type="password"
            value={passphrase}
            onChange={(e) => setPassphrase(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter your passphrase"
            disabled={isProcessing}
            autoFocus
          />
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={isProcessing || !passphrase}>
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Submit"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
