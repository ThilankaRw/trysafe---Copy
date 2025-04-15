import { create } from "zustand";
import { KeyManager } from "@/lib/key-management";
import { SecureFileStorage } from "@/lib/secure-storage";

interface SecureStorageState {
  isInitialized: boolean;
  masterPassword: string | null;
  initAttempts: number;
  initializeStorage: (password: string) => Promise<void>;
  reinitializeStorage: (password: string) => Promise<void>;
  clearStorage: () => void;
  uploadFile: (
    file: File,
    onProgress?: (progress: number) => void
  ) => Promise<string>;
  downloadFile: (
    fileId: string,
    onProgress?: (progress: number) => void
  ) => Promise<Blob>;
}

const STORAGE_STATE_KEY = "secureStorageInitialized";
const LAST_INIT_TIME_KEY = "lastInitTime";

const getStorageState = () => {
  if (typeof window === "undefined") return false;
  const isInit = window.localStorage.getItem(STORAGE_STATE_KEY) === "true";
  const lastInitTime = parseInt(
    window.localStorage.getItem(LAST_INIT_TIME_KEY) || "0",
    10
  );
  const now = Date.now();
  return isInit && now - lastInitTime < 24 * 60 * 60 * 1000;
};

const setStorageState = (initialized: boolean) => {
  if (typeof window === "undefined") return;
  if (initialized) {
    window.localStorage.setItem(STORAGE_STATE_KEY, "true");
    window.localStorage.setItem(LAST_INIT_TIME_KEY, Date.now().toString());
  } else {
    window.localStorage.removeItem(STORAGE_STATE_KEY);
    window.localStorage.removeItem(LAST_INIT_TIME_KEY);
  }
};

export const useSecureStore = create<SecureStorageState>((set, get) => ({
  isInitialized: getStorageState(),
  masterPassword: null,
  initAttempts: 0,

  initializeStorage: async (password: string) => {
    const { isInitialized } = get();
    if (isInitialized) {
      console.warn("Storage is already initialized");
      return;
    }

    console.log("Initializing secure storage...");
    try {
      const keyManager = KeyManager.getInstance();
      await keyManager.initialize(password);
      set({
        masterPassword: password,
        isInitialized: true,
        initAttempts: 0,
      });
      setStorageState(true);
    } catch (error) {
      set((state) => ({ initAttempts: state.initAttempts + 1 }));
      console.error("Failed to initialize secure storage:", error);
      throw error;
    }
  },

  reinitializeStorage: async (password: string) => {
    try {
      const keyManager = KeyManager.getInstance();
      keyManager.clearKeys();
      set({
        masterPassword: null,
        isInitialized: false,
      });
      setStorageState(false);

      await keyManager.initialize(password);
      set({
        masterPassword: password,
        isInitialized: true,
        initAttempts: 0,
      });
      setStorageState(true);
    } catch (error) {
      console.error("Failed to reinitialize secure storage:", error);
      throw error;
    }
  },

  clearStorage: () => {
    const keyManager = KeyManager.getInstance();
    keyManager.clearKeys();
    set({
      masterPassword: null,
      isInitialized: false,
    });
    setStorageState(false);
  },

  uploadFile: async (file: File, onProgress?: (progress: number) => void) => {
    const { isInitialized, masterPassword } = get();
    console.log({
      isInitialized,
      masterPassword,
    });
    if (!isInitialized || !masterPassword) {
      throw new Error("Secure storage not initialized");
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
      console.error("Upload error:", error);
      throw error;
    }
  },

  downloadFile: async (
    fileId: string,
    onProgress?: (progress: number) => void
  ) => {
    const { isInitialized, masterPassword } = get();
    if (!isInitialized || !masterPassword) {
      throw new Error("Secure storage not initialized");
    }

    try {
      const { data } = await SecureFileStorage.downloadFile(
        fileId,
        masterPassword,
        (progress) => onProgress?.(progress.percentage)
      );
      return data;
    } catch (error) {
      console.error("Download error:", error);
      throw error;
    }
  },
}));
