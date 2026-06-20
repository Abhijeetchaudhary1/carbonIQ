// ============================================================================
// Carbon Compass — Recommendation Engine (AI Coach Logic)
// ============================================================================

import type { AssessmentData, CarbonResults, CoachData, Recommendation, WeeklyPlan } from './types';

/**
 * Generate personalized recommendations based on assessment and results
 */
export function generateRecommendations(
  assessment: AssessmentData,
  results: CarbonResults
): CoachData {
  const recs: Recommendation[] = [];
  const sorted = [...results.categories].sort((a, b) => b.monthlyCO2 - a.monthlyCO2);

  // --- Transport Recommendations ---
  const transportCO2 = results.categories.find(c => c.category === 'transport')?.monthlyCO2 ?? 0;
  
  if (assessment.transport.vehicleType === 'suv' || assessment.transport.vehicleType === 'sedan') {
    recs.push({
      id: 'rec-carpooling',
      priority: transportCO2 > 100 ? 1 : 3,
      title: 'Try carpooling or public transit',
      description: 'Share rides or switch to public transit for your regular commute.',
      whyItMatters: 'Private vehicles are one of the largest individual emission sources. Carpooling halves per-person emissions.',
      expectedImpact: `Could reduce transport emissions by 30-50%`,
      estimatedSavings: Math.round(transportCO2 * 0.35),
      category: 'transport',
      difficulty: 'moderate',
      timeframe: 'weekly',
    });
  }

  if (assessment.transport.dailyDistance > 20) {
    recs.push({
      id: 'rec-remote-work',
      priority: 2,
      title: 'Work remotely when possible',
      description: 'Even 1-2 days of remote work per week significantly reduces commute emissions.',
      whyItMatters: 'Your daily distance of ' + assessment.transport.dailyDistance + ' km contributes substantially to your footprint.',
      expectedImpact: `Save ${Math.round(transportCO2 * 0.2)} kg CO₂/month with 1 remote day/week`,
      estimatedSavings: Math.round(transportCO2 * 0.2),
      category: 'transport',
      difficulty: 'easy',
      timeframe: 'weekly',
    });
  }

  // --- Food Recommendations ---
  const foodCO2 = results.categories.find(c => c.category === 'food')?.monthlyCO2 ?? 0;

  if (assessment.food.dietType === 'heavy_meat' || assessment.food.dietType === 'mixed') {
    recs.push({
      id: 'rec-meatless-days',
      priority: foodCO2 > 100 ? 1 : 2,
      title: 'Introduce meatless days',
      description: 'Start with Meatless Mondays and gradually add more plant-based meals.',
      whyItMatters: 'Meat production generates 5-10x more emissions than plant-based foods. Even small shifts make a big difference.',
      expectedImpact: `${Math.round(foodCO2 * 0.2)} kg CO₂/month saved with 2 meatless days/week`,
      estimatedSavings: Math.round(foodCO2 * 0.2),
      category: 'food',
      difficulty: 'easy',
      timeframe: 'weekly',
    });
  }

  if (assessment.food.mealsPerWeek > 5) {
    recs.push({
      id: 'rec-cook-home',
      priority: 3,
      title: 'Cook at home more often',
      description: 'Home-cooked meals have a significantly lower carbon footprint than restaurant or delivery meals.',
      whyItMatters: 'Restaurant meals involve more food waste, packaging, and transportation.',
      expectedImpact: `Save ${Math.round(assessment.food.mealsPerWeek * 0.8 * 4.33 * 0.3)} kg CO₂/month`,
      estimatedSavings: Math.round(assessment.food.mealsPerWeek * 0.8 * 4.33 * 0.3),
      category: 'food',
      difficulty: 'moderate',
      timeframe: 'weekly',
    });
  }

  // --- Energy Recommendations ---
  const energyCO2 = results.categories.find(c => c.category === 'energy')?.monthlyCO2 ?? 0;

  if (assessment.energy.acUsage > 2) {
    recs.push({
      id: 'rec-reduce-ac',
      priority: energyCO2 > 100 ? 1 : 2,
      title: 'Optimize AC usage',
      description: 'Set temperature 2°C higher, use fans for circulation, and turn off AC when away.',
      whyItMatters: `You use AC ${assessment.energy.acUsage} hours/day. Air conditioning is one of the most energy-intensive appliances.`,
      expectedImpact: `Save ${Math.round(1.2 * 30)} kg CO₂/month by reducing 1 hour/day`,
      estimatedSavings: Math.round(1.2 * 30),
      category: 'energy',
      difficulty: 'easy',
      timeframe: 'immediate',
    });
  }

  if (assessment.energy.monthlyBill > 100) {
    recs.push({
      id: 'rec-energy-audit',
      priority: 3,
      title: 'Conduct a home energy audit',
      description: 'Identify energy leaks: old bulbs, phantom loads, poor insulation.',
      whyItMatters: 'Your monthly bill suggests above-average energy consumption. Simple fixes can cut 10-20%.',
      expectedImpact: `Potential savings of ${Math.round(energyCO2 * 0.15)} kg CO₂/month`,
      estimatedSavings: Math.round(energyCO2 * 0.15),
      category: 'energy',
      difficulty: 'moderate',
      timeframe: 'monthly',
    });
  }

  recs.push({
    id: 'rec-switch-off',
    priority: 4,
    title: 'Switch off unused lights and appliances',
    description: 'Make it a habit to switch off lights, unplug chargers, and turn off standby appliances.',
    whyItMatters: 'Phantom loads from standby appliances can account for 5-10% of household electricity use.',
    expectedImpact: `Save ${Math.round(energyCO2 * 0.08)} kg CO₂/month`,
    estimatedSavings: Math.round(energyCO2 * 0.08),
    category: 'energy',
    difficulty: 'easy',
    timeframe: 'immediate',
  });

  // --- Shopping Recommendations ---
  const shoppingCO2 = results.categories.find(c => c.category === 'shopping')?.monthlyCO2 ?? 0;

  if (assessment.shopping.fashionPurchases > 2) {
    recs.push({
      id: 'rec-slow-fashion',
      priority: shoppingCO2 > 60 ? 2 : 4,
      title: 'Embrace slow fashion',
      description: 'Buy fewer, higher-quality items. Consider second-hand or sustainable brands.',
      whyItMatters: 'Fast fashion is one of the most polluting industries. Each item produces ~12 kg CO₂.',
      expectedImpact: `Save ${Math.round(12 * Math.max(1, assessment.shopping.fashionPurchases - 1))} kg CO₂/month`,
      estimatedSavings: Math.round(12 * Math.max(1, assessment.shopping.fashionPurchases - 1)),
      category: 'shopping',
      difficulty: 'moderate',
      timeframe: 'monthly',
    });
  }

  // --- Waste Recommendations ---
  const wasteCO2 = results.categories.find(c => c.category === 'waste')?.monthlyCO2 ?? 0;

  if (assessment.waste.recyclingHabits === 'rarely' || assessment.waste.recyclingHabits === 'never') {
    recs.push({
      id: 'rec-start-recycling',
      priority: 2,
      title: 'Start a recycling routine',
      description: 'Set up separate bins for paper, plastic, glass, and organic waste.',
      whyItMatters: 'Recycling can reduce waste emissions by 40-60%. Starting is the hardest part.',
      expectedImpact: `Could save ${Math.round(wasteCO2 * 0.4)} kg CO₂/month`,
      estimatedSavings: Math.round(wasteCO2 * 0.4),
      category: 'waste',
      difficulty: 'easy',
      timeframe: 'immediate',
    });
  }

  recs.push({
    id: 'rec-reduce-plastic',
    priority: 5,
    title: 'Reduce single-use plastics',
    description: 'Use reusable bags, bottles, and containers. Avoid excessive packaging.',
    whyItMatters: 'Plastic production and disposal creates significant emissions and environmental pollution.',
    expectedImpact: `Save ${Math.round(wasteCO2 * 0.1)} kg CO₂/month`,
    estimatedSavings: Math.round(wasteCO2 * 0.1),
    category: 'waste',
    difficulty: 'easy',
    timeframe: 'immediate',
  });

  // Sort by priority
  recs.sort((a, b) => a.priority - b.priority);

  // Generate analysis text
  const analysis = generateAnalysis(results, sorted);

  // Generate weekly plan
  const weeklyPlan = generateWeeklyPlan(recs);

  // Generate monthly goals
  const monthlyGoals = generateMonthlyGoals(assessment, results);

  const totalPotentialSavings = recs.reduce((sum, r) => sum + r.estimatedSavings, 0);

  return {
    analysis,
    topPriority: recs[0],
    recommendations: recs,
    weeklyPlan,
    monthlyGoals,
    totalPotentialSavings,
  };
}

function generateAnalysis(results: CarbonResults, sorted: typeof results.categories): string {
  const total = results.totalMonthlyCO2;
  const ratingText = results.rating === 'low' ? 'below average' : results.rating === 'medium' ? 'moderate' : 'above average';
  
  return `Your monthly carbon footprint is ${total.toFixed(0)} kg CO₂, which is ${ratingText}. ` +
    `Your largest emission source is ${sorted[0]?.label ?? 'unknown'} at ${sorted[0]?.percentage ?? 0}%, ` +
    `followed by ${sorted[1]?.label ?? 'unknown'} at ${sorted[1]?.percentage ?? 0}%. ` +
    `By focusing on your top categories, you can make the most impactful changes.`;
}

function generateWeeklyPlan(recs: Recommendation[]): WeeklyPlan[] {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const easyActions = recs.filter(r => r.difficulty === 'easy');
  const moderateActions = recs.filter(r => r.difficulty === 'moderate');
  const allActions = [...easyActions, ...moderateActions];

  return days.map((day, i) => ({
    day,
    actions: [
      allActions[i % allActions.length]?.title ?? 'Practice mindful consumption',
      i % 2 === 0 ? 'Track energy usage' : 'Use reusable items',
    ],
  }));
}

function generateMonthlyGoals(assessment: AssessmentData, results: CarbonResults): string[] {
  const goals: string[] = [];
  
  goals.push(`Reduce total footprint by 10% (target: ${Math.round(results.totalMonthlyCO2 * 0.9)} kg CO₂/month)`);
  
  if (assessment.transport.vehicleType !== 'none' && assessment.transport.vehicleType !== 'public_transit') {
    goals.push('Use public transit or carpool at least 4 times this month');
  }
  
  if (assessment.food.dietType === 'heavy_meat' || assessment.food.dietType === 'mixed') {
    goals.push('Have at least 8 plant-based meals this month');
  }
  
  if (assessment.energy.acUsage > 2) {
    goals.push(`Reduce AC usage to ${Math.max(1, assessment.energy.acUsage - 1)} hours/day`);
  }
  
  goals.push('Complete daily sustainability actions at least 20 days this month');
  
  return goals;
}
