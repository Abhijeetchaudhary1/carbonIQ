// ============================================================================
// Carbon Compass — Carbon Calculation Engine
// ============================================================================

import type {
  AssessmentData,
  CarbonResults,
  CategoryEmission,
  ImpactRating,
} from './types';

import {
  VEHICLE_EMISSION_FACTORS,
  DIET_EMISSION_FACTORS,
  MEAL_OUT_FACTOR,
  ENERGY_FACTORS,
  SHOPPING_FACTORS,
  WASTE_FACTORS,
  RECYCLING_REDUCTION,
  IMPACT_THRESHOLDS,
  CATEGORY_CONFIG,
} from './constants';

/**
 * Calculate monthly transportation emissions (kg CO2)
 */
export function calculateTransportEmissions(data: AssessmentData['transport']): number {
  const factor = VEHICLE_EMISSION_FACTORS[data.vehicleType] ?? 0;
  const weeklyKm = data.dailyDistance * data.weeklyFrequency;
  const monthlyKm = weeklyKm * 4.33; // average weeks per month
  return Math.round(factor * monthlyKm * 100) / 100;
}

/**
 * Calculate monthly food emissions (kg CO2)
 */
export function calculateFoodEmissions(data: AssessmentData['food']): number {
  const dailyBase = DIET_EMISSION_FACTORS[data.dietType] ?? 3.5;
  const monthlyBase = dailyBase * 30;
  const mealsOutExtra = data.mealsPerWeek * MEAL_OUT_FACTOR * 4.33;
  return Math.round((monthlyBase + mealsOutExtra) * 100) / 100;
}

/**
 * Calculate monthly energy emissions (kg CO2)
 */
export function calculateEnergyEmissions(data: AssessmentData['energy']): number {
  const electricityEmission = data.monthlyBill * ENERGY_FACTORS.electricityPerDollar;
  const acEmission = data.acUsage * ENERGY_FACTORS.acPerHour * 30;
  const applianceEmission = ENERGY_FACTORS.applianceUsage[data.applianceUsage] ?? 35;
  return Math.round((electricityEmission + acEmission + applianceEmission) * 100) / 100;
}

/**
 * Calculate monthly shopping emissions (kg CO2)
 */
export function calculateShoppingEmissions(data: AssessmentData['shopping']): number {
  const generalShopping = data.monthlyPurchases * SHOPPING_FACTORS.perPurchase;
  const fashionShopping = data.fashionPurchases * SHOPPING_FACTORS.perFashionItem;
  return Math.round((generalShopping + fashionShopping) * 100) / 100;
}

/**
 * Calculate monthly waste emissions (kg CO2)
 */
export function calculateWasteEmissions(data: AssessmentData['waste']): number {
  const baseWaste = WASTE_FACTORS[data.wasteGeneration] ?? 50;
  const recyclingFactor = RECYCLING_REDUCTION[data.recyclingHabits] ?? 0;
  const netWaste = baseWaste * (1 - recyclingFactor);
  return Math.round(netWaste * 100) / 100;
}

/**
 * Determine impact rating based on total monthly CO2
 */
export function getImpactRating(totalMonthlyCO2: number): ImpactRating {
  if (totalMonthlyCO2 < IMPACT_THRESHOLDS.low) return 'low';
  if (totalMonthlyCO2 < IMPACT_THRESHOLDS.medium) return 'medium';
  return 'high';
}

/**
 * Main calculation function — produces full carbon results
 */
export function calculateCarbonFootprint(assessment: AssessmentData): CarbonResults {
  const transportCO2 = calculateTransportEmissions(assessment.transport);
  const foodCO2 = calculateFoodEmissions(assessment.food);
  const energyCO2 = calculateEnergyEmissions(assessment.energy);
  const shoppingCO2 = calculateShoppingEmissions(assessment.shopping);
  const wasteCO2 = calculateWasteEmissions(assessment.waste);

  const totalMonthlyCO2 = transportCO2 + foodCO2 + energyCO2 + shoppingCO2 + wasteCO2;
  const dailyCO2 = Math.round((totalMonthlyCO2 / 30) * 100) / 100;

  const rawCategories: { category: CategoryEmission['category']; monthlyCO2: number }[] = [
    { category: 'transport', monthlyCO2: transportCO2 },
    { category: 'food', monthlyCO2: foodCO2 },
    { category: 'energy', monthlyCO2: energyCO2 },
    { category: 'shopping', monthlyCO2: shoppingCO2 },
    { category: 'waste', monthlyCO2: wasteCO2 },
  ];

  const categories: CategoryEmission[] = rawCategories.map((cat) => ({
    ...cat,
    percentage: totalMonthlyCO2 > 0
      ? Math.round((cat.monthlyCO2 / totalMonthlyCO2) * 1000) / 10
      : 0,
    label: CATEGORY_CONFIG[cat.category].label,
    color: CATEGORY_CONFIG[cat.category].color,
  }));

  return {
    totalMonthlyCO2: Math.round(totalMonthlyCO2 * 100) / 100,
    dailyCO2,
    rating: getImpactRating(totalMonthlyCO2),
    categories,
    calculatedAt: new Date().toISOString(),
  };
}
