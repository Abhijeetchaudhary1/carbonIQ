// ============================================================================
// Carbon Compass — Category Breakdown (Dashboard Component)
// ============================================================================

'use client';

import { motion } from 'framer-motion';
import type { CategoryEmission } from '@/lib/types';

interface Props {
  categories: CategoryEmission[];
  total: number;
}

export default function CategoryBreakdown({ categories, total }: Props) {
  const sorted = [...categories].sort((a, b) => b.monthlyCO2 - a.monthlyCO2);

  return (
    <div className="space-y-4">
      {sorted.map((cat, i) => (
        <div key={cat.category} className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-secondary">{cat.label}</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-text-primary">
                {cat.monthlyCO2.toFixed(1)} kg
              </span>
              <span className="text-xs text-text-muted">
                ({cat.percentage}%)
              </span>
            </div>
          </div>
          <div className="h-2 bg-bg-card rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: cat.color }}
              initial={{ width: 0 }}
              animate={{ width: `${(cat.monthlyCO2 / total) * 100}%` }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: 'easeOut' }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
