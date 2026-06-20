// ============================================================================
// Carbon Compass — Progress Preview Section
// ============================================================================

'use client';

import { ArrowRight, TrendingDown } from 'lucide-react';
import Link from 'next/link';
import AnimatedSection from '@/components/ui/AnimatedSection';
import Button from '@/components/ui/Button';

export default function ProgressPreview() {
  // Mini chart data
  const data = [85, 82, 78, 80, 73, 70, 65, 68, 60, 55, 52, 48];

  const maxVal = Math.max(...data);
  const minVal = Math.min(...data);
  const range = maxVal - minVal || 1;

  return (
    <section className="py-24 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="container-page">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left — Chart Preview */}
          <AnimatedSection>
            <div className="glass-card p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h4 className="text-sm font-semibold text-text-primary">Emission Trend</h4>
                  <p className="text-xs text-text-muted">Last 12 weeks</p>
                </div>
                <div className="flex items-center gap-1 text-green-primary text-sm font-medium">
                  <TrendingDown className="w-4 h-4" />
                  -43%
                </div>
              </div>

              {/* Mini Chart (SVG) */}
              <div className="h-32 relative">
                <svg viewBox="0 0 200 80" className="w-full h-full" preserveAspectRatio="none">
                  {/* Gradient fill */}
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="rgba(52, 211, 153, 0.3)" />
                      <stop offset="100%" stopColor="rgba(52, 211, 153, 0)" />
                    </linearGradient>
                  </defs>
                  
                  {/* Area */}
                  <path
                    d={`M 0 ${80 - ((data[0] - minVal) / range) * 70} ${data.map((v, i) =>
                      `L ${(i / (data.length - 1)) * 200} ${80 - ((v - minVal) / range) * 70}`
                    ).join(' ')} L 200 80 L 0 80 Z`}
                    fill="url(#chartGradient)"
                  />
                  
                  {/* Line */}
                  <path
                    d={`M 0 ${80 - ((data[0] - minVal) / range) * 70} ${data.map((v, i) =>
                      `L ${(i / (data.length - 1)) * 200} ${80 - ((v - minVal) / range) * 70}`
                    ).join(' ')}`}
                    fill="none"
                    stroke="#34D399"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>

                {/* Y-axis labels */}
                <div className="absolute top-0 right-0 text-[10px] text-text-muted">{maxVal}kg</div>
                <div className="absolute bottom-0 right-0 text-[10px] text-text-muted">{minVal}kg</div>
              </div>
            </div>
          </AnimatedSection>

          {/* Right — Description */}
          <AnimatedSection delay={0.2}>
            <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
              Watch Your Impact{' '}
              <span className="text-gradient">Shrink</span>
            </h2>
            <p className="text-text-secondary leading-relaxed mb-6">
              Track your progress over days, weeks, and months. See exactly how your daily 
              actions translate to real emission reductions with beautiful visualizations.
            </p>
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                { value: 'Daily', label: 'Action tracking' },
                { value: 'Weekly', label: 'Trend analysis' },
                { value: 'Monthly', label: 'Goal progress' },
              ].map((item) => (
                <div key={item.value} className="glass-card !p-3 text-center">
                  <div className="text-sm font-semibold text-green-primary">{item.value}</div>
                  <div className="text-xs text-text-muted">{item.label}</div>
                </div>
              ))}
            </div>
            <Link href="/assessment">
              <Button variant="primary" size="md">
                Start Tracking
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
