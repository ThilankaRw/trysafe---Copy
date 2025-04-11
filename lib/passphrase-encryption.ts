import { Buffer } from 'buffer';
import { generateSalt } from './utils';

interface EncryptionParams {
  salt: string;
  iterations: number;
  memCost: number;
  parallelism: number;
}

export class PassphraseEncryption {
  private static instance: PassphraseEncryption;
  private key: CryptoKey | null = null;
  private params: EncryptionParams | null = null;
  private encoder = new TextEncoder();

  private constructor() {}

  static getInstance(): PassphraseEncryption {
    if (!PassphraseEncryption.instance) {
      PassphraseEncryption.instance = new PassphraseEncryption();
    }
    return PassphraseEncryption.instance;
  }

  static generateParams(): {
    iterations: number;
    memCost: number;
    parallelism: number;
  } {
    return {
      iterations: 200000, // Increased from 100000
      memCost: 131072,   // Increased to 128MB
      parallelism: 4,
    };
  }

  async initializeEncryption(
    passphrase: string,
    params: EncryptionParams,
    verifierHash?: string,
    verifierSalt?: string
  ): Promise<boolean> {
    try {
      this.params = params;
      const rawKey = await this.deriveKey(passphrase, params);

      // If verifier is provided, validate the passphrase
      if (verifierHash && verifierSalt) {
        const testVerifier = await this.generateVerifier(verifierSalt, rawKey);
        if (testVerifier !== verifierHash) {
          this.clearEncryption();
          return false;
        }
      }

      this.key = await crypto.subtle.importKey(
        'raw',
        rawKey,
        { name: 'AES-GCM', length: 256 }, // Explicitly specify key length
        false,
        ['encrypt', 'decrypt']
      );

      return true;
    } catch (error) {
      console.error('Encryption initialization failed:', error);
      this.clearEncryption();
      return false;
    }
  }

  private async deriveKey(
    passphrase: string,
    params: EncryptionParams
  ): Promise<ArrayBuffer> {
    const passphraseBuffer = this.encoder.encode(passphrase);
    const saltBuffer = Buffer.from(params.salt, 'base64');

    // Use Argon2id if available, fallback to PBKDF2
    if (typeof crypto.subtle.deriveKey === 'function' && 'Argon2id' in crypto.subtle) {
      const baseKey = await crypto.subtle.importKey(
        'raw',
        passphraseBuffer,
        'Argon2id',
        false,
        ['deriveKey']
      );

      const derivedKey = await crypto.subtle.deriveKey(
        {
          name: 'Argon2id',
          salt: saltBuffer,
          iterations: params.iterations,
          memory: params.memCost,
          parallelism: params.parallelism,
          hashLength: 32
        },
        baseKey,
        { name: 'AES-GCM', length: 256 },
        true,
        ['encrypt', 'decrypt']
      );

      return crypto.subtle.exportKey('raw', derivedKey);
    } else {
      // Fallback to PBKDF2 with increased iterations
      const baseKey = await crypto.subtle.importKey(
        'raw',
        passphraseBuffer,
        'PBKDF2',
        false,
        ['deriveBits']
      );

      return crypto.subtle.deriveBits(
        {
          name: 'PBKDF2',
          salt: saltBuffer,
          iterations: params.iterations * 2, // Double iterations for PBKDF2
          hash: 'SHA-512' // Use SHA-512 for better security
        },
        baseKey,
        256
      );
    }
  }

  async generateVerifier(salt: string, existingKey?: ArrayBuffer): Promise<string> {
    if (!this.key && !existingKey) {
      throw new Error('Encryption not initialized');
    }

    const data = new Uint8Array(32);
    crypto.getRandomValues(data);
    const iv = new Uint8Array(12);
    crypto.getRandomValues(iv);

    const key = existingKey
      ? await crypto.subtle.importKey(
          'raw',
          existingKey,
          { name: 'AES-GCM' },
          false,
          ['encrypt']
        )
      : this.key;

    if (!key) {
      throw new Error('No encryption key available');
    }

    const encrypted = await crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv,
      },
      key,
      data
    );

    return Buffer.from(encrypted).toString('base64');
  }

  async encryptChunk(data: ArrayBuffer): Promise<{
    encryptedData: ArrayBuffer;
    iv: string;
  }> {
    if (!this.key) {
      throw new Error('Encryption not initialized');
    }

    const iv = new Uint8Array(12);
    crypto.getRandomValues(iv);

    const encrypted = await crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv,
      },
      this.key,
      data
    );

    return {
      encryptedData: encrypted,
      iv: Buffer.from(iv).toString('base64'),
    };
  }

  async decryptChunk(
    encryptedData: ArrayBuffer,
    ivBase64: string
  ): Promise<ArrayBuffer> {
    if (!this.key) {
      throw new Error('Encryption not initialized');
    }

    const iv = Buffer.from(ivBase64, 'base64');

    return crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv,
      },
      this.key,
      encryptedData
    );
  }

  clearEncryption(): void {
    this.key = null;
    this.params = null;
  }
}