export const PLANS = {
  free: { name: "Free", documentLimit: 10, price: 0 },
  solo: { name: "Solo", documentLimit: 200, price: 500 },
  team: { name: "Team", documentLimit: 2000, price: 1200 },
} as const;

export type PlanId = keyof typeof PLANS;

export function getDocumentLimit(plan: string): number {
  return PLANS[plan as PlanId]?.documentLimit ?? 10;
}
