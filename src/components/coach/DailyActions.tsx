// ============================================================================
// Carbon Compass — Daily Actions Component
// ============================================================================

'use client';

import { motion } from 'framer-motion';
import {
  Train, GlassWater, Lightbulb, CookingPot, Thermometer,
  Salad, ShoppingBag, Droplets, Users, Recycle, Check
} from 'lucide-react';
import { useCarbonContext } from '@/context/CarbonContext';
import { DAILY_ACTIONS, getTodayString } from '@/lib/actions';

const iconMap: Record<string, React.ElementType> = {
  Train, GlassWater, Lightbulb, CookingPot, Thermometer,
  Salad, ShoppingBag, Droplets, Users, Recycle,
};

export default function DailyActions() {
  const { state, toggleAction } = useCarbonContext();
  const today = getTodayString();
  const todayEntry = state.dailyActions.find(e => e.date === today);
  const completedIds = todayEntry?.completedActions ?? [];
  const totalSavings = todayEntry?.totalSavings ?? 0;

  return (
    <div>
      {/* Summary */}
      <div className="glass-card !p-4 mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-text-secondary">Today&apos;s Savings</p>
          <p className="text-2xl font-bold text-green-primary">{totalSavings.toFixed(1)} kg CO₂</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-text-secondary">Completed</p>
          <p className="text-2xl font-bold text-text-primary">
            {completedIds.length}<span className="text-text-muted text-lg">/{DAILY_ACTIONS.length}</span>
          </p>
        </div>
      </div>

      {/* Actions Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {DAILY_ACTIONS.map((action, i) => {
          const isCompleted = completedIds.includes(action.id);
          const Icon = iconMap[action.icon] ?? Lightbulb;

          return (
            <motion.button
              key={action.id}
              onClick={() => toggleAction(action.id, action.co2Savings)}
              className={`text-left p-4 rounded-2xl border transition-all duration-200 ${
                isCompleted
                  ? 'bg-green-primary/10 border-green-primary/30'
                  : 'bg-bg-card border-border hover:border-border-hover hover:bg-bg-card-hover'
              }`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-start gap-3">
                {/* Checkbox */}
                <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                  isCompleted
                    ? 'bg-green-primary border-green-primary'
                    : 'border-border'
                }`}>
                  {isCompleted && <Check className="w-3.5 h-3.5 text-bg-primary" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 shrink-0 ${isCompleted ? 'text-green-primary' : 'text-text-muted'}`} />
                    <h4 className={`text-sm font-medium truncate ${
                      isCompleted ? 'text-green-primary' : 'text-text-primary'
                    }`}>
                      {action.title}
                    </h4>
                  </div>
                  <p className="text-xs text-text-muted mt-0.5">{action.description}</p>
                </div>

                {/* CO2 Savings */}
                <span className={`text-xs font-semibold shrink-0 ${
                  isCompleted ? 'text-green-primary' : 'text-text-muted'
                }`}>
                  -{action.co2Savings} kg
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
