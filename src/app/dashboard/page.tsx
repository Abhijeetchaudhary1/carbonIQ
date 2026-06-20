// ============================================================================
// Carbon Compass — Dashboard Page
// ============================================================================

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Activity, TrendingDown, Flame, Leaf, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import GlassCard from '@/components/ui/GlassCard';
import AnimatedSection from '@/components/ui/AnimatedSection';
import Button from '@/components/ui/Button';
import EmissionsPieChart from '@/components/dashboard/EmissionsPieChart';
import CategoryBreakdown from '@/components/dashboard/CategoryBreakdown';
import TrendChart from '@/components/dashboard/TrendChart';
import QuickInsights from '@/components/dashboard/QuickInsights';
import { useCarbonContext } from '@/context/CarbonContext';
import { generateInsights } from '@/lib/insights';
import Footer from '@/components/ui/Footer';

export default function DashboardPage() {
  const { state } = useCarbonContext();
  const router = useRouter();

  useEffect(() => {
    if (!state.hasCompletedAssessment) {
      router.push('/assessment');
    }
  }, [state.hasCompletedAssessment, router]);

  if (!state.carbonResults) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 rounded-full border-2 border-green-primary border-t-transparent animate-spin mx-auto" />
          <p className="text-text-muted">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const { totalMonthlyCO2, dailyCO2, rating, categories } = state.carbonResults;
  const insights = generateInsights(state.carbonResults);

  const ratingConfig = {
    low: { color: 'text-green-primary', bg: 'bg-green-primary/10', border: 'border-green-primary/20', label: 'Low Impact', icon: Leaf },
    medium: { color: 'text-amber', bg: 'bg-amber/10', border: 'border-amber/20', label: 'Moderate Impact', icon: Activity },
    high: { color: 'text-rose', bg: 'bg-rose/10', border: 'border-rose/20', label: 'High Impact', icon: Flame },
  };

  const rc = ratingConfig[rating];
  const RatingIcon = rc.icon;

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container-page">
        {/* Header */}
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-text-primary mb-2">
            Your Carbon Dashboard
          </h1>
          <p className="text-text-secondary">
            A comprehensive view of your environmental impact and emission breakdown.
          </p>
        </motion.div>

        {/* Hero Score Card */}
        <AnimatedSection>
          <div className="glass-card p-6 sm:p-8 mb-8 gradient-border">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              {/* Total CO2 */}
              <div className="text-center md:text-left">
                <p className="text-sm text-text-muted mb-1">Monthly Carbon Footprint</p>
                <div className="flex items-baseline gap-2 justify-center md:justify-start">
                  <motion.span
                    className="text-5xl sm:text-6xl font-bold text-text-primary"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    {Math.round(totalMonthlyCO2)}
                  </motion.span>
                  <span className="text-lg text-text-muted">kg CO₂</span>
                </div>
              </div>

              {/* Rating Badge */}
              <div className="flex justify-center">
                <div className={`inline-flex items-center gap-2 px-5 py-3 rounded-2xl ${rc.bg} border ${rc.border}`}>
                  <RatingIcon className={`w-5 h-5 ${rc.color}`} />
                  <span className={`text-sm font-semibold ${rc.color}`}>{rc.label}</span>
                </div>
              </div>

              {/* Daily CO2 */}
              <div className="text-center md:text-right">
                <p className="text-sm text-text-muted mb-1">Daily Estimate</p>
                <div className="flex items-baseline gap-2 justify-center md:justify-end">
                  <span className="text-3xl font-bold text-text-primary">
                    {dailyCO2.toFixed(1)}
                  </span>
                  <span className="text-sm text-text-muted">kg CO₂/day</span>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Category Breakdown */}
          <AnimatedSection delay={0.1}>
            <GlassCard hover={false} className="!p-6 h-full">
              <h3 className="text-lg font-semibold text-text-primary mb-6">Emission Breakdown</h3>
              <CategoryBreakdown categories={categories} total={totalMonthlyCO2} />
            </GlassCard>
          </AnimatedSection>

          {/* Pie Chart */}
          <AnimatedSection delay={0.2}>
            <GlassCard hover={false} className="!p-6 h-full">
              <h3 className="text-lg font-semibold text-text-primary mb-6">Distribution</h3>
              <EmissionsPieChart categories={categories} />
            </GlassCard>
          </AnimatedSection>
        </div>

        {/* Trend Chart */}
        {state.history.length > 1 && (
          <AnimatedSection delay={0.3}>
            <GlassCard hover={false} className="!p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-text-primary">Emission Trend</h3>
                <div className="flex items-center gap-1 text-green-primary text-sm">
                  <TrendingDown className="w-4 h-4" />
                  <span>Tracking {state.history.length} days</span>
                </div>
              </div>
              <TrendChart history={state.history} />
            </GlassCard>
          </AnimatedSection>
        )}

        {/* Quick Insights */}
        <AnimatedSection delay={0.4}>
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Quick Insights</h3>
            <QuickInsights insights={insights} />
          </div>
        </AnimatedSection>

        {/* CTA */}
        <AnimatedSection delay={0.5}>
          <div className="glass-card p-6 text-center">
            <h3 className="text-lg font-semibold text-text-primary mb-2">Ready to reduce your impact?</h3>
            <p className="text-sm text-text-muted mb-4">Get personalized recommendations from your AI Coach.</p>
            <Link href="/coach">
              <Button variant="primary">
                Go to AI Coach
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
