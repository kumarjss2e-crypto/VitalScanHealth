export type PlanId = 'free' | 'pro' | 'enterprise';

export interface PlanLimits {
  dailyScans: number;
  historyDays: number;
  features: {
    advancedVitals: boolean; // HRV, Stress, BP
    aiCopilot: boolean;
    exports: boolean;
    teamDashboard: boolean;
    apiAccess: boolean;
  };
}

export const PLAN_LIMITS: Record<PlanId, PlanLimits> = {
  free: {
    dailyScans: 3,
    historyDays: 7,
    features: {
      advancedVitals: false,
      aiCopilot: false,
      exports: false,
      teamDashboard: false,
      apiAccess: false,
    },
  },
  pro: {
    dailyScans: Infinity,
    historyDays: Infinity,
    features: {
      advancedVitals: true,
      aiCopilot: true,
      exports: true,
      teamDashboard: false,
      apiAccess: false,
    },
  },
  enterprise: {
    dailyScans: Infinity,
    historyDays: Infinity,
    features: {
      advancedVitals: true,
      aiCopilot: true,
      exports: true,
      teamDashboard: true,
      apiAccess: true,
    },
  },
};

export function getPlanLimits(planId: string = 'free'): PlanLimits {
  return PLAN_LIMITS[planId as PlanId] || PLAN_LIMITS.free;
}
