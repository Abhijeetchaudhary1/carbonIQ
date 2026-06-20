// ============================================================================
// Carbon Compass — How It Works Section
// ============================================================================

'use client';

import { motion } from 'framer-motion';
import { ClipboardList, BarChart3, Lightbulb, TrendingDown } from 'lucide-react';
import AnimatedSection from '@/components/ui/AnimatedSection';

const steps = [
  {
    icon: ClipboardList,
    title: 'Assess',
    description: 'Complete a quick assessment of your daily habits across 5 impact categories.',
    color: '#38BDF8',
  },
  {
    icon: BarChart3,
    title: 'Analyze',
    description: 'Get a detailed breakdown of your carbon footprint with data-driven insights.',
    color: '#34D399',
  },
  {
    icon: Lightbulb,
    title: 'Act',
    description: 'Receive personalized recommendations and daily actions to reduce impact.',
    color: '#FBBF24',
  },
  {
    icon: TrendingDown,
    title: 'Improve',
    description: 'Track your progress over time and watch your footprint shrink.',
    color: '#A78BFA',
  },
];

export default function HowItWorks() {
  return (
    <section className="py-24 relative">
      <div className="container-page">
        <AnimatedSection className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
            How It Works
          </h2>
          <p className="text-text-secondary max-w-lg mx-auto">
            Four simple steps to understand and reduce your environmental impact.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {/* Connecting line (desktop) */}
          <div className="hidden lg:block absolute top-12 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-border to-transparent" />

          {steps.map((step, i) => (
            <AnimatedSection key={step.title} delay={i * 0.1}>
              <motion.div
                className="glass-card p-6 text-center relative group"
                whileHover={{ y: -4 }}
              >
                {/* Step Number */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-bg-primary border border-border flex items-center justify-center">
                  <span className="text-xs text-text-muted font-mono">{i + 1}</span>
                </div>

                <div
                  className="w-12 h-12 rounded-xl mx-auto mb-4 flex items-center justify-center transition-transform group-hover:scale-110"
                  style={{ backgroundColor: `${step.color}15` }}
                >
                  <step.icon className="w-6 h-6" style={{ color: step.color }} />
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">{step.title}</h3>
                <p className="text-sm text-text-muted leading-relaxed">{step.description}</p>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
