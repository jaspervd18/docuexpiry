import type { Metadata } from "next";
import { PricingPageContent } from "./pricing-page-content";

export const metadata: Metadata = {
  title: "Pricing | DocuExpiry",
  description:
    "DocuExpiry pricing plans. Free for up to 10 documents. Solo and Team plans for growing businesses.",
};

export default function PricingPage() {
  return <PricingPageContent />;
}
