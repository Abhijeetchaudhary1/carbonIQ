// ============================================================================
// Carbon Compass — Type Definitions
// ============================================================================

// --- Assessment Data Types ---

export type VehicleType = 'none' | 'electric' | 'hybrid' | 'small_car' | 'sedan' | 'suv' | 'motorcycle' | 'public_transit';
export type DietType = 'vegan' | 'vegetarian' | 'pescatarian' | 'mixed' | 'heavy_meat';
export type ApplianceUsage = 'minimal' | 'moderate' | 'heavy';
export type RecyclingHabit = 'always' | 'often' | 'sometimes' | 'rarely' | 'never';
export type WasteGeneration = 'minimal' | 'below_average' | 'average' | 'above_average' | 'high';

export interface TransportData {
  vehicleType: VehicleType;
  dailyDistance: number;       // km
  weeklyFrequency: number;    // days per week
}

export interface FoodData {
  dietType: DietType;
  mealsPerWeek: number;        // number of meals eaten out or delivered
}

export interface EnergyData {
  monthlyBill: number;         // USD
  acUsage: number;             // hours per day
  applianceUsage: ApplianceUsage;
}

export interface ShoppingData {
  monthlyPurchases: number;    // number of items
  fashionPurchases: number;    // number of clothing items per month
}

export interface WasteData {
  recyclingHabits: RecyclingHabit;
  wasteGeneration: WasteGeneration;
}

export interface AssessmentData {
  transport: TransportData;
  food: FoodData;
  energy: EnergyData;
  shopping: ShoppingData;
  waste: WasteData;
  completedAt?: string;        // ISO date string
}

// --- Carbon Results Types ---

export type ImpactRating = 'low' | 'medium' | 'high';

export interface CategoryEmission {
  category: EmissionCategory;
  monthlyCO2: number;          // kg CO2
  percentage: number;          // % of total
  label: string;
  color: string;
}

export interface CarbonResults {
  totalMonthlyCO2: number;     // kg CO2
  dailyCO2: number;            // kg CO2
  rating: ImpactRating;
  categories: CategoryEmission[];
  calculatedAt: string;        // ISO date string
}

export type EmissionCategory = 'transport' | 'food' | 'energy' | 'shopping' | 'waste';

// --- Daily Actions Types ---

export interface DailyAction {
  id: string;
  title: string;
  description: string;
  co2Savings: number;          // kg CO2 saved
  category: EmissionCategory;
  icon: string;                // Lucide icon name
}

export interface DailyActionEntry {
  date: string;                // YYYY-MM-DD
  completedActions: string[];  // action IDs
  totalSavings: number;        // kg CO2
}

// --- History Types ---

export interface HistoryEntry {
  date: string;                // YYYY-MM-DD
  totalCO2: number;            // kg CO2 for that day
  actionsSavings: number;      // kg CO2 saved from actions
  netCO2: number;              // totalCO2 - actionsSavings
}

// --- Insights Types ---

export interface Insight {
  id: string;
  type: 'info' | 'warning' | 'success' | 'tip';
  title: string;
  description: string;
  category?: EmissionCategory;
  potentialSavings?: number;   // kg CO2/month
}

// --- Recommendation Types ---

export interface Recommendation {
  id: string;
  priority: number;            // 1 = highest
  title: string;
  description: string;
  whyItMatters: string;
  expectedImpact: string;
  estimatedSavings: number;    // kg CO2/month
  category: EmissionCategory;
  difficulty: 'easy' | 'moderate' | 'challenging';
  timeframe: 'immediate' | 'weekly' | 'monthly';
}

export interface WeeklyPlan {
  day: string;
  actions: string[];
}

export interface CoachData {
  analysis: string;
  topPriority: Recommendation;
  recommendations: Recommendation[];
  weeklyPlan: WeeklyPlan[];
  monthlyGoals: string[];
  totalPotentialSavings: number;
}

// --- State Types ---

export interface CarbonState {
  assessmentData: AssessmentData | null;
  carbonResults: CarbonResults | null;
  dailyActions: DailyActionEntry[];
  history: HistoryEntry[];
  hasCompletedAssessment: boolean;
}

export type CarbonAction =
  | { type: 'SET_ASSESSMENT'; payload: AssessmentData }
  | { type: 'SET_RESULTS'; payload: CarbonResults }
  | { type: 'TOGGLE_DAILY_ACTION'; payload: { date: string; actionId: string; co2Savings: number } }
  | { type: 'ADD_HISTORY_ENTRY'; payload: HistoryEntry }
  | { type: 'LOAD_STATE'; payload: CarbonState }
  | { type: 'LOAD_DEMO_DATA' }
  | { type: 'RESET' };
