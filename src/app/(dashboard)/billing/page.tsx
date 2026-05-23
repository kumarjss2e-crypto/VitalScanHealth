import { createClient } from '@/utils/supabase/server'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Check, Zap, Crown, Building2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const plans = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    description: 'Perfect for getting started with wellness tracking.',
    features: [
      '3 scans per day',
      'Basic heart rate & SpO2',
      '7-day history',
      'Mobile app access'
    ],
    buttonText: 'Current Plan',
    current: true
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$19',
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
    icon: Crown,
    color: 'bg-blue-600'
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 'Custom',
    description: 'Wellness solutions for teams and organizations.',
    features: [
      'Everything in Pro',
      'Team dashboard',
      'API access',
      'Custom integrations',
      'Priority support'
    ],
    buttonText: 'Contact Sales',
    icon: Building2
  }
]

export default async function BillingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', user?.id)
    .single()

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">Subscription & Billing</h1>
        <p className="text-zinc-400">Choose the plan that best fits your wellness journey.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <Card 
            key={plan.id} 
            className={cn(
              "bg-zinc-900/50 border-zinc-800 backdrop-blur-xl relative overflow-hidden flex flex-col",
              plan.popular && "border-blue-500/50 shadow-[0_0_30px_rgba(37,99,235,0.1)]"
            )}
          >
            {plan.popular && (
              <div className="absolute top-0 right-0">
                <div className="bg-blue-600 text-white text-[10px] font-bold uppercase tracking-widest py-1 px-10 rotate-45 translate-x-10 translate-y-3">
                  Popular
                </div>
              </div>
            )}
            
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                {plan.icon && (
                  <div className={cn("p-2 rounded-lg", plan.popular ? "bg-blue-600/20 text-blue-500" : "bg-zinc-800 text-zinc-400")}>
                    <plan.icon className="w-5 h-5" />
                  </div>
                )}
                <CardTitle>{plan.name}</CardTitle>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold">{plan.price}</span>
                {plan.price !== 'Custom' && <span className="text-zinc-500 text-sm">/month</span>}
              </div>
              <CardDescription className="pt-2">{plan.description}</CardDescription>
            </CardHeader>
            
            <CardContent className="flex-1">
              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm">
                    <div className="mt-0.5 rounded-full bg-blue-600/20 p-0.5">
                      <Check className="w-3.5 h-3.5 text-blue-500" />
                    </div>
                    <span className="text-zinc-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            
            <CardFooter>
              <Button 
                className={cn(
                  "w-full transition-all duration-300",
                  plan.popular ? "bg-blue-600 hover:bg-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.3)]" : "bg-zinc-800 hover:bg-zinc-700",
                  plan.current && "bg-emerald-600/10 text-emerald-500 border border-emerald-500/20 hover:bg-emerald-600/20"
                )}
                variant={plan.current ? "outline" : "default"}
              >
                {plan.current ? <Check className="w-4 h-4 mr-2" /> : null}
                {plan.buttonText}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Payment Method Placeholder */}
      <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-xl">
        <CardHeader>
          <CardTitle>Payment Method</CardTitle>
          <CardDescription>Manage your credit cards and billing information.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 rounded-xl border border-zinc-800 bg-zinc-950/50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-8 bg-zinc-800 rounded flex items-center justify-center text-[10px] font-bold text-zinc-500">
                VISA
              </div>
              <div>
                <p className="text-sm font-medium">•••• •••• •••• 4242</p>
                <p className="text-xs text-zinc-500">Expires 12/28</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300">
              Edit
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
