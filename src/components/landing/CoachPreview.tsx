// ============================================================================
// Carbon Compass — Coach Preview Section
// ============================================================================

'use client';

import { Brain, Sparkles, Target, TrendingDown } from 'lucide-react';
import AnimatedSection from '@/components/ui/AnimatedSection';
import GlassCard from '@/components/ui/GlassCard';

const previewCards = [
  {
    icon: Target,
    title: 'Top Priority',
    text: 'Reduce AC usage by 1 hour daily — save ~36 kg CO₂/month',
    color: '#34D399',
  },
  {
    icon: Sparkles,
    title: 'Quick Win',
    text: 'Switch to plant-based meals twice a week',
    color: '#38BDF8',
  },
  {
    icon: TrendingDown,
    title: 'Monthly Potential',
    text: 'Your personalized plan could reduce emissions by 28%',
    color: '#FBBF24',
  },
];

export default function CoachPreview() {
  return (
    <section className="py-24 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="container-page">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left — Description */}
          <AnimatedSection>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-primary/20 to-ocean/20 flex items-center justify-center">
                <Brain className="w-5 h-5 text-green-primary" />
              </div>
              <span className="text-sm font-medium text-green-primary">AI-Powered Coaching</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
              Your Personal{' '}
              <span className="text-gradient">Sustainability Coach</span>
            </h2>
            <p className="text-text-secondary leading-relaxed mb-6">
              Get personalized analysis of your carbon footprint, actionable recommendations 
              ranked by impact, and a weekly action plan tailored to your lifestyle.
            </p>
            <ul className="space-y-3">
              {['Personalized emission analysis', 'Ranked recommendations by impact', 'Weekly & monthly action plans', 'Estimated CO₂ savings per action'].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-text-secondary">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-primary shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </AnimatedSection>

          {/* Right — Preview Cards */}
          <div className="space-y-4">
            {previewCards.map((card, i) => (
              <AnimatedSection key={card.title} delay={i * 0.12} direction="right">
                <GlassCard className="!p-4">
                  <div className="flex items-start gap-4">
                    <div
                      className="w-9 h-9 rounded-lg shrink-0 flex items-center justify-center"
                      style={{ backgroundColor: `${card.color}15` }}
                    >
                      <card.icon className="w-4 h-4" style={{ color: card.color }} />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-text-primary mb-0.5">{card.title}</h4>
                      <p className="text-sm text-text-muted">{card.text}</p>
                    </div>
                  </div>
                </GlassCard>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
