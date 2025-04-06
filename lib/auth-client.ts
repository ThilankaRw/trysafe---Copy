import { twoFactorClient } from "better-auth/plugins";
import { passkeyClient } from "better-auth/client/plugins";
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
          window.location.href = "/2fa";
        }
      },
    }),
  ],
});
// Handle the 2FA verification globally
