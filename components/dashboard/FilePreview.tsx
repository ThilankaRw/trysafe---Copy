import { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { PassphrasePrompt } from '../secure-storage/PassphrasePrompt';
import { useEncryption } from '@/contexts/EncryptionContext';
import { toast } from 'sonner';
import { File as FileIcon, Download, Eye, Loader2, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '../ui/alert';

interface FilePreviewProps {
  file: {
    id: string;
    name: string;
    mimeType: string;
    encrypted: boolean;
    previewUrl?: string;
  };
  onDelete?: () => void;
}

export function FilePreview({ file, onDelete }: FilePreviewProps) {
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [showPassphrasePrompt, setShowPassphrasePrompt] = useState(false);
  const [encryptionParams, setEncryptionParams] = useState(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(file.previewUrl || null);
  const [error, setError] = useState<string | null>(null);

  const { initialize, clearEncryption } = useEncryption();

  const handlePreviewClick = async () => {
    if (!file.encrypted) {
      // Handle unencrypted files directly
      if (previewUrl) {
        window.open(previewUrl, '_blank');
      }
      return;
    }

    try {
      const response = await fetch('/api/auth/encryption-params');
      if (!response.ok) {
        throw new Error('Failed to fetch encryption parameters');
      }
      
      const params = await response.json();
      setEncryptionParams(params);
      setShowPassphrasePrompt(true);
    } catch (error) {
      console.error('Preview preparation error:', error);
      setError('Failed to prepare file preview');
      toast.error('Failed to prepare file preview');
    }
  };

  const processPreview = async (passphrase: string) => {
    if (!file || !encryptionParams) return;
    
    setIsDecrypting(true);
    setError(null);

    try {
      // Initialize encryption
      const isValid = await initialize(passphrase, encryptionParams);
      if (!isValid) {
        throw new Error('Invalid passphrase');
      }

      // Download and decrypt file
      const response = await fetch(`/api/files/${file.id}`);
      if (!response.ok) {
        throw new Error('Failed to download file');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      if (file.mimeType.startsWith('image/') || file.mimeType === 'application/pdf') {
        setPreviewUrl(url);
      } else {
        // Download other file types
        const a = document.createElement('a');
        a.href = url;
        a.download = file.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }

      clearEncryption();
    } catch (error) {
      console.error('Preview error:', error);
      setError((error as Error).message || 'Failed to preview file');
      toast.error('Failed to preview file');
    } finally {
      setIsDecrypting(false);
      setShowPassphrasePrompt(false);
    }
  };

  const getFileIcon = () => {
    if (file.mimeType.startsWith('image/')) {
      return previewUrl ? (
        <img
          src={previewUrl}
          alt={file.name}
          className="w-12 h-12 object-cover rounded"
        />
      ) : (
        <FileIcon className="w-12 h-12 text-primary" />
      );
    }
    return <FileIcon className="w-12 h-12 text-primary" />;
  };

  return (
    <>
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getFileIcon()}
            <div>
              <h3 className="font-medium">{file.name}</h3>
              <p className="text-sm text-muted-foreground">
                {file.encrypted ? 'Encrypted' : 'Not encrypted'}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            {(file.mimeType.startsWith('image/') || file.mimeType === 'application/pdf') && (
              <Button
                variant="outline"
                size="icon"
                onClick={handlePreviewClick}
                disabled={isDecrypting}
              >
                {isDecrypting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            )}
            <Button
              variant="outline"
              size="icon"
              onClick={handlePreviewClick}
              disabled={isDecrypting}
            >
              {isDecrypting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {previewUrl && (file.mimeType.startsWith('image/') || file.mimeType === 'application/pdf') && (
          <div className="mt-4">
            {file.mimeType.startsWith('image/') ? (
              <img
                src={previewUrl}
                alt={file.name}
                className="w-full rounded-lg"
              />
            ) : (
              <iframe
                src={previewUrl}
                className="w-full h-[600px] rounded-lg"
                title={file.name}
              />
            )}
          </div>
        )}
      </Card>

      {encryptionParams && (
        <PassphrasePrompt
          isOpen={showPassphrasePrompt}
          onClose={() => {
            setShowPassphrasePrompt(false);
            setError(null);
          }}
          onPassphraseEntered={processPreview}
          encryptionParams={encryptionParams}
          title={`Access ${file.name}`}
          description="Enter your encryption passphrase to access this file."
        />
      )}
    </>
  );
}

