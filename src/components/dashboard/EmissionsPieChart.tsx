// ============================================================================
// Carbon Compass — Emissions Pie Chart (Dashboard Component)
// ============================================================================

'use client';

import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import type { CategoryEmission } from '@/lib/types';

interface Props {
  categories: CategoryEmission[];
}

interface TooltipPayloadItem {
  name: string;
  value: number;
  payload: {
    label: string;
    monthlyCO2: number;
    percentage: number;
    color: string;
  };
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: TooltipPayloadItem[] }) {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload;
  return (
    <div className="glass-strong rounded-lg px-3 py-2 text-sm">
      <p className="text-text-primary font-medium">{data.label}</p>
      <p className="text-text-muted">
        {data.monthlyCO2.toFixed(1)} kg CO₂ ({data.percentage}%)
      </p>
    </div>
  );
}

export default function EmissionsPieChart({ categories }: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { 
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true); 
  }, []);

  return (
    <div className="flex flex-col items-center">
      <div className="w-full h-[250px]">
        {mounted && (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categories}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                dataKey="monthlyCO2"
                nameKey="label"
                paddingAngle={3}
                strokeWidth={0}
              >
                {categories.map((cat) => (
                  <Cell key={cat.category} fill={cat.color} opacity={0.85} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {categories.map((cat) => (
          <div key={cat.category} className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
            <span className="text-xs text-text-muted">{cat.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
