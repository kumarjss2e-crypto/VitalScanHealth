import { createClient } from '@/utils/supabase/server'
import { Database } from '@/types/supabase'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Check, Crown, Building2 } from 'lucide-react'
import { PlanCard } from '@/components/billing/PlanCard'
import { ManageSubscriptionButton } from '@/components/billing/ManageSubscriptionButton'

const plans = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    priceId: '', // No price ID for free
    description: 'Perfect for getting started with wellness tracking.',
    features: [
      '3 scans per day',
      'Basic heart rate & SpO2',
      '7-day history',
      'Mobile app access'
    ],
    buttonText: 'Current Plan',
    iconName: 'free'
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$19',
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID || 'price_placeholder_pro',
    description: 'Advanced insights for health enthusiasts.',
    features: [
      'Unlimited scans',
      'Full biometric suite (HRV, Stress, BP)',
      'Lifetime history',
      'AI Wellness Copilot',
      'Export data (PDF/CSV)'
    ],
    buttonText: 'Upgrade to Pro',
    popular: true,
    iconName: 'pro'
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 'Custom',
    priceId: '', // Custom handling
    description: 'Wellness solutions for teams and organizations.',
    features: [
      'Everything in Pro',
      'Team dashboard',
      'API access',
      'Custom integrations',
      'Priority support'
    ],
    buttonText: 'Contact Sales',
    iconName: 'enterprise'
  }
]

export default async function BillingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null
  
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle()

  const typedSubscription = subscription as Database['public']['Tables']['subscriptions']['Row'] | null
  const activePlanId = typedSubscription?.status === 'active' ? typedSubscription.plan_id : 'free'

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">Subscription & Billing</h1>
        <p className="text-muted-foreground">Choose the plan that best fits your wellness journey.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <PlanCard 
            key={plan.id} 
            plan={{
              ...plan,
              current: activePlanId === plan.id,
              buttonText: activePlanId === plan.id ? 'Current Plan' : plan.buttonText
            }} 
          />
        ))}
      </div>

      {/* Payment Method Placeholder */}
      <Card className="bg-card border-border backdrop-blur-xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Billing Management</CardTitle>
              <CardDescription>Manage your subscription, payment methods, and invoices.</CardDescription>
            </div>
            {typedSubscription?.stripe_subscription_id && (
              <ManageSubscriptionButton />
            )}
          </div>
        </CardHeader>
        <CardContent>
          {!typedSubscription?.stripe_subscription_id ? (
            <div className="text-center py-6 text-muted-foreground text-sm border border-dashed border-border rounded-xl">
              No active subscription found. Upgrade to Pro to add a payment method.
            </div>
          ) : (
            <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-8 bg-muted rounded flex items-center justify-center text-[10px] font-bold text-muted-foreground">
                  STRIPE
                </div>
                <div>
                  <p className="text-sm font-medium">Active {typedSubscription.plan_id.toUpperCase()} Subscription</p>
                  <p className="text-xs text-muted-foreground">
                    Next billing date: {typedSubscription.current_period_end ? new Date(typedSubscription.current_period_end).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
