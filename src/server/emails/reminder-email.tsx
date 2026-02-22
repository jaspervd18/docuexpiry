import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import { format } from "date-fns";

interface ReminderEmailProps {
  userName: string;
  documentName: string;
  daysUntilExpiry: number;
  expiresAt: Date;
  dashboardUrl: string;
}

export function ReminderEmail({
  userName,
  documentName,
  daysUntilExpiry,
  expiresAt,
  dashboardUrl,
}: ReminderEmailProps) {
  const formattedDate = format(expiresAt, "PPP");

  return (
    <Html>
      <Head />
      <Preview>
        {documentName} expires in {String(daysUntilExpiry)} day
        {daysUntilExpiry === 1 ? "" : "s"}
      </Preview>
      <Body style={body}>
        <Container style={container}>
          <Heading style={heading}>Document Expiring Soon</Heading>

          <Text style={text}>Hi {userName},</Text>

          <Text style={text}>
            Your document <strong>{documentName}</strong> expires in{" "}
            <strong>
              {daysUntilExpiry} day{daysUntilExpiry === 1 ? "" : "s"}
            </strong>{" "}
            on {formattedDate}.
          </Text>

          <Section style={buttonContainer}>
            <Button style={button} href={dashboardUrl}>
              View Dashboard
            </Button>
          </Section>

          <Hr style={hr} />

          <Text style={footer}>
            DocuExpiry &mdash; Document Expiration Tracking
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const body = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "40px 20px",
  maxWidth: "560px",
  borderRadius: "8px",
};

const heading = {
  fontSize: "24px",
  fontWeight: "600" as const,
  color: "#1a1a1a",
  marginBottom: "24px",
};

const text = {
  fontSize: "16px",
  lineHeight: "26px",
  color: "#374151",
};

const buttonContainer = {
  textAlign: "center" as const,
  marginTop: "32px",
  marginBottom: "32px",
};

const button = {
  backgroundColor: "#0f172a",
  borderRadius: "6px",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "600" as const,
  textDecoration: "none",
  textAlign: "center" as const,
  padding: "12px 24px",
};

const hr = {
  borderColor: "#e5e7eb",
  marginTop: "32px",
  marginBottom: "16px",
};

const footer = {
  fontSize: "12px",
  color: "#9ca3af",
  textAlign: "center" as const,
};
