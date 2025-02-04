import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { passkey } from "better-auth/plugins/passkey";
import prisma from "./prisma";
import { twoFactor } from "better-auth/plugins";
import { sendReactEmail } from "./email";
import VerificationEmail from "@/emails/verification-link";
import { VerificationEmail as VerificationEmailCode } from "@/emails/verification-code";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "mongodb",
  }),
  emailAndPassword: {
    enabled: true,
  },
  advanced: { generateId: false },
  plugins: [
    passkey(),
    twoFactor({
      issuer: "TriSafe",
      otpOptions: {
        sendOTP: async ({ user, otp }) => {
          await sendReactEmail({
            to: user.email,
            subject: "Your OTP",
            emailTemplate: VerificationEmailCode({
              code: otp,
              userName: user.name,
            }),
          });
        },
      },
    }),
  ],
  emailVerification: {
    sendVerificationEmail: async ({ user, url, token }, request) => {
      await sendReactEmail({
        to: user.email,
        subject: "Verify your email address",
        emailTemplate: VerificationEmail({
          verificationLink: url,
          userName: user.name,
        }),
      });
    },
  },
});
