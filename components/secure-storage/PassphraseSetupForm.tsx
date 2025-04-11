import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { Eye, EyeOff, Check, X } from 'lucide-react';
import { generateSalt } from '@/lib/utils';
import { PassphraseEncryption } from '@/lib/passphrase-encryption';
import zxcvbn from 'zxcvbn';

interface PassphraseSetupFormProps {
  onComplete: (params: {
    salt: string;
    verifierHash: string;
    verifierSalt: string;
    encryptionParams: string;
  }) => void;
}

interface PassphraseRequirement {
  id: string;
  label: string;
  validate: (value: string) => boolean;
}

const requirements: PassphraseRequirement[] = [
  {
    id: 'length',
    label: 'At least 12 characters long',
    validate: (value) => value.length >= 12,
  },
  {
    id: 'uppercase',
    label: 'Contains uppercase letters',
    validate: (value) => /[A-Z]/.test(value),
  },
  {
    id: 'lowercase',
    label: 'Contains lowercase letters',
    validate: (value) => /[a-z]/.test(value),
  },
  {
    id: 'numbers',
    label: 'Contains numbers',
    validate: (value) => /\d/.test(value),
  },
  {
    id: 'special',
    label: 'Contains special characters',
    validate: (value) => /[^A-Za-z0-9]/.test(value),
  },
];

export function PassphraseSetupForm({ onComplete }: PassphraseSetupFormProps) {
  const [passphrase, setPassphrase] = useState('');
  const [confirmPassphrase, setConfirmPassphrase] = useState('');
  const [showPassphrase, setShowPassphrase] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [strength, setStrength] = useState(0);

  const handlePassphraseChange = (value: string) => {
    setPassphrase(value);
    const result = zxcvbn(value);
    setStrength(result.score);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (passphrase !== confirmPassphrase) {
        throw new Error('Passphrases do not match');
      }

      const result = zxcvbn(passphrase);
      if (result.score < 3) {
        throw new Error('Please choose a stronger passphrase');
      }

      // Generate encryption parameters
      const salt = generateSalt();
      const verifierSalt = generateSalt();
      const params = PassphraseEncryption.generateParams();
      
      const encryption = PassphraseEncryption.getInstance();
      await encryption.initializeEncryption(passphrase, {
        salt,
        ...params
      });

      const verifierHash = await encryption.generateVerifier(verifierSalt);

      onComplete({
        salt,
        verifierHash,
        verifierSalt,
        encryptionParams: JSON.stringify(params)
      });
    } catch (error) {
      console.error('Passphrase setup error:', error);
      // Error will be handled by the parent component
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getStrengthColor = () => {
    switch (strength) {
      case 0: return 'bg-red-500';
      case 1: return 'bg-orange-500';
      case 2: return 'bg-yellow-500';
      case 3: return 'bg-lime-500';
      case 4: return 'bg-green-500';
      default: return 'bg-gray-200';
    }
  };

  const getStrengthLabel = () => {
    switch (strength) {
      case 0: return 'Very Weak';
      case 1: return 'Weak';
      case 2: return 'Fair';
      case 3: return 'Strong';
      case 4: return 'Very Strong';
      default: return 'Too Short';
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="passphrase">Encryption Passphrase</Label>
          <div className="relative">
            <Input
              id="passphrase"
              type={showPassphrase ? 'text' : 'password'}
              value={passphrase}
              onChange={(e) => handlePassphraseChange(e.target.value)}
              className="pr-10"
              required
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2"
              onClick={() => setShowPassphrase(!showPassphrase)}
            >
              {showPassphrase ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirm-passphrase">Confirm Passphrase</Label>
          <div className="relative">
            <Input
              id="confirm-passphrase"
              type={showConfirm ? 'text' : 'password'}
              value={confirmPassphrase}
              onChange={(e) => setConfirmPassphrase(e.target.value)}
              className="pr-10"
              required
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2"
              onClick={() => setShowConfirm(!showConfirm)}
            >
              {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {passphrase && (
          <>
            <div className="space-y-2">
              <div className="text-sm font-medium">Passphrase Strength: {getStrengthLabel()}</div>
              <div className="h-2 rounded-full bg-gray-200">
                <div
                  className={`h-full rounded-full transition-all ${getStrengthColor()}`}
                  style={{ width: `${(strength + 1) * 20}%` }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium">Requirements:</div>
              <div className="space-y-1">
                {requirements.map((req) => (
                  <div
                    key={req.id}
                    className="flex items-center text-sm"
                  >
                    {req.validate(passphrase) ? (
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                    ) : (
                      <X className="h-4 w-4 text-red-500 mr-2" />
                    )}
                    {req.label}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      <Alert variant="default" className="text-amber-600 dark:text-amber-400">
        <AlertDescription>
          Warning: This passphrase is used to encrypt your files and cannot be recovered if forgotten.
          Make sure to store it securely and remember it.
        </AlertDescription>
      </Alert>

      <Button
        type="submit"
        className="w-full"
        disabled={isLoading || strength < 3 || passphrase !== confirmPassphrase}
      >
        {isLoading ? 'Setting up encryption...' : 'Set Encryption Passphrase'}
      </Button>
    </form>
  );
}