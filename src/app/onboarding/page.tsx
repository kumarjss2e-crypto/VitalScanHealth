'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { createClient } from '@/utils/supabase/client'
import { Database } from '@/types/supabase'
import { toast } from 'sonner'
import { 
  Heart, 
  Target, 
  Activity, 
  Brain, 
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Loader2
} from 'lucide-react'
import { cn } from '@/lib/utils'

const steps = [
  {
    id: 'goals',
    title: 'What are your wellness goals?',
    description: 'Select all that apply to personalize your experience.',
    options: [
      { id: 'stress', label: 'Reduce Stress', icon: Brain },
      { id: 'sleep', label: 'Improve Sleep', icon: Target },
      { id: 'fitness', label: 'Track Fitness', icon: Activity },
      { id: 'heart', label: 'Heart Health', icon: Heart },
      { id: 'overall', label: 'Overall Wellness', icon: Sparkles },
    ]
  },
  {
    id: 'focus',
    title: 'Health Focus Areas',
    description: 'What metrics are most important to you?',
    options: [
      { id: 'hrv', label: 'HRV Tracking', icon: Activity },
      { id: 'bp', label: 'Blood Pressure', icon: Activity },
      { id: 'spo2', label: 'Oxygen Levels', icon: Activity },
      { id: 'stress_score', label: 'Stress Scores', icon: Zap },
    ]
  }
]

// Adding Zap icon since it was used but not imported from lucide-react above
import { Zap } from 'lucide-react'

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [selections, setSelections] = useState<Record<string, string[]>>({
    goals: [],
    focus: []
  })
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const toggleSelection = (stepId: string, optionId: string) => {
    setSelections(prev => {
      const current = prev[stepId]
      if (current.includes(optionId)) {
        return { ...prev, [stepId]: current.filter(id => id !== optionId) }
      } else {
        return { ...prev, [stepId]: [...current, optionId] }
      }
    })
  }

  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1)
    } else {
      setLoading(true)
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('No user found')

        // Force cast the from() call to bypass complex Supabase type inference during build
        const { error } = await (supabase.from('profiles') as any)
          .update({
            wellness_goals: selections.goals,
            health_focus_areas: selections.focus,
            onboarding_completed: true
          })
          .eq('id', user.id)

        if (error) throw error

        toast.success('Onboarding complete!')
        
        // Use a small timeout to ensure state is settled before redirect
        setTimeout(() => {
          router.push('/dashboard')
          router.refresh()
        }, 100)
      } catch (error: any) {
        toast.error(error.message || 'Failed to save preferences')
      } finally {
        setLoading(false)
      }
    }
  }

  const step = steps[currentStep]

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-2xl z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-xl">
              <CardHeader className="text-center pt-10">
                <div className="flex justify-center mb-6">
                  <div className="flex gap-2">
                    {steps.map((_, i) => (
                      <div 
                        key={i} 
                        className={cn(
                          "w-12 h-1.5 rounded-full transition-all duration-500",
                          i <= currentStep ? "bg-blue-600" : "bg-zinc-800"
                        )}
                      />
                    ))}
                  </div>
                </div>
                <CardTitle className="text-3xl font-bold text-white">{step.title}</CardTitle>
                <CardDescription className="text-zinc-400 text-lg">{step.description}</CardDescription>
              </CardHeader>
              <CardContent className="px-10 pb-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {step.options.map((option) => {
                    const isSelected = selections[step.id].includes(option.id)
                    return (
                      <button
                        key={option.id}
                        onClick={() => toggleSelection(step.id, option.id)}
                        className={cn(
                          "flex items-center gap-4 p-5 rounded-2xl border-2 text-left transition-all duration-200 group",
                          isSelected 
                            ? "bg-blue-600/10 border-blue-600 text-white" 
                            : "bg-zinc-950/50 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
                        )}
                      >
                        <div className={cn(
                          "p-3 rounded-xl transition-colors",
                          isSelected ? "bg-blue-600 text-white" : "bg-zinc-900 text-zinc-500 group-hover:text-zinc-300"
                        )}>
                          <option.icon className="w-6 h-6" />
                        </div>
                        <span className="font-semibold text-lg">{option.label}</span>
                      </button>
                    )
                  })}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between px-10 pb-10">
                <Button
                  variant="ghost"
                  onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
                  disabled={currentStep === 0 || loading}
                  className="text-zinc-500 hover:text-white"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button
                  onClick={handleNext}
                  disabled={selections[step.id].length === 0 || loading}
                  className="bg-blue-600 hover:bg-blue-500 min-w-[120px]"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      {currentStep === steps.length - 1 ? 'Complete' : 'Next'}
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
