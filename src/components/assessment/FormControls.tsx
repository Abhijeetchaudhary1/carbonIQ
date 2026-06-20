// ============================================================================
// Carbon Compass — Form Controls (Shared Assessment Components)
// ============================================================================

'use client';

import React from 'react';

// --- Slider ---
interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (value: number) => void;
}

export function Slider({ label, value, min, max, step = 1, unit = '', onChange }: SliderProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm text-text-secondary">{label}</label>
        <span className="text-sm font-semibold text-green-primary">
          {value}{unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
      />
      <div className="flex justify-between text-xs text-text-muted">
        <span>{min}{unit}</span>
        <span>{max}{unit}</span>
      </div>
    </div>
  );
}

// --- Select ---
interface SelectOption {
  value: string;
  label: string;
  description?: string;
}

interface SelectProps {
  label: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
}

export function Select({ label, value, options, onChange }: SelectProps) {
  return (
    <div className="space-y-3">
      <label className="text-sm text-text-secondary">{label}</label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`p-3 rounded-xl text-left transition-all duration-200 border ${
              value === opt.value
                ? 'bg-green-primary/10 border-green-primary/30 text-text-primary'
                : 'bg-bg-card border-border text-text-secondary hover:border-border-hover hover:bg-bg-card-hover'
            }`}
          >
            <div className="text-sm font-medium">{opt.label}</div>
            {opt.description && (
              <div className="text-xs text-text-muted mt-0.5">{opt.description}</div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

// --- Number Input ---
interface NumberInputProps {
  label: string;
  value: number;
  min?: number;
  max?: number;
  unit?: string;
  placeholder?: string;
  onChange: (value: number) => void;
}

export function NumberInput({ label, value, min = 0, max = 10000, unit, placeholder, onChange }: NumberInputProps) {
  return (
    <div className="space-y-3">
      <label className="text-sm text-text-secondary">{label}</label>
      <div className="relative">
        <input
          type="number"
          min={min}
          max={max}
          value={value || ''}
          placeholder={placeholder}
          onChange={(e) => {
            const val = Number(e.target.value);
            if (val >= min && val <= max) {
              onChange(val);
            }
          }}
          className="w-full px-4 py-3 rounded-xl bg-bg-card border border-border text-text-primary placeholder-text-muted focus:outline-none focus:border-green-primary/50 focus:ring-1 focus:ring-green-primary/20 transition-all"
        />
        {unit && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-text-muted">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}
