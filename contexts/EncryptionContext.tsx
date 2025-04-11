import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { PassphraseEncryption } from '@/lib/passphrase-encryption';

interface EncryptionContextType {
  isInitialized: boolean;
  initialize: (passphrase: string, params: any) => Promise<boolean>;
  clearEncryption: () => void;
  encryptData: (data: ArrayBuffer) => Promise<{ encryptedData: ArrayBuffer; iv: string }>;
  decryptData: (encryptedData: ArrayBuffer, iv: string) => Promise<ArrayBuffer>;
  verifyPassphrase: (passphrase: string, verifierHash: string, verifierSalt: string) => Promise<boolean>;
}

const EncryptionContext = createContext<EncryptionContextType | undefined>(undefined);

export function EncryptionProvider({ children }: { children: ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false);
  const encryption = PassphraseEncryption.getInstance();

  const initialize = useCallback(async (passphrase: string, params: any) => {
    try {
      const success = await encryption.initializeEncryption(passphrase, params);
      setIsInitialized(success);
      return success;
    } catch (error) {
      console.error('Encryption initialization failed:', error);
      setIsInitialized(false);
      return false;
    }
  }, []);

  const clearEncryption = useCallback(() => {
    encryption.clearEncryption();
    setIsInitialized(false);
  }, []);

  const encryptData = useCallback(async (data: ArrayBuffer) => {
    if (!isInitialized) {
      throw new Error('Encryption not initialized');
    }
    return encryption.encryptChunk(data);
  }, [isInitialized]);

  const decryptData = useCallback(async (encryptedData: ArrayBuffer, iv: string) => {
    if (!isInitialized) {
      throw new Error('Encryption not initialized');
    }
    return encryption.decryptChunk(encryptedData, iv);
  }, [isInitialized]);

  const verifyPassphrase = useCallback(async (
    passphrase: string,
    verifierHash: string,
    verifierSalt: string
  ) => {
    try {
      // Initialize encryption with test parameters
      const params = PassphraseEncryption.generateParams();
      const isValid = await encryption.initializeEncryption(
        passphrase,
        {
          ...params,
          salt: verifierSalt
        },
        verifierHash,
        verifierSalt
      );

      // Clear encryption after verification
      encryption.clearEncryption();
      return isValid;
    } catch (error) {
      console.error('Passphrase verification failed:', error);
      return false;
    }
  }, []);

  return (
    <EncryptionContext.Provider
      value={{
        isInitialized,
        initialize,
        clearEncryption,
        encryptData,
        decryptData,
        verifyPassphrase,
      }}
    >
      {children}
    </EncryptionContext.Provider>
  );
}

export function useEncryption() {
  const context = useContext(EncryptionContext);
  if (context === undefined) {
    throw new Error('useEncryption must be used within an EncryptionProvider');
  }
  return context;
}