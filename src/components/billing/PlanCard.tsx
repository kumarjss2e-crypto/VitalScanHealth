'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Check, Loader2, Crown, Building2, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'

const icons = {
  free: Zap,
  pro: Crown,
  enterprise: Building2,
}

interface PlanCardProps {
  plan: {
    id: string;
    name: string;
    price: string;
    description: string;
    features: string[];
    buttonText: string;
    popular?: boolean;
    iconName?: keyof typeof icons;
    current?: boolean;
    priceId?: string;
  };
}

export function PlanCard({ plan }: PlanCardProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  
  const Icon = plan.iconName ? icons[plan.iconName] : null

  const handleAction = async () => {
    if (plan.current) return;
    
    setLoading(true)
    try {
      if (plan.id === 'enterprise') {
        window.location.href = 'mailto:sales@vitalscan.health'
        return
      }

      const response = await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId: plan.priceId,
          planId: plan.id,
        }),
      })

      const contentType = response.headers.get('content-type')
      if (!response.ok || !contentType?.includes('application/json')) {
        const text = await response.text()
        console.error('Server error:', text)
        throw new Error('Server returned an invalid response. Please check if Stripe environment variables are set.')
      }

      const data = await response.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error(data.error || 'Failed to start checkout')
      }
    } catch (error) {
      console.error('Checkout error:', error)
      alert('Failed to start checkout. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card 
      className={cn(
        "bg-card border-border backdrop-blur-xl relative overflow-hidden flex flex-col",
        plan.popular && "border-primary/50 shadow-[0_0_30px_rgba(var(--primary),0.1)]"
      )}
    >
      {plan.popular && (
        <div className="absolute top-0 right-0">
          <div className="bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-widest py-1 px-10 rotate-45 translate-x-10 translate-y-3">
            Popular
          </div>
        </div>
      )}
      
      <CardHeader>
        <div className="flex items-center gap-3 mb-2">
          {Icon && (
            <div className={cn("p-2 rounded-lg", plan.popular ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground")}>
              <Icon className="w-5 h-5" />
            </div>
          )}
          <CardTitle>{plan.name}</CardTitle>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-bold">{plan.price}</span>
          {plan.price !== 'Custom' && <span className="text-muted-foreground text-sm">/month</span>}
        </div>
        <CardDescription className="pt-2">{plan.description}</CardDescription>
      </CardHeader>
      
      <CardContent className="flex-1">
        <ul className="space-y-3">
          {plan.features.map((feature) => (
            <li key={feature} className="flex items-start gap-3 text-sm">
              <div className="mt-0.5 rounded-full bg-primary/20 p-0.5">
                <Check className="w-3.5 h-3.5 text-primary" />
              </div>
              <span className="text-foreground/80">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      
      <CardFooter>
        <Button 
          onClick={handleAction}
          disabled={loading || plan.current}
          className={cn(
            "w-full transition-all duration-300",
            plan.popular ? "bg-primary hover:bg-primary/90 shadow-[0_0_15px_rgba(var(--primary),0.3)]" : "bg-secondary hover:bg-secondary/80",
            plan.current && "bg-emerald-600/10 text-emerald-500 border border-emerald-500/20 hover:bg-emerald-600/20 opacity-100"
          )}
          variant={plan.current ? "outline" : "default"}
        >
          {loading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : plan.current ? (
            <Check className="w-4 h-4 mr-2" />
          ) : null}
          {plan.buttonText}
        </Button>
      </CardFooter>
    </Card>
  )
}
