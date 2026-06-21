// ============================================================================
// Carbon Compass — Form Controls (Shared Assessment Components)
// ============================================================================

'use client';

import React, { useId } from 'react';

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
  const id = useId();
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-sm text-text-secondary">{label}</label>
        <span className="text-sm font-semibold text-green-primary" aria-live="polite">
          {value}{unit}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-valuetext={`${value}${unit}`}
      />
      <div className="flex justify-between text-xs text-text-muted" aria-hidden="true">
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
  const groupId = useId();
  return (
    <fieldset className="space-y-3">
      <legend className="text-sm text-text-secondary">{label}</legend>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2" role="radiogroup" aria-labelledby={groupId}>
        <span id={groupId} className="sr-only">{label}</span>
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={value === opt.value}
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
    </fieldset>
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
  const id = useId();
  return (
    <div className="space-y-3">
      <label htmlFor={id} className="text-sm text-text-secondary">{label}</label>
      <div className="relative">
        <input
          id={id}
          type="number"
          min={min}
          max={max}
          value={value || ''}
          placeholder={placeholder}
          aria-label={`${label}${unit ? ` in ${unit}` : ''}`}
          onChange={(e) => {
            const val = Number(e.target.value);
            if (val >= min && val <= max) {
              onChange(val);
            }
          }}
          className="w-full px-4 py-3 rounded-xl bg-bg-card border border-border text-text-primary placeholder-text-muted focus:outline-none focus:border-green-primary/50 focus:ring-1 focus:ring-green-primary/20 transition-all"
        />
        {unit && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-text-muted" aria-hidden="true">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}
