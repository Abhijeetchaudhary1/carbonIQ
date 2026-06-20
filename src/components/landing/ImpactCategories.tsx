// ============================================================================
// Carbon Compass — Impact Categories Section
// ============================================================================

'use client';

import { motion } from 'framer-motion';
import { Car, UtensilsCrossed, Zap, ShoppingBag, Trash2 } from 'lucide-react';
import AnimatedSection from '@/components/ui/AnimatedSection';

const categories = [
  {
    icon: Car,
    title: 'Transportation',
    description: 'Track emissions from daily commutes, travel, and vehicle usage.',
    color: '#38BDF8',
    stat: '29%',
    statLabel: 'of global emissions',
  },
  {
    icon: UtensilsCrossed,
    title: 'Food & Diet',
    description: 'Understand the carbon cost of your dietary choices and meal habits.',
    color: '#34D399',
    stat: '26%',
    statLabel: 'of global emissions',
  },
  {
    icon: Zap,
    title: 'Energy',
    description: 'Monitor electricity, heating, cooling, and appliance energy consumption.',
    color: '#FBBF24',
    stat: '25%',
    statLabel: 'of global emissions',
  },
  {
    icon: ShoppingBag,
    title: 'Shopping',
    description: 'Measure the impact of consumer goods and fashion purchases.',
    color: '#A78BFA',
    stat: '12%',
    statLabel: 'of global emissions',
  },
  {
    icon: Trash2,
    title: 'Waste',
    description: 'Evaluate waste generation and recycling habits impact.',
    color: '#FB923C',
    stat: '8%',
    statLabel: 'of global emissions',
  },
];

export default function ImpactCategories() {
  return (
    <section className="py-24 relative">
      {/* Background accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="container-page">
        <AnimatedSection className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
            5 Impact Categories
          </h2>
          <p className="text-text-secondary max-w-lg mx-auto">
            Comprehensive tracking across every major source of personal carbon emissions.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat, i) => (
            <AnimatedSection key={cat.title} delay={i * 0.08}>
              <motion.div
                className={`glass-card p-6 group ${i === 4 ? 'sm:col-span-2 lg:col-span-1' : ''}`}
                whileHover={{ y: -4 }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110"
                    style={{ backgroundColor: `${cat.color}15` }}
                  >
                    <cat.icon className="w-5 h-5" style={{ color: cat.color }} />
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold" style={{ color: cat.color }}>{cat.stat}</span>
                    <p className="text-[10px] text-text-muted">{cat.statLabel}</p>
                  </div>
                </div>
                <h3 className="text-base font-semibold text-text-primary mb-1">{cat.title}</h3>
                <p className="text-sm text-text-muted leading-relaxed">{cat.description}</p>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
