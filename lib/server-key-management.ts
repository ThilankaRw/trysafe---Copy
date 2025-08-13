import crypto from "crypto";
import prisma from "./prisma";

/**
 * Server-side key management utilities for protecting user chunks
 * with an additional layer of encryption beyond client-side protection.
 */

// Algorithm used for server-side encryption
const CIPHER_ALGORITHM = "aes-256-cbc";
const HMAC_ALGORITHM = "sha256";
const KEY_LENGTH = 32; // 256 bits
const IV_LENGTH = 16; // 128 bits

/**
 * Get the master server key from environment variable
 * This key is used to encrypt/decrypt individual user server secrets
 */
function getMasterServerKey(): Buffer {
  const masterKey = process.env.SERVER_ENCRYPTION_MASTER_KEY;
  if (!masterKey) {
    throw new Error(
      "SERVER_ENCRYPTION_MASTER_KEY environment variable is not set"
    );
  }

  // Convert hex string to buffer, or derive from string if not hex
  if (masterKey.length === 64) {
    // Assume it's a hex string
    return Buffer.from(masterKey, "hex");
  } else {
    // Derive a 256-bit key from the string using PBKDF2
    return crypto.pbkdf2Sync(
      masterKey,
      "server-encryption-salt",
      100000,
      KEY_LENGTH,
      "sha256"
    );
  }
}

/**
 * Derive encryption and HMAC keys from master key
 */
function deriveKeys(masterKey: Buffer): { encKey: Buffer; hmacKey: Buffer } {
  const encKey = crypto.pbkdf2Sync(
    masterKey,
    "enc-salt",
    1000,
    KEY_LENGTH,
    "sha256"
  );
  const hmacKey = crypto.pbkdf2Sync(
    masterKey,
    "hmac-salt",
    1000,
    KEY_LENGTH,
    "sha256"
  );
  return { encKey, hmacKey };
}

/**
 * Generate a new random server secret for a user
 * This secret will be encrypted with the master server key before storage
 */
export function generateServerSecret(): Buffer {
  return crypto.randomBytes(KEY_LENGTH);
}

/**
 * Encrypt a server secret for storage in the database
 * @param serverSecret The raw server secret to encrypt
 * @returns Object containing encrypted secret, IV, and auth tag
 */
export function encryptServerSecret(serverSecret: Buffer): {
  encryptedSecret: string;
  iv: string;
  authTag: string;
} {
  const masterKey = getMasterServerKey();
  const { encKey, hmacKey } = deriveKeys(masterKey);
  const iv = crypto.randomBytes(IV_LENGTH);

  // Encrypt with AES-256-CBC
  const cipher = crypto.createCipheriv(CIPHER_ALGORITHM, encKey, iv);
  const encrypted = Buffer.concat([
    cipher.update(serverSecret),
    cipher.final(),
  ]);

  // Create HMAC for authentication
  const hmac = crypto.createHmac(HMAC_ALGORITHM, hmacKey);
  hmac.update(iv);
  hmac.update(encrypted);
  const authTag = hmac.digest();

  return {
    encryptedSecret: encrypted.toString("hex"),
    iv: iv.toString("hex"),
    authTag: authTag.toString("hex"),
  };
}

/**
 * Decrypt a server secret from database storage
 * @param encryptedSecret Hex-encoded encrypted secret
 * @param iv Hex-encoded initialization vector
 * @param authTag Hex-encoded authentication tag
 * @returns Decrypted server secret buffer
 */
export function decryptServerSecret(
  encryptedSecret: string,
  iv: string,
  authTag: string
): Buffer {
  const masterKey = getMasterServerKey();
  const { encKey, hmacKey } = deriveKeys(masterKey);

  const ivBuffer = Buffer.from(iv, "hex");
  const encryptedBuffer = Buffer.from(encryptedSecret, "hex");
  const authTagBuffer = Buffer.from(authTag, "hex");

  // Verify HMAC first
  const hmac = crypto.createHmac(HMAC_ALGORITHM, hmacKey);
  hmac.update(ivBuffer);
  hmac.update(encryptedBuffer);
  const computedTag = hmac.digest();

  if (!crypto.timingSafeEqual(authTagBuffer, computedTag)) {
    throw new Error("Authentication failed - invalid auth tag");
  }

  // Decrypt with AES-256-CBC
  const decipher = crypto.createDecipheriv(CIPHER_ALGORITHM, encKey, ivBuffer);
  const decrypted = Buffer.concat([
    decipher.update(encryptedBuffer),
    decipher.final(),
  ]);

  return decrypted;
}

/**
 * Encrypt a chunk with a user's server secret
 * @param chunkData The chunk data to encrypt
 * @param serverSecret The user's server secret
 * @returns Object containing encrypted data, IV, and auth tag
 */
export function encryptChunkWithServerSecret(
  chunkData: Buffer,
  serverSecret: Buffer
): {
  encryptedData: Buffer;
  iv: string;
  authTag: string;
} {
  const { encKey, hmacKey } = deriveKeys(serverSecret);
  const iv = crypto.randomBytes(IV_LENGTH);

  // Encrypt with AES-256-CBC
  const cipher = crypto.createCipheriv(CIPHER_ALGORITHM, encKey, iv);
  const encrypted = Buffer.concat([cipher.update(chunkData), cipher.final()]);

  // Create HMAC for authentication
  const hmac = crypto.createHmac(HMAC_ALGORITHM, hmacKey);
  hmac.update(iv);
  hmac.update(encrypted);
  const authTag = hmac.digest();

  return {
    encryptedData: encrypted,
    iv: iv.toString("hex"),
    authTag: authTag.toString("hex"),
  };
}

/**
 * Decrypt a chunk with a user's server secret
 * @param encryptedData The encrypted chunk data
 * @param serverSecret The user's server secret
 * @param iv Hex-encoded initialization vector
 * @param authTag Hex-encoded authentication tag
 * @returns Decrypted chunk data
 */
export function decryptChunkWithServerSecret(
  encryptedData: Buffer,
  serverSecret: Buffer,
  iv: string,
  authTag: string
): Buffer {
  const { encKey, hmacKey } = deriveKeys(serverSecret);
  const ivBuffer = Buffer.from(iv, "hex");
  const authTagBuffer = Buffer.from(authTag, "hex");

  // Verify HMAC first
  const hmac = crypto.createHmac(HMAC_ALGORITHM, hmacKey);
  hmac.update(ivBuffer);
  hmac.update(encryptedData);
  const computedTag = hmac.digest();

  if (!crypto.timingSafeEqual(authTagBuffer, computedTag)) {
    throw new Error("Authentication failed - invalid auth tag");
  }

  // Decrypt with AES-256-CBC
  const decipher = crypto.createDecipheriv(CIPHER_ALGORITHM, encKey, ivBuffer);
  const decrypted = Buffer.concat([
    decipher.update(encryptedData),
    decipher.final(),
  ]);

  return decrypted;
}

/**
 * Generate and encrypt a new server secret for a user
 * Convenience function that combines generation and encryption
 * @returns Object with encrypted secret data ready for database storage
 */
export function createEncryptedServerSecret(): {
  encryptedSecret: string;
  iv: string;
  authTag: string;
} {
  const serverSecret = generateServerSecret();
  return encryptServerSecret(serverSecret);
}

/**
 * Rotate a user's server secret
 * Generates a new secret and returns both old and new encrypted versions
 * @param currentEncryptedSecret Current encrypted secret
 * @param currentIv Current IV
 * @param currentAuthTag Current auth tag
 * @returns Object with old secret and new encrypted secret data
 */
export function rotateServerSecret(
  currentEncryptedSecret: string,
  currentIv: string,
  currentAuthTag: string
): {
  oldSecret: Buffer;
  newEncryptedSecret: string;
  newIv: string;
  newAuthTag: string;
} {
  // Decrypt the current secret
  const oldSecret = decryptServerSecret(
    currentEncryptedSecret,
    currentIv,
    currentAuthTag
  );

  // Generate and encrypt a new secret
  const newSecretData = createEncryptedServerSecret();

  return {
    oldSecret,
    newEncryptedSecret: newSecretData.encryptedSecret,
    newIv: newSecretData.iv,
    newAuthTag: newSecretData.authTag,
  };
}

/**
 * Initialize server secret for a new user
 * Call this after successful user registration
 * @param userId The ID of the newly created user
 * @returns Promise resolving to success status
 */
export async function initializeUserServerSecret(
  userId: string
): Promise<boolean> {
  try {
    const serverSecretData = createEncryptedServerSecret();

    await prisma.user.update({
      where: { id: userId },
      data: {
        serverSecret: serverSecretData.encryptedSecret,
        serverSecretIv: serverSecretData.iv,
        serverSecretAuthTag: serverSecretData.authTag,
        secretCreatedAt: new Date(),
        secretRotatedAt: new Date(),
      },
    });

    console.log(`Server secret initialized for user ${userId}`);
    return true;
  } catch (error) {
    console.error("Failed to initialize server secret for user:", error);
    return false;
  }
}

/**
 * Get and decrypt a user's server secret
 * @param userId The user's ID
 * @returns Promise resolving to the decrypted server secret, or null if not found
 */
export async function getUserServerSecret(
  userId: string
): Promise<Buffer | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        serverSecret: true,
        serverSecretIv: true,
        serverSecretAuthTag: true,
      },
    });

    if (
      !user ||
      !user.serverSecret ||
      !user.serverSecretIv ||
      !user.serverSecretAuthTag
    ) {
      return null;
    }

    return decryptServerSecret(
      user.serverSecret,
      user.serverSecretIv,
      user.serverSecretAuthTag
    );
  } catch (error) {
    console.error("Failed to retrieve user server secret:", error);
    return null;
  }
}
