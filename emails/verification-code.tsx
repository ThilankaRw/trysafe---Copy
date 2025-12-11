import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from "@react-email/components";
import * as React from "react";

interface VerificationEmailProps {
  code: string;
  userName?: string;
}

export const VerificationEmail = ({
  code,
  userName = "there",
}: VerificationEmailProps) => (
  <Html>
    <Head />
    <Preview>Your verification code for TrySafe</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Verification Required</Heading>
        <Text style={text}>Hi {userName},</Text>
        <Text style={text}>Your verification code is:</Text>
        <Text style={code as React.CSSProperties}>{code}</Text>
        <Text style={text}>
          This code will expire in 10 minutes. If you didn't request this code,
          please ignore this email.
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

const code = {
  backgroundColor: "#f3f4f6",
  borderRadius: "4px",
  color: "#374151",
  display: "inline-block",
  fontFamily: "monospace",
  fontSize: "32px",
  fontWeight: "bold",
  letterSpacing: "8px",
  padding: "20px 25px",
  margin: "20px 0",
  textAlign: "center" as const,
  width: "100%",
};

const footer = {
  color: "#6b7280",
  fontSize: "14px",
  lineHeight: "24px",
  margin: "48px 0 0",
};

export default VerificationEmail;
