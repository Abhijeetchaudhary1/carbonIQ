// ============================================================================
// Carbon Compass — Carbon State Context
// ============================================================================

'use client';

import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import type { CarbonState, CarbonAction, AssessmentData, CarbonResults } from '@/lib/types';
import { saveState, loadState } from '@/lib/storage';
import { calculateCarbonFootprint } from '@/lib/carbon-engine';
import { calculateActionSavings, getTodayString } from '@/lib/actions';

// --- Demo Data ---
const DEMO_ASSESSMENT: AssessmentData = {
  transport: { vehicleType: 'sedan', dailyDistance: 25, weeklyFrequency: 5 },
  food: { dietType: 'mixed', mealsPerWeek: 6 },
  energy: { monthlyBill: 120, acUsage: 4, applianceUsage: 'moderate' },
  shopping: { monthlyPurchases: 8, fashionPurchases: 3 },
  waste: { recyclingHabits: 'sometimes', wasteGeneration: 'average' },
  completedAt: new Date().toISOString(),
};

// --- Initial State ---
const initialState: CarbonState = {
  assessmentData: null,
  carbonResults: null,
  dailyActions: [],
  history: [],
  hasCompletedAssessment: false,
};

// --- Reducer ---
function carbonReducer(state: CarbonState, action: CarbonAction): CarbonState {
  switch (action.type) {
    case 'SET_ASSESSMENT': {
      const results = calculateCarbonFootprint(action.payload);
      
      // Generate demo history for last 14 days to populate graphs
      const demoHistory = Array.from({ length: 14 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (13 - i));
        const dailyCO2 = results.dailyCO2;
        const savings = Math.random() * 5 + 2;
        return {
          date: date.toISOString().split('T')[0],
          totalCO2: dailyCO2,
          actionsSavings: Math.round(savings * 100) / 100,
          netCO2: Math.round((dailyCO2 - savings) * 100) / 100,
        };
      });

      return {
        ...state,
        assessmentData: action.payload,
        carbonResults: results,
        hasCompletedAssessment: true,
        history: demoHistory,
      };
    }
    case 'SET_RESULTS':
      return { ...state, carbonResults: action.payload };

    case 'TOGGLE_DAILY_ACTION': {
      const { date, actionId, co2Savings } = action.payload;
      const existingEntry = state.dailyActions.find(e => e.date === date);
      let updatedActions;

      if (existingEntry) {
        const isCompleted = existingEntry.completedActions.includes(actionId);
        const newCompleted = isCompleted
          ? existingEntry.completedActions.filter(id => id !== actionId)
          : [...existingEntry.completedActions, actionId];

        updatedActions = state.dailyActions.map(e =>
          e.date === date
            ? { ...e, completedActions: newCompleted, totalSavings: calculateActionSavings(newCompleted) }
            : e
        );
      } else {
        updatedActions = [
          ...state.dailyActions,
          { date, completedActions: [actionId], totalSavings: co2Savings },
        ];
      }

      // Update history
      const todaysActions = updatedActions.find(e => e.date === date);
      const dailyCO2 = state.carbonResults?.dailyCO2 ?? 0;
      const actionsSavings = todaysActions?.totalSavings ?? 0;

      const historyEntry = {
        date,
        totalCO2: dailyCO2,
        actionsSavings,
        netCO2: Math.max(0, dailyCO2 - actionsSavings),
      };

      const existingHistoryIndex = state.history.findIndex(h => h.date === date);
      const updatedHistory = existingHistoryIndex >= 0
        ? state.history.map((h, i) => i === existingHistoryIndex ? historyEntry : h)
        : [...state.history, historyEntry];

      return {
        ...state,
        dailyActions: updatedActions,
        history: updatedHistory,
      };
    }

    case 'ADD_HISTORY_ENTRY': {
      const existing = state.history.findIndex(h => h.date === action.payload.date);
      if (existing >= 0) {
        return {
          ...state,
          history: state.history.map((h, i) => i === existing ? action.payload : h),
        };
      }
      return { ...state, history: [...state.history, action.payload] };
    }

    case 'LOAD_STATE':
      return action.payload;

    case 'LOAD_DEMO_DATA': {
      const demoResults = calculateCarbonFootprint(DEMO_ASSESSMENT);
      const today = getTodayString();
      
      // Generate demo history for last 14 days
      const demoHistory = Array.from({ length: 14 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (13 - i));
        const dailyCO2 = demoResults.dailyCO2;
        const savings = Math.random() * 5 + 2;
        return {
          date: date.toISOString().split('T')[0],
          totalCO2: dailyCO2,
          actionsSavings: Math.round(savings * 100) / 100,
          netCO2: Math.round((dailyCO2 - savings) * 100) / 100,
        };
      });

      return {
        assessmentData: DEMO_ASSESSMENT,
        carbonResults: demoResults,
        dailyActions: [{
          date: today,
          completedActions: ['lights-off', 'reusable-bottle', 'plant-based-meal'],
          totalSavings: 2.9,
        }],
        history: demoHistory,
        hasCompletedAssessment: true,
      };
    }

    case 'RESET':
      return initialState;

    default:
      return state;
  }
}

// --- Context ---
interface CarbonContextType {
  state: CarbonState;
  dispatch: React.Dispatch<CarbonAction>;
  setAssessment: (data: AssessmentData) => void;
  toggleAction: (actionId: string, co2Savings: number) => void;
  loadDemo: () => void;
  reset: () => void;
}

const CarbonContext = createContext<CarbonContextType | undefined>(undefined);

// --- Provider ---
export function CarbonProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(carbonReducer, initialState);
  const [hydrated, setHydrated] = React.useState(false);

  // Hydrate from localStorage on mount
  useEffect(() => {
    const persisted = loadState();
    if (persisted) {
      dispatch({ type: 'LOAD_STATE', payload: persisted });
    }
    setHydrated(true);
  }, []);

  // Persist on state change (after hydration)
  useEffect(() => {
    if (hydrated) {
      saveState(state);
    }
  }, [state, hydrated]);

  const setAssessment = useCallback((data: AssessmentData) => {
    dispatch({ type: 'SET_ASSESSMENT', payload: { ...data, completedAt: new Date().toISOString() } });
  }, []);

  const toggleAction = useCallback((actionId: string, co2Savings: number) => {
    dispatch({
      type: 'TOGGLE_DAILY_ACTION',
      payload: { date: getTodayString(), actionId, co2Savings },
    });
  }, []);

  const loadDemo = useCallback(() => {
    dispatch({ type: 'LOAD_DEMO_DATA' });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  return (
    <CarbonContext.Provider value={{ state, dispatch, setAssessment, toggleAction, loadDemo, reset }}>
      {children}
    </CarbonContext.Provider>
  );
}

// --- Hook ---
export function useCarbonContext(): CarbonContextType {
  const context = useContext(CarbonContext);
  if (!context) {
    throw new Error('useCarbonContext must be used within a CarbonProvider');
  }
  return context;
}
