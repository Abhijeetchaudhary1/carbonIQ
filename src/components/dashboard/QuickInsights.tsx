// ============================================================================
// Carbon Compass — Quick Insights (Dashboard Component)
// ============================================================================

'use client';

import { motion } from 'framer-motion';
import { Info, AlertTriangle, CheckCircle, Lightbulb } from 'lucide-react';
import type { Insight } from '@/lib/types';

interface Props {
  insights: Insight[];
}

const iconMap = {
  info: Info,
  warning: AlertTriangle,
  success: CheckCircle,
  tip: Lightbulb,
};

const colorMap = {
  info: { text: 'text-ocean', bg: 'bg-ocean/10', border: 'border-ocean/20' },
  warning: { text: 'text-amber', bg: 'bg-amber/10', border: 'border-amber/20' },
  success: { text: 'text-green-primary', bg: 'bg-green-primary/10', border: 'border-green-primary/20' },
  tip: { text: 'text-violet', bg: 'bg-violet/10', border: 'border-violet/20' },
};

export default function QuickInsights({ insights }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {insights.map((insight, i) => {
        const Icon = iconMap[insight.type];
        const colors = colorMap[insight.type];
        return (
          <motion.div
            key={insight.id}
            className={`glass-card !p-4 border ${colors.border}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <div className="flex items-start gap-3">
              <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center ${colors.bg}`}>
                <Icon className={`w-4 h-4 ${colors.text}`} />
              </div>
              <div className="min-w-0">
                <h4 className="text-sm font-semibold text-text-primary mb-1 truncate">{insight.title}</h4>
                <p className="text-xs text-text-muted leading-relaxed">{insight.description}</p>
                {insight.potentialSavings && (
                  <p className="text-xs text-green-primary mt-1 font-medium">
                    Potential: -{insight.potentialSavings} kg CO₂/month
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
