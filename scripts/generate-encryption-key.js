#!/usr/bin/env node

/**
 * Utility script to generate server encryption keys for TrySafe
 * Run this script to generate a secure master key for server-side chunk encryption
 */

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

function generateMasterKey() {
  // Generate a secure 256-bit key
  const key = crypto.randomBytes(32).toString("hex");
  return key;
}

function updateEnvFile(masterKey) {
  const envPath = path.join(process.cwd(), ".env");
  const envExamplePath = path.join(process.cwd(), ".env.example");

  const keyLine = `SERVER_ENCRYPTION_MASTER_KEY=${masterKey}`;

  if (fs.existsSync(envPath)) {
    // Update existing .env file
    let envContent = fs.readFileSync(envPath, "utf8");

    if (envContent.includes("SERVER_ENCRYPTION_MASTER_KEY=")) {
      // Replace existing key
      envContent = envContent.replace(
        /SERVER_ENCRYPTION_MASTER_KEY=.*/,
        keyLine
      );
    } else {
      // Add new key
      envContent += `\n# Server-side Encryption\n${keyLine}\n`;
    }

    fs.writeFileSync(envPath, envContent);
    console.log("✅ Updated .env file with new server encryption master key");
  } else {
    // Create new .env file from .env.example
    if (fs.existsSync(envExamplePath)) {
      let envContent = fs.readFileSync(envExamplePath, "utf8");
      envContent = envContent.replace(
        'SERVER_ENCRYPTION_MASTER_KEY="your_server_encryption_master_key_here"',
        keyLine
      );
      fs.writeFileSync(envPath, envContent);
      console.log("✅ Created .env file with server encryption master key");
    } else {
      // Create minimal .env file
      fs.writeFileSync(envPath, `${keyLine}\n`);
      console.log("✅ Created .env file with server encryption master key");
    }
  }
}

function main() {
  console.log("🔐 TrySafe Server Encryption Key Generator\n");

  const masterKey = generateMasterKey();

  console.log("Generated server encryption master key:");
  console.log(`🔑 ${masterKey}\n`);

  console.log("⚠️  IMPORTANT SECURITY NOTES:");
  console.log("• This key encrypts user server secrets - keep it secure!");
  console.log(
    "• Store this key in a secure location (password manager, HSM, etc.)"
  );
  console.log("• Never commit this key to version control");
  console.log(
    "• If this key is lost, server-encrypted chunks cannot be decrypted"
  );
  console.log("• Rotate this key periodically for enhanced security\n");

  // Ask user if they want to update .env file
  const readline = require("readline");
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question(
    "Do you want to update your .env file with this key? (y/N): ",
    (answer) => {
      if (answer.toLowerCase() === "y" || answer.toLowerCase() === "yes") {
        try {
          updateEnvFile(masterKey);
        } catch (error) {
          console.error("❌ Error updating .env file:", error.message);
          console.log("\nManually add this line to your .env file:");
          console.log(`SERVER_ENCRYPTION_MASTER_KEY=${masterKey}`);
        }
      } else {
        console.log("\nManually add this line to your .env file:");
        console.log(`SERVER_ENCRYPTION_MASTER_KEY=${masterKey}`);
      }

      console.log(
        "\n✨ Setup complete! Your TrySafe instance now supports server-side chunk encryption."
      );
      rl.close();
    }
  );
}

if (require.main === module) {
  main();
}
