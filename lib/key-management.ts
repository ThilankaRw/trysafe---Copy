import { deriveKey, generateSalt, arrayBufferToHex } from './utils';

/**
 * Key management system for secure file storage.
 * Handles derivation and caching of encryption keys.
 */
export class KeyManager {
  private static instance: KeyManager;
  private masterKey: CryptoKey | null = null;
  private masterKeySalt: string | null = null;

  private constructor() {
    // Only access localStorage on client side
    if (typeof window !== 'undefined') {
      const savedSalt = window.localStorage.getItem('masterKeySalt');
      if (savedSalt) {
        this.masterKeySalt = savedSalt;
      }
    }
  }

  static getInstance(): KeyManager {
    if (!KeyManager.instance) {
      KeyManager.instance = new KeyManager();
    }
    return KeyManager.instance;
  }

  /**
   * Initialize the key manager with user's master password
   */
  async initialize(masterPassword: string): Promise<void> {
    try {
      // Generate a salt for master key derivation if not exists
      if (!this.masterKeySalt) {
        this.masterKeySalt = generateSalt();
        if (typeof window !== 'undefined') {
          window.localStorage.setItem('masterKeySalt', this.masterKeySalt);
        }
      }

      // Derive master key using PBKDF2
      this.masterKey = await deriveKey(masterPassword, this.masterKeySalt);
    } catch (error) {
      // Clear any partially initialized state
      this.clearKeys();
      throw error;
    }
  }

  /**
   * Clear all keys from memory (e.g., on logout)
   */
  clearKeys(): void {
    this.masterKey = null;
    this.masterKeySalt = null;
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('masterKeySalt');
    }
  }

  /**
   * Generate a file-specific encryption key
   */
  async deriveFileKey(fileKeySalt: string): Promise<CryptoKey> {
    if (!this.masterKey || !this.masterKeySalt) {
      throw new Error('Key manager not initialized');
    }

    // Use the master key to derive a file-specific key
    return await deriveKey(arrayBufferToHex(await crypto.subtle.exportKey('raw', this.masterKey)), fileKeySalt);
  }

  /**
   * Check if the key manager is initialized
   */
  isInitialized(): boolean {
    return this.masterKey !== null && this.masterKeySalt !== null;
  }

  /**
   * Get the master key salt
   */
  getMasterKeySalt(): string | null {
    return this.masterKeySalt;
  }

  /**
   * Hash the master key for storage
   */
  async generateMasterKeyHash(masterPassword: string): Promise<{ hash: string, salt: string }> {
    const salt = generateSalt();
    const key = await deriveKey(masterPassword, salt);
    const rawKey = await crypto.subtle.exportKey('raw', key);
    const hashBuffer = await crypto.subtle.digest('SHA-256', rawKey);
    return {
      hash: arrayBufferToHex(hashBuffer),
      salt: salt
    };
  }

  /**
   * Verify a master key against its stored hash
   */
  async verifyMasterKey(masterPassword: string, storedHash: string, storedSalt: string): Promise<boolean> {
    const key = await deriveKey(masterPassword, storedSalt);
    const rawKey = await crypto.subtle.exportKey('raw', key);
    const hashBuffer = await crypto.subtle.digest('SHA-256', rawKey);
    const computedHash = arrayBufferToHex(hashBuffer);
    return computedHash === storedHash;
  }
}