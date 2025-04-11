import { useState } from 'react';
import { useRouter } from 'next/router';
import { PassphraseSetupForm } from '@/components/secure-storage/PassphraseSetupForm';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { useSecureStore } from '@/store/useSecureStore';
import { useEncryption } from '@/contexts/EncryptionContext';
import { toast } from 'sonner';

export default function SecurityOnboarding() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const { initializeStorage } = useSecureStore();
  const { initialize } = useEncryption();

  const handleSetupComplete = async (params: {
    salt: string;
    verifierHash: string;
    verifierSalt: string;
    encryptionParams: string;
  }) => {
    try {
      // Initialize encryption with the new passphrase
      const encryptionParams = JSON.parse(params.encryptionParams);
      const isValid = await initialize(params.salt, {
        salt: params.salt,
        ...encryptionParams
      });

      if (!isValid) {
        throw new Error('Failed to initialize encryption');
      }

      // Save encryption parameters to server
      const response = await fetch('/api/auth/setup-encryption', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error('Failed to save encryption parameters');
      }

      // Initialize secure storage
      await initializeStorage(params.salt);

      toast.success('Encryption setup completed successfully');
      router.push('/dashboard');
    } catch (error) {
      console.error('Error setting up encryption:', error);
      setError(error instanceof Error ? error.message : 'Failed to set up encryption. Please try again.');
      toast.error('Failed to set up encryption');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6 space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold tracking-tight">
            Set Up File Encryption
          </h1>
          <p className="text-muted-foreground">
            Create a strong passphrase to protect your files. This passphrase is separate from your login password and cannot be recovered if lost.
          </p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <PassphraseSetupForm onComplete={handleSetupComplete} />

        <Alert variant="default">
          <AlertDescription className="text-sm">
            Warning: Your encryption passphrase cannot be recovered if you forget it. Make sure to store it securely. Without it, you won't be able to access your encrypted files.
          </AlertDescription>
        </Alert>

        <div className="text-sm text-muted-foreground text-center">
          <p>
            For maximum security, your passphrase is never stored by our servers.
            Only you have access to it.
          </p>
        </div>
      </Card>
    </div>
  );
}
