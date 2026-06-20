// ============================================================================
// Carbon Compass — Hero Section
// ============================================================================

'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import EarthVisualization from './EarthVisualization';
import { useCarbonContext } from '@/context/CarbonContext';
import { useRouter } from 'next/navigation';

export default function HeroSection() {
  const { loadDemo } = useCarbonContext();
  const router = useRouter();

  const handleDemo = () => {
    loadDemo();
    router.push('/dashboard');
  };

  return (
    <section className="relative min-h-[100vh] flex items-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-green-primary/5 via-transparent to-transparent" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-primary/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-ocean/5 rounded-full blur-[120px]" />

      <div className="container-page relative z-10 pt-24 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Left — Text Content */}
          <div className="space-y-8 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs text-green-primary font-medium mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-green-primary animate-pulse" />
                Sustainability Intelligence Platform
              </span>
            </motion.div>

            <motion.h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight text-text-primary"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Track Your Carbon{' '}
              <span className="text-gradient">Footprint.</span>
              <br />
              Improve It{' '}
              <span className="text-gradient">Every Day.</span>
            </motion.h1>

            <motion.p
              className="text-lg text-text-secondary max-w-xl mx-auto lg:mx-0 leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Measure your environmental impact, discover what&apos;s driving emissions, 
              and receive personalized actions to reduce your footprint.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Link href="/assessment">
                <Button variant="primary" size="lg">
                  Calculate My Impact
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Button variant="secondary" size="lg" onClick={handleDemo}>
                <Play className="w-4 h-4" />
                View Demo
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              className="flex items-center gap-8 justify-center lg:justify-start pt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              {[
                { value: '5', label: 'Categories Tracked' },
                { value: '10+', label: 'Daily Actions' },
                { value: '24/7', label: 'AI Coaching' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl font-bold text-text-primary">{stat.value}</div>
                  <div className="text-xs text-text-muted">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — Earth */}
          <motion.div
            className="flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <EarthVisualization />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
