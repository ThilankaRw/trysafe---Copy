'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { KeyManager } from '@/lib/key-management';
import { SecureFileStorage } from '@/lib/secure-storage';
import { toast } from 'sonner';

interface SecureStorageContextType {
  isInitialized: boolean;
  initializeStorage: (masterPassword: string) => Promise<void>;
  reinitializeStorage: (masterPassword: string) => Promise<void>;
  clearStorage: () => void;
  uploadFile: (file: File, onProgress?: (progress: number) => void) => Promise<string>;
  downloadFile: (fileId: string, onProgress?: (progress: number) => void) => Promise<Blob>;
}

const SecureStorageContext = createContext<SecureStorageContextType | null>(null);

const STORAGE_STATE_KEY = 'secureStorageInitialized';
const LAST_INIT_TIME_KEY = 'lastInitTime';

const getStorageState = () => {
  if (typeof window === 'undefined') return false;
  const isInit = window.localStorage.getItem(STORAGE_STATE_KEY) === 'true';
  const lastInitTime = parseInt(window.localStorage.getItem(LAST_INIT_TIME_KEY) || '0', 10);
  const now = Date.now();
  // If it's been more than 24 hours since last init, consider storage uninitialized
  return isInit && (now - lastInitTime < 24 * 60 * 60 * 1000);
};

const setStorageState = (initialized: boolean) => {
  if (typeof window === 'undefined') return;
  if (initialized) {
    window.localStorage.setItem(STORAGE_STATE_KEY, 'true');
    window.localStorage.setItem(LAST_INIT_TIME_KEY, Date.now().toString());
  } else {
    window.localStorage.removeItem(STORAGE_STATE_KEY);
    window.localStorage.removeItem(LAST_INIT_TIME_KEY);
  }
};

export function SecureStorageProvider({ children }: { children: React.ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [masterPassword, setMasterPassword] = useState<string | null>(null);
  const keyManager = KeyManager.getInstance();
  const [initAttempts, setInitAttempts] = useState(0);

  // Check localStorage for previous initialization state
  useEffect(() => {
    const storedState = getStorageState();
    if (storedState && keyManager.isInitialized()) {
      setIsInitialized(true);
    } else {
      setStorageState(false);
      setIsInitialized(false);
    }
  }, []);

  const initializeStorage = useCallback(async (password: string) => {
    if (isInitialized) {
      console.warn('Storage is already initialized');
      return;
    }
    
    try {
      await keyManager.initialize(password);
      setMasterPassword(password);
      setIsInitialized(true);
      setStorageState(true);
      setInitAttempts(0);
    } catch (error) {
      setInitAttempts(prev => prev + 1);
      console.error('Failed to initialize secure storage:', error);
      setStorageState(false);
      toast.error('Failed to initialize secure storage');
      throw error;
    }
  }, [isInitialized]);

  const reinitializeStorage = useCallback(async (password: string) => {
    try {
      // Clear existing state first
      keyManager.clearKeys();
      setMasterPassword(null);
      setIsInitialized(false);
      setStorageState(false);
      
      // Then reinitialize
      await keyManager.initialize(password);
      setMasterPassword(password);
      setIsInitialized(true);
      setStorageState(true);
      setInitAttempts(0);
    } catch (error) {
      console.error('Failed to reinitialize secure storage:', error);
      throw error;
    }
  }, []);

  const clearStorage = useCallback(() => {
    keyManager.clearKeys();
    setMasterPassword(null);
    setIsInitialized(false);
    setStorageState(false);
  }, []);

  const uploadFile = useCallback(async (file: File, onProgress?: (progress: number) => void) => {
    if (!isInitialized || !masterPassword) {
      throw new Error('Secure storage not initialized');
    }

    try {
      const fileStorage = new SecureFileStorage();
      const { fileId } = await fileStorage.uploadFile(
        file,
        masterPassword,
        onProgress
      );
      return fileId;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  }, [isInitialized, masterPassword]);

  const downloadFile = useCallback(async (fileId: string, onProgress?: (progress: number) => void) => {
    if (!isInitialized || !masterPassword) {
      throw new Error('Secure storage not initialized');
    }

    try {
      const { data } = await SecureFileStorage.downloadFile(
        fileId,
        masterPassword,
        (progress) => onProgress?.(progress.percentage)
      );
      return data;
    } catch (error) {
      console.error('Download error:', error);
      throw error;
    }
  }, [isInitialized, masterPassword]);

  const value = {
    isInitialized,
    initializeStorage,
    reinitializeStorage,
    clearStorage,
    uploadFile,
    downloadFile,
  };

  return (
    <SecureStorageContext.Provider value={value}>
      {children}
    </SecureStorageContext.Provider>
  );
}

export function useSecureStorage() {
  const context = useContext(SecureStorageContext);
  if (!context) {
    throw new Error('useSecureStorage must be used within a SecureStorageProvider');
  }
  return context;
}