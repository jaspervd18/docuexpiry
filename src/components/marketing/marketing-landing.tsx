"use client";

import { MarketingNav } from "./marketing-nav";
import { MarketingHero } from "./marketing-hero";
import { MarketingFeatures } from "./marketing-features";
import { MarketingSeoBlock } from "./marketing-seo";
import { MarketingFaq } from "./marketing-faq";
import { MarketingCtaFooter } from "./marketing-cta-footer";
import { MarketingPricing } from "./marketing-pricing";

export function MarketingLanding(props: { signInHref: string; appHref: string }) {
  // appHref kept for future use (e.g., "Open app" when signed in)
  const { signInHref } = props;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <MarketingNav signInHref={signInHref} />
      <MarketingHero signInHref={signInHref} />
      <MarketingFeatures />
      <MarketingPricing signInHref={signInHref} />
      <MarketingSeoBlock />
      <MarketingFaq />
      <MarketingCtaFooter signInHref={signInHref} />
    </div>
  );
}
