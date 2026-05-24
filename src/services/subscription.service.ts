import { createClient } from '@/utils/supabase/server';
import { getPlanLimits, PlanId } from '@/lib/subscription-limits';

export async function getSubscriptionStatus(userId: string) {
  const supabase = await createClient();
  
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (!subscription || subscription.status !== 'active') {
    return {
      planId: 'free' as PlanId,
      limits: getPlanLimits('free'),
      isActive: false
    };
  }

  return {
    planId: subscription.plan_id as PlanId,
    limits: getPlanLimits(subscription.plan_id),
    isActive: true,
    subscription
  };
}

export async function checkUsageLimit(userId: string, metric: string = 'scans') {
  const supabase = await createClient();
  const today = new Date().toISOString().split('T')[0];

  const { planId, limits } = await getSubscriptionStatus(userId);
  
  if (limits.dailyScans === Infinity) return { allowed: true, count: 0, limit: Infinity };

  const { data: usage } = await supabase
    .from('usage_tracking')
    .select('count')
    .eq('user_id', userId)
    .eq('metric', metric)
    .eq('reset_at', today)
    .maybeSingle();

  const currentCount = usage?.count || 0;

  return {
    allowed: currentCount < limits.dailyScans,
    count: currentCount,
    limit: limits.dailyScans
  };
}

export async function incrementUsage(userId: string, metric: string = 'scans') {
  const supabase = await createClient();
  const today = new Date().toISOString().split('T')[0];

  // Using RPC for atomic increment or upsert
  const { data, error } = await supabase.rpc('increment_usage', {
    u_id: userId,
    m_name: metric,
    r_date: today
  });

  if (error) {
    // Fallback if RPC doesn't exist yet (though we should create it)
    const { data: existing } = await supabase
      .from('usage_tracking')
      .select('id, count')
      .eq('user_id', userId)
      .eq('metric', metric)
      .eq('reset_at', today)
      .maybeSingle();

    if (existing) {
      await supabase
        .from('usage_tracking')
        .update({ count: existing.count + 1 })
        .eq('id', existing.id);
    } else {
      await supabase
        .from('usage_tracking')
        .insert({
          user_id: userId,
          metric: metric,
          count: 1,
          reset_at: today
        });
    }
  }
}
