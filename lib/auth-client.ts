import { twoFactorClient } from "better-auth/plugins";
import { passkeyClient } from "better-auth/plugins/passkey";
import { createAuthClient } from "better-auth/react";
export const authClient = createAuthClient({
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    passkeyClient(),
    twoFactorClient({
      onTwoFactorRedirect() {
        if (typeof window !== "undefined") {
          window.location.href = "/2fa-verification"; // Next.js redirect is not available here
        }
      },
    }),
  ],
});
// Handle the 2FA verification globally
