import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
  Button,
} from "@react-email/components";
import * as React from "react";

interface VerificationEmailProps {
  verificationLink: string;
  userName?: string;
}

export const VerificationEmail = ({
  verificationLink,
  userName = "there",
}: VerificationEmailProps) => (
  <Html>
    <Head />
    <Preview>Verify your email address for TrySafe</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Verify Your Email Address</Heading>
        <Text style={text}>Hi {userName},</Text>
        <Text style={text}>
          Please click the button below to verify your email address:
        </Text>
        <Button href={verificationLink} style={button}>
          Verify Email Address
        </Button>
        <Text style={text}>
          This link will expire in 24 hours. If you didn't create an account
          with TrySafe, please ignore this email.
        </Text>
        <Text style={text}>
          Or copy and paste this URL into your browser:
          <br />
          <span style={link}>{verificationLink}</span>
        </Text>
        <Text style={footer}>
          Best regards,
          <br />
          TrySafe Team
        </Text>
      </Container>
    </Body>
  </Html>
);

const main = {
  backgroundColor: "#f6f9fc",
  padding: "10px 0",
};

const container = {
  backgroundColor: "#ffffff",
  border: "1px solid #f0f0f0",
  borderRadius: "5px",
  margin: "0 auto",
  padding: "45px",
  maxWidth: "600px",
};

const h1 = {
  color: "#1f2937",
  fontSize: "24px",
  fontWeight: "600",
  lineHeight: "1.1",
  margin: "0 0 15px",
};

const text = {
  color: "#4b5563",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "15px 0",
};

const button = {
  backgroundColor: "#3b82f6",
  borderRadius: "5px",
  color: "#fff",
  display: "inline-block",
  fontSize: "16px",
  fontWeight: "bold",
  padding: "12px 24px",
  textDecoration: "none",
  textAlign: "center" as const,
  margin: "20px 0",
};

const link = {
  color: "#3b82f6",
  display: "inline-block",
  fontSize: "14px",
  marginTop: "8px",
  wordBreak: "break-all" as const,
};

const footer = {
  color: "#6b7280",
  fontSize: "14px",
  lineHeight: "24px",
  margin: "48px 0 0",
};

export default VerificationEmail;
