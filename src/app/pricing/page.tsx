import type { Metadata } from "next";
import { MarketingNav } from "~/components/marketing/marketing-nav";
import { PricingComparison } from "./pricing-comparison";

export const metadata: Metadata = {
  title: "Pricing — DocuExpiry",
  description:
    "DocuExpiry pricing plans. Free for up to 10 documents. Solo and Team plans for growing businesses.",
};

const SIGN_IN_HREF = "/api/auth/signin?callbackUrl=/dashboard";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <MarketingNav signInHref={SIGN_IN_HREF} />
      <PricingComparison signInHref={SIGN_IN_HREF} />
    </div>
  );
}
