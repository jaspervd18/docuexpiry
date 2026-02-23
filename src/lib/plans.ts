export const PLANS = {
  free: { name: "Free", documentLimit: 10, price: 0 },
  solo: { name: "Solo", documentLimit: 200, price: 500 },
  team: { name: "Team", documentLimit: 2000, price: 1200 },
} as const;

export type PlanId = keyof typeof PLANS;

export function getDocumentLimit(plan: string): number {
  return PLANS[plan as PlanId]?.documentLimit ?? 10;
}

/* ------------------------------------------------------------------ */
/*  Feature comparison data (used by /pricing page + landing pricing) */
/* ------------------------------------------------------------------ */

export type FeatureValue = boolean | string;

export interface PlanFeature {
  label: string;
  free: FeatureValue;
  solo: FeatureValue;
  team: FeatureValue;
}

export const PLAN_FEATURES: PlanFeature[] = [
  { label: "Documents", free: "10", solo: "200", team: "2,000" },
  { label: "Categories & tags", free: true, solo: true, team: true },
  { label: "Email reminders", free: true, solo: true, team: true },
  { label: "Custom reminder schedule", free: false, solo: true, team: true },
  { label: "CSV import", free: true, solo: true, team: true },
  { label: "File attachments", free: false, solo: true, team: true },
  { label: "Shared workspace", free: false, solo: false, team: true },
  { label: "Roles & access control", free: false, solo: false, team: true },
  { label: "Priority support", free: false, solo: true, team: true },
  { label: "Analytics", free: "Basic", solo: "Full", team: "Full" },
];
