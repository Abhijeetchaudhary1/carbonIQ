// ============================================================================
// Carbon Compass — Trend Chart (Dashboard Component)
// ============================================================================

'use client';

import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import type { HistoryEntry } from '@/lib/types';

interface Props {
  history: HistoryEntry[];
}

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

export default function TrendChart({ history }: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const data = history.slice(-14).map((entry) => ({
    date: new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    'Net CO₂': entry.netCO2,
    'Base CO₂': entry.totalCO2,
    Savings: entry.actionsSavings,
  }));

  if (!mounted) return <div className="w-full h-[280px]" />;

  return (
    <div className="w-full h-[280px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
          <defs>
            <linearGradient id="gradientNet" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#34D399" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#34D399" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradientBase" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38BDF8" stopOpacity={0.15} />
              <stop offset="100%" stopColor="#38BDF8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" />
          <XAxis dataKey="date" tick={{ fill: '#737373', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#737373', fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="Base CO₂"
            stroke="#38BDF8"
            strokeWidth={1.5}
            fill="url(#gradientBase)"
            dot={false}
          />
          <Area
            type="monotone"
            dataKey="Net CO₂"
            stroke="#34D399"
            strokeWidth={2}
            fill="url(#gradientNet)"
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
