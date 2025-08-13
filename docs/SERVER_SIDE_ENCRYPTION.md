# Server-Side Encryption Implementation

This document describes the server-side encryption feature that provides an additional layer of security for uploaded file chunks in TrySafe.

## Overview

The server-side encryption implementation adds a second layer of encryption to uploaded file chunks, beyond the existing client-side encryption. This provides defense-in-depth security and protects against various attack scenarios.

### Security Architecture

1. **Client-Side Encryption**: Files are encrypted by the client before upload using user-derived keys
2. **Server-Side Encryption**: Each chunk receives an additional layer of encryption using user-specific server secrets
3. **Storage**: Chunks are stored in S3 with both encryption layers applied

## Implementation Details

### Database Schema Changes

The following fields have been added to support server-side encryption:

**User Model:**

- `serverSecret`: Encrypted server-side secret for chunk protection
- `serverSecretIv`: IV for server secret encryption
- `serverSecretAuthTag`: Authentication tag for server secret encryption
- `secretCreatedAt`: When the server secret was first created
- `secretRotatedAt`: Last time the server secret was rotated

**Chunk Model:**

- `serverIV`: IV for server-side encryption
- `serverAuthTag`: Authentication tag for server-side encryption
- `serverEncrypted`: Boolean flag indicating if server-side encryption was applied

### Key Management

#### Master Server Key

- A single master key (256-bit) encrypts all user server secrets
- Stored in `SERVER_ENCRYPTION_MASTER_KEY` environment variable
- Generated using `scripts/generate-encryption-key.js`

#### User Server Secrets

- Each user has a unique 256-bit server secret
- Generated automatically during user registration
- Encrypted with the master server key before database storage
- Used to encrypt/decrypt that user's file chunks

### Encryption Flow

#### Upload Process

1. Client encrypts file chunks with user-derived keys
2. Client uploads encrypted chunks to S3 via presigned URLs
3. Client calls `/api/files/complete-chunk` with chunk metadata
4. Server downloads chunk from S3
5. Server applies additional encryption using user's server secret
6. Server re-uploads doubly-encrypted chunk to S3
7. Server updates chunk metadata with server encryption info

#### Download Process

1. Client calls `/api/files/prepare-download` to get download URLs
2. For server-encrypted chunks, server provides secure download URLs
3. Client downloads chunks via `/api/files/download-chunk`
4. Server downloads from S3 and removes server encryption layer
5. Server streams client-encrypted chunk to client
6. Client decrypts with user-derived keys

## API Endpoints

### `/api/auth/initialize-server-secret` (POST)

Initializes server secret for a newly registered user.

**Authentication**: Required
**Body**: None (uses authenticated user)
**Response**: `{ success: boolean, message: string }`

### `/api/files/complete-chunk` (POST)

Completes chunk upload and applies server-side encryption.

**Authentication**: Required
**Body**:

```json
{
  "chunkId": "string",
  "checksum": "string",
  "encryptionIV": "string"
}
```

**Response**: `{ success: boolean, chunk: ChunkWithoutFile }`

### `/api/files/download-chunk?chunkId=<id>` (GET)

Downloads and decrypts a specific chunk.

**Authentication**: Required
**Query**: `chunkId` - The chunk ID to download
**Response**: Binary chunk data (streaming)

### `/api/files/prepare-download?fileId=<id>` (GET)

Prepares download URLs for all chunks of a file.

**Authentication**: Required
**Query**: `fileId` - The file ID to prepare for download
**Response**: File metadata with download URLs

## Setup Instructions

### 1. Generate Master Encryption Key

```bash
node scripts/generate-encryption-key.js
```

### 2. Update Environment Variables

Add to your `.env` file:

```bash
SERVER_ENCRYPTION_MASTER_KEY=your_64_character_hex_key_here
```

### 3. Update Database Schema

The schema changes are already included in the Prisma schema. For MongoDB, no migration is needed - the schema is applied automatically.

### 4. Restart Application

Restart your application to load the new environment variables.

## Security Considerations

### Key Security

- **Master Key**: Store securely, never commit to version control
- **Server Secrets**: Automatically managed, encrypted at rest
- **Key Rotation**: Implement periodic rotation of master key
- **Access Control**: Strict authentication required for all operations

### Threat Model

This implementation protects against:

- **Data Breach**: Even if S3 data is compromised, an additional decryption layer is required
- **Client Compromise**: Server-side keys provide additional protection
- **Internal Threats**: Server secrets are encrypted and user-specific

### Performance Impact

- **Upload**: Additional S3 round-trip for re-encryption (~100-500ms per chunk)
- **Download**: Server-side processing for decryption (~50-200ms per chunk)
- **Storage**: Minimal overhead (few extra database fields per chunk)

## Monitoring and Logging

The implementation includes logging for:

- Server secret generation/initialization
- Encryption/decryption operations
- Error conditions and failures

Monitor these logs for:

- Failed encryption/decryption attempts
- Missing server secrets
- Performance issues

## Troubleshooting

### Common Issues

**"Server secret not available for decryption"**

- User server secret missing or corrupted
- Re-initialize user server secret via API

**"Failed to decrypt chunk"**

- Chunk corruption or wrong encryption metadata
- Check S3 data integrity and database metadata

**"SERVER_ENCRYPTION_MASTER_KEY environment variable is not set"**

- Missing or incorrect environment variable
- Generate and set master key using provided script

### Recovery Procedures

**Lost Master Key**

- Server-encrypted chunks become unrecoverable
- Client-side encryption remains intact
- Consider this in backup/disaster recovery planning

**Corrupted Server Secret**

- Affects only that user's server-encrypted chunks
- Can regenerate server secret (loses access to existing server-encrypted data)
- Client-side encrypted data remains accessible

## Future Enhancements

- **Key Rotation**: Automated server secret rotation
- **HSM Integration**: Hardware security module support
- **Audit Logging**: Enhanced security event logging
- **Performance Optimization**: Caching and optimization for high-throughput scenarios
