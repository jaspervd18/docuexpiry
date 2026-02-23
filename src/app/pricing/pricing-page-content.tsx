"use client";

import { MarketingReadyProvider } from "~/components/marketing/marketing-ready-provider";
import { MarketingNav } from "~/components/marketing/marketing-nav";
import { PricingComparison } from "./pricing-comparison";

const SIGN_IN_HREF = "/api/auth/signin?callbackUrl=/dashboard";

export function PricingPageContent() {
  return (
    <MarketingReadyProvider>
      <div className="min-h-screen bg-background text-foreground">
        <MarketingNav signInHref={SIGN_IN_HREF} />
        <PricingComparison signInHref={SIGN_IN_HREF} />
      </div>
    </MarketingReadyProvider>
  );
}
