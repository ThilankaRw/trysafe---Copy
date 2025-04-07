import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import crypto from 'crypto'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const getWebCrypto = () => {
  if (typeof window !== 'undefined') {
    return window.crypto;
  }
  return crypto.webcrypto as Crypto;
};

export function generateSalt(): string {
  const webCrypto = getWebCrypto();
  const array = new Uint8Array(16);
  (webCrypto as any).getRandomValues(array);
  return arrayBufferToHex(array.buffer as ArrayBuffer);
}

/**
 * Derives an encryption key from a password and salt using PBKDF2
 */
export async function deriveKey(password: string, salt: string): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const webCrypto = getWebCrypto();
  
  const keyMaterial = await webCrypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits', 'deriveKey']
  );

  return await webCrypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: encoder.encode(salt),
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Generates a cryptographically secure random initialization vector (IV)
 */
export function generateIV(): Uint8Array {
  const webCrypto = getWebCrypto();
  const iv = new Uint8Array(12);
  (webCrypto as any).getRandomValues(iv);
  return iv;
}

/**
 * Converts an ArrayBuffer to a hex string
 */
export function arrayBufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Converts a hex string to an ArrayBuffer
 */
export function hexToArrayBuffer(hex: string): ArrayBuffer {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.slice(i, i + 2), 16);
  }
  return bytes.buffer;
}

/**
 * Generates a UUID v4
 */
export function generateUUID(): string {
  const webCrypto = getWebCrypto();
  if ('randomUUID' in webCrypto) {
    return webCrypto.randomUUID();
  }
  // Fallback for older browsers
  const array = new Uint8Array(16);
  (webCrypto as any).getRandomValues(array);
  return arrayBufferToHex(array.buffer as ArrayBuffer);
}

// Retry configuration interface
interface RetryConfig {
  maxAttempts: number;
  initialDelay: number;
  maxDelay: number;
  onRetry?: (error: Error, attempt: number) => void;
}

export async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  config: RetryConfig
): Promise<T> {
  let lastError: Error;
  for (let attempt = 1; attempt <= config.maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      if (attempt === config.maxAttempts) {
        throw error;
      }

      const delay = Math.min(
        config.initialDelay * Math.pow(2, attempt - 1),
        config.maxDelay
      );

      config.onRetry?.(lastError, attempt);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw lastError!;
}
