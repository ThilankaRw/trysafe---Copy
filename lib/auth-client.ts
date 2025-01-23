import { passkeyClient } from "better-auth/plugins/passkey";
import { createAuthClient } from "better-auth/react";
export const authClient = createAuthClient({
  emailAndPassword: {
    enabled: true,
  },
  plugins: [passkeyClient()],
});
