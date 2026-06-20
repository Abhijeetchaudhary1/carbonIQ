// ============================================================================
// Carbon Compass — Insight Generation Engine
// ============================================================================

import type { CarbonResults, Insight } from './types';
import { CATEGORY_CONFIG } from './constants';

/**
 * Generate insights from carbon calculation results
 */
export function generateInsights(results: CarbonResults): Insight[] {
  const insights: Insight[] = [];
  const sorted = [...results.categories].sort((a, b) => b.monthlyCO2 - a.monthlyCO2);
  const largest = sorted[0];
  const secondLargest = sorted[1];

  // Largest category insight
  if (largest && largest.monthlyCO2 > 0) {
    insights.push({
      id: 'largest-category',
      type: 'warning',
      title: `${largest.label} is your biggest impact area`,
      description: `${largest.label} contributes ${largest.percentage}% of your total footprint at ${largest.monthlyCO2.toFixed(1)} kg CO₂/month.`,
      category: largest.category,
    });
  }

  // Second largest category insight
  if (secondLargest && secondLargest.monthlyCO2 > 0) {
    insights.push({
      id: 'second-category',
      type: 'info',
      title: `${secondLargest.label} is your second largest source`,
      description: `${secondLargest.label} contributes ${secondLargest.percentage}% of your emissions at ${secondLargest.monthlyCO2.toFixed(1)} kg CO₂/month.`,
      category: secondLargest.category,
    });
  }

  // Category-specific improvement insights
  const transportCat = results.categories.find(c => c.category === 'transport');
  if (transportCat && transportCat.monthlyCO2 > 50) {
    insights.push({
      id: 'transport-tip',
      type: 'tip',
      title: 'Switching to public transit could help',
      description: `Replacing car trips with public transit 2 days/week could reduce your transport emissions by ~${Math.round(transportCat.monthlyCO2 * 0.25)} kg CO₂/month.`,
      category: 'transport',
      potentialSavings: Math.round(transportCat.monthlyCO2 * 0.25),
    });
  }

  const energyCat = results.categories.find(c => c.category === 'energy');
  if (energyCat && energyCat.monthlyCO2 > 80) {
    insights.push({
      id: 'energy-ac-tip',
      type: 'tip',
      title: 'Reducing AC usage saves significantly',
      description: `Reducing AC usage by 1 hour daily could lower emissions by approximately ${Math.round(1.2 * 30)} kg CO₂/month.`,
      category: 'energy',
      potentialSavings: Math.round(1.2 * 30),
    });
  }

  const foodCat = results.categories.find(c => c.category === 'food');
  if (foodCat && foodCat.monthlyCO2 > 100) {
    insights.push({
      id: 'food-tip',
      type: 'tip',
      title: 'Consider more plant-based meals',
      description: `Adding 2 more vegetarian meals per week could reduce your food footprint by ~${Math.round(foodCat.monthlyCO2 * 0.15)} kg CO₂/month.`,
      category: 'food',
      potentialSavings: Math.round(foodCat.monthlyCO2 * 0.15),
    });
  }

  const shoppingCat = results.categories.find(c => c.category === 'shopping');
  if (shoppingCat && shoppingCat.monthlyCO2 > 40) {
    insights.push({
      id: 'shopping-tip',
      type: 'tip',
      title: 'Mindful shopping reduces impact',
      description: `Reducing fashion purchases by 1 item/month could save ~${CATEGORY_CONFIG.shopping.label === 'Shopping' ? 12 : 10} kg CO₂/month.`,
      category: 'shopping',
      potentialSavings: 12,
    });
  }

  // Rating-based overall insight
  if (results.rating === 'low') {
    insights.push({
      id: 'rating-low',
      type: 'success',
      title: 'Great job! Your footprint is below average',
      description: `At ${results.totalMonthlyCO2.toFixed(0)} kg CO₂/month, you're doing better than most. Keep up the good work!`,
    });
  } else if (results.rating === 'high') {
    insights.push({
      id: 'rating-high',
      type: 'warning',
      title: 'Your footprint has room for improvement',
      description: `At ${results.totalMonthlyCO2.toFixed(0)} kg CO₂/month, there are several areas where you can make a meaningful difference.`,
    });
  }

  return insights;
}
