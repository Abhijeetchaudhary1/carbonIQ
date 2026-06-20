// ============================================================================
// Carbon Compass — Constants & Emission Factors
// ============================================================================

import type { EmissionCategory } from './types';

// --- Emission Factors (kg CO2 per unit) ---

export const VEHICLE_EMISSION_FACTORS: Record<string, number> = {
  none: 0,
  electric: 0.02,        // kg CO2 per km (grid electricity)
  hybrid: 0.08,          // kg CO2 per km
  small_car: 0.12,       // kg CO2 per km
  sedan: 0.17,           // kg CO2 per km
  suv: 0.25,             // kg CO2 per km
  motorcycle: 0.09,      // kg CO2 per km
  public_transit: 0.04,  // kg CO2 per km
};

export const DIET_EMISSION_FACTORS: Record<string, number> = {
  vegan: 1.5,            // kg CO2 per day
  vegetarian: 2.0,       // kg CO2 per day
  pescatarian: 2.5,      // kg CO2 per day
  mixed: 3.5,            // kg CO2 per day
  heavy_meat: 5.5,       // kg CO2 per day
};

// Meals eaten out/delivered have higher footprint
export const MEAL_OUT_FACTOR = 0.8; // additional kg CO2 per meal out

export const ENERGY_FACTORS = {
  electricityPerDollar: 0.5,   // kg CO2 per dollar of electricity bill
  acPerHour: 1.2,              // kg CO2 per hour of AC usage per day (monthly)
  applianceUsage: {
    minimal: 15,               // kg CO2 per month
    moderate: 35,              // kg CO2 per month
    heavy: 60,                 // kg CO2 per month
  },
};

export const SHOPPING_FACTORS = {
  perPurchase: 4.5,            // kg CO2 per item
  perFashionItem: 12,          // kg CO2 per clothing item (fast fashion)
};

export const WASTE_FACTORS: Record<string, number> = {
  minimal: 20,
  below_average: 35,
  average: 50,
  above_average: 70,
  high: 100,
};

export const RECYCLING_REDUCTION: Record<string, number> = {
  always: 0.6,       // 60% reduction
  often: 0.4,        // 40% reduction
  sometimes: 0.2,    // 20% reduction
  rarely: 0.1,       // 10% reduction
  never: 0,          // 0% reduction
};

// --- Impact Rating Thresholds (monthly kg CO2) ---

export const IMPACT_THRESHOLDS = {
  low: 200,          // < 200 kg = low impact
  medium: 500,       // 200-500 kg = medium impact
  // > 500 kg = high impact
};

// --- Category Metadata ---

export const CATEGORY_CONFIG: Record<EmissionCategory, { label: string; color: string; icon: string }> = {
  transport: { label: 'Transportation', color: '#38BDF8', icon: 'Car' },
  food: { label: 'Food & Diet', color: '#34D399', icon: 'UtensilsCrossed' },
  energy: { label: 'Energy', color: '#FBBF24', icon: 'Zap' },
  shopping: { label: 'Shopping', color: '#A78BFA', icon: 'ShoppingBag' },
  waste: { label: 'Waste', color: '#FB923C', icon: 'Trash2' },
};

// --- Global Averages (for comparison) ---

export const GLOBAL_AVERAGES = {
  world: 4400 / 12,           // ~367 kg CO2/month (world average per capita)
  usa: 15000 / 12,            // ~1250 kg CO2/month
  eu: 6500 / 12,              // ~542 kg CO2/month
  india: 1900 / 12,           // ~158 kg CO2/month
};

// --- Navigation ---

export const NAV_ITEMS = [
  { label: 'Home', href: '/', icon: 'Home' },
  { label: 'Assessment', href: '/assessment', icon: 'ClipboardList' },
  { label: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
  { label: 'AI Coach', href: '/coach', icon: 'Brain' },
  { label: 'Progress', href: '/progress', icon: 'TrendingUp' },
] as const;

// --- Assessment Step Config ---

export const ASSESSMENT_STEPS = [
  { id: 'transport', label: 'Transportation', icon: 'Car', description: 'How you get around' },
  { id: 'food', label: 'Food & Diet', icon: 'UtensilsCrossed', description: 'What you eat' },
  { id: 'energy', label: 'Energy', icon: 'Zap', description: 'Home energy usage' },
  { id: 'shopping', label: 'Shopping', icon: 'ShoppingBag', description: 'Consumption habits' },
  { id: 'waste', label: 'Waste', icon: 'Trash2', description: 'Waste & recycling' },
] as const;
