// ============================================================================
// Carbon Compass — AI Coach Page
// ============================================================================

'use client';

import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Brain, Target, Sparkles, Calendar, TrendingDown,
  CheckCircle, ArrowRight, Zap, Star
} from 'lucide-react';
import Link from 'next/link';
import GlassCard from '@/components/ui/GlassCard';
import AnimatedSection from '@/components/ui/AnimatedSection';
import Button from '@/components/ui/Button';
import DailyActions from '@/components/coach/DailyActions';
import { useCarbonContext } from '@/context/CarbonContext';
import { generateRecommendations } from '@/lib/recommendations';
import { CATEGORY_CONFIG } from '@/lib/constants';
import Footer from '@/components/ui/Footer';

export default function CoachPage() {
  const { state } = useCarbonContext();
  const router = useRouter();

  useEffect(() => {
    if (!state.hasCompletedAssessment) {
      router.push('/assessment');
    }
  }, [state.hasCompletedAssessment, router]);

  const coachData = useMemo(() => {
    if (!state.assessmentData || !state.carbonResults) return null;
    return generateRecommendations(state.assessmentData, state.carbonResults);
  }, [state.assessmentData, state.carbonResults]);

  if (!coachData || !state.carbonResults) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 rounded-full border-2 border-green-primary border-t-transparent animate-spin mx-auto" />
          <p className="text-text-muted">Analyzing your data...</p>
        </div>
      </div>
    );
  }

  const difficultyColors = {
    easy: 'text-green-primary bg-green-primary/10',
    moderate: 'text-amber bg-amber/10',
    challenging: 'text-orange bg-orange/10',
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container-page">
        {/* Header */}
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-primary/20 to-ocean/20 flex items-center justify-center">
              <Brain className="w-5 h-5 text-green-primary" />
            </div>
            <span className="text-sm font-medium text-green-primary">AI-Powered Analysis</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-text-primary mb-2">
            Your Sustainability Coach
          </h1>
          <p className="text-text-secondary max-w-2xl">{coachData.analysis}</p>
        </motion.div>

        {/* Summary Cards */}
        <AnimatedSection>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <GlassCard glowColor="green" className="!p-5 text-center">
              <Target className="w-5 h-5 text-green-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-text-primary">{coachData.recommendations.length}</p>
              <p className="text-xs text-text-muted">Recommendations</p>
            </GlassCard>
            <GlassCard glowColor="ocean" className="!p-5 text-center">
              <TrendingDown className="w-5 h-5 text-ocean mx-auto mb-2" />
              <p className="text-2xl font-bold text-text-primary">
                {coachData.totalPotentialSavings.toFixed(0)}
              </p>
              <p className="text-xs text-text-muted">kg CO₂ potential savings/mo</p>
            </GlassCard>
            <GlassCard glowColor="amber" className="!p-5 text-center">
              <Sparkles className="w-5 h-5 text-amber mx-auto mb-2" />
              <p className="text-2xl font-bold text-text-primary">
                {state.carbonResults
                  ? Math.round((coachData.totalPotentialSavings / state.carbonResults.totalMonthlyCO2) * 100)
                  : 0}%
              </p>
              <p className="text-xs text-text-muted">Possible reduction</p>
            </GlassCard>
          </div>
        </AnimatedSection>

        {/* Top Priority */}
        <AnimatedSection delay={0.1}>
          <div className="glass-card p-6 sm:p-8 mb-8 gradient-border">
            <div className="flex items-center gap-2 mb-4">
              <Star className="w-5 h-5 text-amber" />
              <h2 className="text-lg font-bold text-text-primary">Top Priority Action</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold text-text-primary mb-2">
                  {coachData.topPriority.title}
                </h3>
                <p className="text-text-secondary text-sm mb-4">
                  {coachData.topPriority.description}
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-text-muted">Category:</span>
                    <span className="text-xs font-medium" style={{ color: CATEGORY_CONFIG[coachData.topPriority.category].color }}>
                      {CATEGORY_CONFIG[coachData.topPriority.category].label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-text-muted">Difficulty:</span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${difficultyColors[coachData.topPriority.difficulty]}`}>
                      {coachData.topPriority.difficulty}
                    </span>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="glass p-4 rounded-xl">
                  <p className="text-xs text-text-muted mb-1">Why It Matters</p>
                  <p className="text-sm text-text-secondary">{coachData.topPriority.whyItMatters}</p>
                </div>
                <div className="glass p-4 rounded-xl">
                  <p className="text-xs text-text-muted mb-1">Expected Impact</p>
                  <p className="text-sm text-green-primary font-medium">{coachData.topPriority.expectedImpact}</p>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Daily Action Center */}
        <AnimatedSection delay={0.2}>
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="w-5 h-5 text-green-primary" />
              <h2 className="text-lg font-bold text-text-primary">Daily Action Center</h2>
            </div>
            <DailyActions />
          </div>
        </AnimatedSection>

        {/* All Recommendations */}
        <AnimatedSection delay={0.3}>
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-ocean" />
              <h2 className="text-lg font-bold text-text-primary">All Recommendations</h2>
            </div>
            <div className="space-y-3">
              {coachData.recommendations.map((rec, i) => (
                <motion.div
                  key={rec.id}
                  className="glass-card !p-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.06 }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-text-muted font-mono">#{i + 1}</span>
                        <h4 className="text-sm font-semibold text-text-primary truncate">{rec.title}</h4>
                      </div>
                      <p className="text-xs text-text-muted line-clamp-2">{rec.description}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-green-primary">-{rec.estimatedSavings} kg</p>
                      <p className="text-[10px] text-text-muted">CO₂/month</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* Weekly Plan */}
        <AnimatedSection delay={0.4}>
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-violet" />
              <h2 className="text-lg font-bold text-text-primary">Weekly Action Plan</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {coachData.weeklyPlan.slice(0, 7).map((day) => (
                <GlassCard key={day.day} className="!p-4">
                  <h4 className="text-sm font-semibold text-text-primary mb-2">{day.day}</h4>
                  <ul className="space-y-1">
                    {day.actions.map((action, j) => (
                      <li key={j} className="flex items-start gap-2">
                        <span className="w-1 h-1 rounded-full bg-green-primary mt-1.5 shrink-0" />
                        <span className="text-xs text-text-muted">{action}</span>
                      </li>
                    ))}
                  </ul>
                </GlassCard>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* Monthly Goals */}
        <AnimatedSection delay={0.5}>
          <div className="mb-8">
            <h2 className="text-lg font-bold text-text-primary mb-4">Monthly Goals</h2>
            <div className="glass-card !p-6">
              <ul className="space-y-3">
                {coachData.monthlyGoals.map((goal, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-bg-card border border-border flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-xs text-text-muted font-mono">{i + 1}</span>
                    </div>
                    <span className="text-sm text-text-secondary">{goal}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </AnimatedSection>

        {/* CTA */}
        <AnimatedSection delay={0.6}>
          <div className="glass-card p-6 text-center">
            <h3 className="text-lg font-semibold text-text-primary mb-2">Track Your Progress</h3>
            <p className="text-sm text-text-muted mb-4">See how your daily actions translate to real emission reductions.</p>
            <Link href="/progress">
              <Button variant="primary">
                View Progress
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </AnimatedSection>
      </div>
      <Footer />
    </div>
  );
}
