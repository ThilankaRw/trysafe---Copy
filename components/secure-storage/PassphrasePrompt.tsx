import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Alert, AlertDescription } from '../ui/alert';
import { Eye, EyeOff, AlertTriangle, Loader2 } from 'lucide-react';
import { PassphraseEncryption } from '@/lib/passphrase-encryption';

interface PassphrasePromptProps {
  isOpen: boolean;
  onClose: () => void;
  onPassphraseEntered: (passphrase: string) => Promise<void>;
  encryptionParams: {
    salt: string;
    iterations: number;
    memCost: number;
    parallelism: number;
    verifierHash?: string;
    verifierSalt?: string;
  };
  title?: string;
  description?: string;
}

export function PassphrasePrompt({
  isOpen,
  onClose,
  onPassphraseEntered,
  encryptionParams,
  title = "Enter Encryption Passphrase",
  description = "Please enter your encryption passphrase to decrypt this file."
}: PassphrasePromptProps) {
  const [passphrase, setPassphrase] = useState('');
  const [showPassphrase, setShowPassphrase] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const MAX_ATTEMPTS = 3;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const encryption = PassphraseEncryption.getInstance();
      const isValid = await encryption.initializeEncryption(
        passphrase,
        encryptionParams,
        encryptionParams.verifierHash,
        encryptionParams.verifierSalt
      );

      if (!isValid) {
        setAttempts(prev => prev + 1);
        throw new Error('Invalid passphrase');
      }

      await onPassphraseEntered(passphrase);
      setPassphrase('');
      setAttempts(0);
      onClose();
    } catch (error) {
      console.error('Passphrase verification failed:', error);
      setError(
        attempts >= MAX_ATTEMPTS - 1
          ? 'Too many failed attempts. Please try again later.'
          : 'Invalid passphrase. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setPassphrase('');
    setError(null);
    setAttempts(0);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="passphrase">Encryption Passphrase</Label>
            <div className="relative">
              <Input
                id="passphrase"
                type={showPassphrase ? 'text' : 'password'}
                value={passphrase}
                onChange={(e) => setPassphrase(e.target.value)}
                className="pr-10"
                required
                disabled={isLoading || attempts >= MAX_ATTEMPTS}
                aria-invalid={error ? 'true' : 'false'}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2"
                onClick={() => setShowPassphrase(!showPassphrase)}
                disabled={isLoading || attempts >= MAX_ATTEMPTS}
              >
                {showPassphrase ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {attempts > 0 && attempts < MAX_ATTEMPTS && (
            <Alert>
              <AlertDescription>
                {`${MAX_ATTEMPTS - attempts} ${
                  MAX_ATTEMPTS - attempts === 1 ? 'attempt' : 'attempts'
                } remaining`}
              </AlertDescription>
            </Alert>
          )}

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="secondary"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !passphrase || attempts >= MAX_ATTEMPTS}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                'Decrypt'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}