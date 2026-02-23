"use client";

import dynamic from "next/dynamic";

import { MarketingNav } from "./marketing-nav";
import { MarketingStoryHook } from "./marketing-story-hook";
import { MarketingStoryBefore } from "./marketing-story-before";
import { MarketingStorySolution } from "./marketing-story-solution";
import { MarketingStoryBusiness } from "./marketing-story-business";
import { MarketingSocialProof } from "./marketing-social-proof";
import { MarketingPricingV2 } from "./marketing-pricing-v2";
import { MarketingStoryCta } from "./marketing-story-cta";

const PixiSectionTransition = dynamic(
  () =>
    import("./pixi/pixi-section-transition").then((m) => ({
      default: m.PixiSectionTransition,
    })),
  { ssr: false },
);

export function MarketingLanding(props: {
  signInHref: string;
  appHref: string;
}) {
  const { signInHref } = props;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <MarketingNav signInHref={signInHref} />
      <MarketingStoryHook signInHref={signInHref} />
      <PixiSectionTransition />
      <MarketingStoryBefore />
      <MarketingStorySolution />
      <PixiSectionTransition />
      <MarketingStoryBusiness />
      <MarketingSocialProof />
      <MarketingPricingV2 signInHref={signInHref} />
      <MarketingStoryCta signInHref={signInHref} />
    </div>
  );
}
