// ============================================================================
// Carbon Compass — Daily Actions Definitions
// ============================================================================

import type { DailyAction } from './types';

export const DAILY_ACTIONS: DailyAction[] = [
  {
    id: 'public-transport',
    title: 'Use Public Transport',
    description: 'Take the bus, train, or metro instead of driving',
    co2Savings: 2.5,
    category: 'transport',
    icon: 'Train',
  },
  {
    id: 'reusable-bottle',
    title: 'Carry Reusable Bottle',
    description: 'Skip single-use plastic bottles today',
    co2Savings: 0.3,
    category: 'waste',
    icon: 'GlassWater',
  },
  {
    id: 'lights-off',
    title: 'Switch Off Unused Lights',
    description: 'Turn off lights and appliances when not in use',
    co2Savings: 0.8,
    category: 'energy',
    icon: 'Lightbulb',
  },
  {
    id: 'no-delivery',
    title: 'Avoid Food Delivery',
    description: 'Cook at home or eat at a local restaurant instead',
    co2Savings: 1.2,
    category: 'food',
    icon: 'CookingPot',
  },
  {
    id: 'reduce-ac',
    title: 'Reduce AC Usage',
    description: 'Set temperature 2°C higher or use a fan instead',
    co2Savings: 1.5,
    category: 'energy',
    icon: 'Thermometer',
  },
  {
    id: 'plant-based-meal',
    title: 'Eat a Plant-Based Meal',
    description: 'Choose a vegetarian or vegan option for one meal',
    co2Savings: 1.8,
    category: 'food',
    icon: 'Salad',
  },
  {
    id: 'reusable-bag',
    title: 'Use Reusable Shopping Bag',
    description: 'Bring your own bag when shopping',
    co2Savings: 0.2,
    category: 'waste',
    icon: 'ShoppingBag',
  },
  {
    id: 'short-shower',
    title: 'Take a Shorter Shower',
    description: 'Reduce shower time by 2 minutes',
    co2Savings: 0.5,
    category: 'energy',
    icon: 'Droplets',
  },
  {
    id: 'carpool',
    title: 'Carpool to Work',
    description: 'Share a ride with a colleague or neighbor',
    co2Savings: 2.0,
    category: 'transport',
    icon: 'Users',
  },
  {
    id: 'recycle',
    title: 'Recycle Properly',
    description: 'Sort waste into correct recycling categories',
    co2Savings: 0.6,
    category: 'waste',
    icon: 'Recycle',
  },
];

/**
 * Get today's date as YYYY-MM-DD string
 */
export function getTodayString(): string {
  return new Date().toISOString().split('T')[0];
}

/**
 * Calculate total CO2 savings from completed actions
 */
export function calculateActionSavings(completedIds: string[]): number {
  return DAILY_ACTIONS
    .filter(a => completedIds.includes(a.id))
    .reduce((sum, a) => sum + a.co2Savings, 0);
}
