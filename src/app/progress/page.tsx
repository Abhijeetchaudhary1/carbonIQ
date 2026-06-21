// ============================================================================
// Carbon Compass — Progress Page
// ============================================================================

'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  TrendingDown, Calendar, Award, Target,
  ArrowRight, BarChart3
} from 'lucide-react';
import {
  XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, AreaChart, Area
} from 'recharts';
import Link from 'next/link';
import GlassCard from '@/components/ui/GlassCard';
import AnimatedSection from '@/components/ui/AnimatedSection';
import Button from '@/components/ui/Button';
import { useCarbonContext } from '@/context/CarbonContext';
import Footer from '@/components/ui/Footer';

type TimeRange = 'daily' | 'weekly' | 'monthly';

interface TooltipPayloadItem {
  name: string;
  value: number;
  color: string;
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: TooltipPayloadItem[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-strong rounded-lg px-3 py-2 text-sm">
      <p className="text-text-muted text-xs mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name} className="text-text-primary">
          <span style={{ color: p.color }}>{p.name}:</span> {p.value.toFixed(1)} kg
        </p>
      ))}
    </div>
  );
}

export default function ProgressPage() {
  const { state } = useCarbonContext();
  const router = useRouter();
  const [timeRange, setTimeRange] = useState<TimeRange>('daily');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!state.hasCompletedAssessment) {
      router.push('/assessment');
    }
  }, [state.hasCompletedAssessment, router]);

  const history = state.history;

  const chartData = useMemo(() => {
    if (!history.length) return [];

    const sorted = [...history].sort((a, b) => a.date.localeCompare(b.date));

    if (timeRange === 'daily') {
      return sorted.slice(-14).map(entry => ({
        date: new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        'Net CO₂': entry.netCO2,
        Savings: entry.actionsSavings,
      }));
    }

    if (timeRange === 'weekly') {
      // Group by week
      const weeks: Record<string, { netCO2: number; savings: number; count: number }> = {};
      sorted.forEach(entry => {
        const d = new Date(entry.date);
        const weekStart = new Date(d);
        weekStart.setDate(d.getDate() - d.getDay());
        const key = weekStart.toISOString().split('T')[0];
        if (!weeks[key]) weeks[key] = { netCO2: 0, savings: 0, count: 0 };
        weeks[key].netCO2 += entry.netCO2;
        weeks[key].savings += entry.actionsSavings;
        weeks[key].count++;
      });
      return Object.entries(weeks).map(([date, data]) => ({
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        'Net CO₂': Math.round((data.netCO2 / data.count) * 10) / 10,
        Savings: Math.round((data.savings / data.count) * 10) / 10,
      }));
    }

    // Monthly
    const months: Record<string, { netCO2: number; savings: number; count: number }> = {};
    sorted.forEach(entry => {
      const key = entry.date.substring(0, 7);
      if (!months[key]) months[key] = { netCO2: 0, savings: 0, count: 0 };
      months[key].netCO2 += entry.netCO2;
      months[key].savings += entry.actionsSavings;
      months[key].count++;
    });
    return Object.entries(months).map(([date, data]) => ({
      date: new Date(date + '-01').toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
      'Net CO₂': Math.round((data.netCO2 / data.count) * 10) / 10,
      Savings: Math.round((data.savings / data.count) * 10) / 10,
    }));
  }, [history, timeRange]);

  // Metrics
  const metrics = useMemo(() => {
    if (!history.length) return { totalSaved: 0, avgDaily: 0, bestDay: 0, streak: 0, improvement: 0 };

    const sorted = [...history].sort((a, b) => a.date.localeCompare(b.date));
    const totalSaved = sorted.reduce((sum, e) => sum + e.actionsSavings, 0);
    const avgDaily = totalSaved / sorted.length;
    const bestDay = Math.max(...sorted.map(e => e.actionsSavings));

    // Streak
    let streak = 0;
    for (let i = sorted.length - 1; i >= 0; i--) {
      if (sorted[i].actionsSavings > 0) streak++;
      else break;
    }

    // Improvement (first vs last)
    const first = sorted[0]?.netCO2 ?? 0;
    const last = sorted[sorted.length - 1]?.netCO2 ?? 0;
    const improvement = first > 0 ? Math.round(((first - last) / first) * 100) : 0;

    return { totalSaved: Math.round(totalSaved * 10) / 10, avgDaily: Math.round(avgDaily * 10) / 10, bestDay: Math.round(bestDay * 10) / 10, streak, improvement };
  }, [history]);

  if (!state.carbonResults) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 rounded-full border-2 border-green-primary border-t-transparent animate-spin mx-auto" />
          <p className="text-text-muted">Loading progress...</p>
        </div>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="min-h-screen pt-24 pb-16">
        <div className="container-page text-center max-w-lg mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="w-16 h-16 rounded-2xl bg-green-primary/10 flex items-center justify-center mx-auto">
              <BarChart3 className="w-8 h-8 text-green-primary" />
            </div>
            <h1 className="text-3xl font-bold text-text-primary">No Progress Data Yet</h1>
            <p className="text-text-secondary">
              Complete daily actions from the AI Coach to start building your progress history.
            </p>
            <Link href="/coach">
              <Button variant="primary">
                Go to AI Coach
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

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
            Progress Tracking
          </h1>
          <p className="text-text-secondary">
            Track your journey towards a smaller carbon footprint.
          </p>
        </motion.div>

        {/* Metric Cards */}
        <AnimatedSection>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            {[
              { label: 'Total Saved', value: `${metrics.totalSaved} kg`, icon: TrendingDown, color: 'text-green-primary' },
              { label: 'Avg Daily', value: `${metrics.avgDaily} kg`, icon: Target, color: 'text-ocean' },
              { label: 'Best Day', value: `${metrics.bestDay} kg`, icon: Award, color: 'text-amber' },
              { label: 'Streak', value: `${metrics.streak} days`, icon: Calendar, color: 'text-violet' },
              { label: 'Improvement', value: `${metrics.improvement}%`, icon: TrendingDown, color: 'text-green-primary' },
            ].map((metric) => (
              <GlassCard key={metric.label} className="!p-4 text-center">
                <metric.icon className={`w-5 h-5 mx-auto mb-2 ${metric.color}`} />
                <p className="text-xl font-bold text-text-primary">{metric.value}</p>
                <p className="text-xs text-text-muted">{metric.label}</p>
              </GlassCard>
            ))}
          </div>
        </AnimatedSection>

        {/* Chart */}
        <AnimatedSection delay={0.1}>
          <GlassCard hover={false} className="!p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-text-primary">Emission Trend</h3>
              {/* Time Range Toggle */}
              <div className="flex items-center gap-1 bg-bg-card rounded-xl p-1">
                {(['daily', 'weekly', 'monthly'] as TimeRange[]).map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      timeRange === range
                        ? 'bg-green-primary/20 text-green-primary'
                        : 'text-text-muted hover:text-text-secondary'
                    }`}
                  >
                    {range.charAt(0).toUpperCase() + range.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="w-full h-[300px]">
              {mounted && (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                    <defs>
                      <linearGradient id="progressGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#34D399" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="#34D399" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="savingsGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#38BDF8" stopOpacity={0.2} />
                        <stop offset="100%" stopColor="#38BDF8" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" />
                    <XAxis dataKey="date" tick={{ fill: '#737373', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#737373', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="Net CO₂" stroke="#34D399" strokeWidth={2} fill="url(#progressGradient)" dot={false} />
                    <Area type="monotone" dataKey="Savings" stroke="#38BDF8" strokeWidth={1.5} fill="url(#savingsGradient)" dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </GlassCard>
        </AnimatedSection>

        {/* History Log */}
        <AnimatedSection delay={0.2}>
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-text-primary mb-4">History Log</h3>
            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
              {[...history]
                .sort((a, b) => b.date.localeCompare(a.date))
                .slice(0, 20)
                .map((entry, i) => (
                  <motion.div
                    key={entry.date}
                    className="glass-card !p-4 flex items-center justify-between"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-bg-card flex items-center justify-center">
                        <Calendar className="w-4 h-4 text-text-muted" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-text-primary">
                          {new Date(entry.date).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </p>
                        <p className="text-xs text-text-muted">
                          Base: {entry.totalCO2.toFixed(1)} kg
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {entry.actionsSavings > 0 && (
                        <span className="text-xs text-green-primary font-medium">
                          -{entry.actionsSavings.toFixed(1)} kg saved
                        </span>
                      )}
                      <span className="text-sm font-semibold text-text-primary">
                        {entry.netCO2.toFixed(1)} kg
                      </span>
                    </div>
                  </motion.div>
                ))}
            </div>
          </div>
        </AnimatedSection>

        {/* CTA */}
        <AnimatedSection delay={0.3}>
          <div className="glass-card p-6 text-center">
            <h3 className="text-lg font-semibold text-text-primary mb-2">Keep Going!</h3>
            <p className="text-sm text-text-muted mb-4">Complete more daily actions to continue improving your footprint.</p>
            <Link href="/coach">
              <Button variant="primary">
                Daily Actions
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
