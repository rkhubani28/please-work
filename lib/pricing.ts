import type { PlanType, TierType, Plan, Tier } from "./types";

export const PLANS: Record<PlanType, Plan> = {
  beat: {
    id: "beat",
    name: "The Beat",
    description: "75% coverage, 25% analytics",
    contentRatio: 75,
    analyticsRatio: 25,
    builtFor: "The League Character",
  },
  double: {
    id: "double",
    name: "The Double",
    description: "50% coverage, 50% analytics",
    contentRatio: 50,
    analyticsRatio: 50,
    builtFor: "The all-rounder (default)",
  },
  "war-room": {
    id: "war-room",
    name: "The War Room",
    description: "25% coverage, 75% analytics",
    contentRatio: 25,
    analyticsRatio: 75,
    builtFor: "The Edge-Seeker",
  },
};

export const TIERS: Record<TierType, Tier> = {
  free: {
    id: "free",
    name: "Free",
    price: "$0",
    depth: "metered",
    leagues: 1,
    sharing: "watermarked",
  },
  "all-access": {
    id: "all-access",
    name: "All-Access",
    price: "$2.99/mo or $12/season",
    depth: "full",
    leagues: 999, // unlimited
    sharing: "clean",
  },
  "league-newsroom": {
    id: "league-newsroom",
    name: "League Newsroom",
    price: "$39/season (whole league)",
    depth: "full",
    leagues: 999,
    sharing: "league-branded",
  },
};

export function canAccess(
  tier: TierType,
  plan: PlanType,
  featureType: "content" | "analytics"
): boolean {
  if (tier === "free") {
    // Free has metered access but still has both types
    return true;
  }
  // All-Access and League Newsroom have full access to both
  return true;
}

export function getFeatureDepth(
  tier: TierType,
  plan: PlanType,
  featureType: "content" | "analytics"
): "none" | "light" | "core" | "full" {
  const planData = PLANS[plan];

  if (tier === "free") {
    // Metered access
    if (featureType === "content" && planData.contentRatio > 50) return "light";
    if (featureType === "analytics" && planData.analyticsRatio > 50) return "light";
    return "light";
  }

  if (tier === "all-access" || tier === "league-newsroom") {
    // Full access based on plan emphasis
    if (featureType === "content" && planData.contentRatio > 50) return "full";
    if (featureType === "analytics" && planData.analyticsRatio > 50) return "full";
    return "core"; // secondary features
  }

  return "none";
}

export function getPlanContent(plan: PlanType): string[] {
  const planData = PLANS[plan];
  if (planData.contentRatio > 50) {
    return ["recaps", "ranking-columns", "storylines", "awards", "headlines"];
  }
  if (planData.contentRatio === 50) {
    return ["recaps", "ranking-columns", "storylines", "awards", "headlines"];
  }
  return ["recaps", "headlines"]; // light
}

export function getPlanAnalytics(plan: PlanType): string[] {
  const planData = PLANS[plan];
  if (planData.analyticsRatio > 50) {
    return [
      "start-sit",
      "waivers",
      "trade-analyzer",
      "projections",
      "advanced-lineup",
      "accuracy-depth",
    ];
  }
  if (planData.analyticsRatio === 50) {
    return ["start-sit", "waivers", "trade-analyzer", "projections"];
  }
  return ["start-sit", "projections"]; // light
}

export function formatPrice(tier: TierType): string {
  return TIERS[tier].price;
}

export function getDescription(tier: TierType, plan: PlanType): string {
  const tierData = TIERS[tier];
  const planData = PLANS[plan];

  if (tier === "free") {
    return `Metered taste of ${planData.name.toLowerCase()} for 1 league. Watermarked sharing.`;
  }
  if (tier === "all-access") {
    return `Full ${planData.name.toLowerCase()} across all your leagues. Clean graphics, personal feed.`;
  }
  return `League-wide access to ${planData.name.toLowerCase()}. Shared hub for all members.`;
}
