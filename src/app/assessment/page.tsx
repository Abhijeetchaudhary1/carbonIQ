// ============================================================================
// Carbon Compass — Assessment Page
// ============================================================================

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Sparkles, Car, UtensilsCrossed, Zap, ShoppingBag, Trash2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Select, Slider, NumberInput } from '@/components/assessment/FormControls';
import { useCarbonContext } from '@/context/CarbonContext';
import type { AssessmentData, VehicleType, DietType, ApplianceUsage, RecyclingHabit, WasteGeneration } from '@/lib/types';
import { ASSESSMENT_STEPS } from '@/lib/constants';

const stepIcons = [Car, UtensilsCrossed, Zap, ShoppingBag, Trash2];

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -300 : 300, opacity: 0 }),
};

export default function AssessmentPage() {
  const router = useRouter();
  const { setAssessment } = useCarbonContext();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);

  // Form state
  const [transport, setTransport] = useState({
    vehicleType: 'sedan' as VehicleType,
    dailyDistance: 15,
    weeklyFrequency: 5,
  });
  const [food, setFood] = useState({
    dietType: 'mixed' as DietType,
    mealsPerWeek: 4,
  });
  const [energy, setEnergy] = useState({
    monthlyBill: 80,
    acUsage: 3,
    applianceUsage: 'moderate' as ApplianceUsage,
  });
  const [shopping, setShopping] = useState({
    monthlyPurchases: 5,
    fashionPurchases: 2,
  });
  const [waste, setWaste] = useState({
    recyclingHabits: 'sometimes' as RecyclingHabit,
    wasteGeneration: 'average' as WasteGeneration,
  });

  const totalSteps = ASSESSMENT_STEPS.length;

  const goNext = () => {
    if (step < totalSteps - 1) {
      setDirection(1);
      setStep(step + 1);
    }
  };

  const goPrev = () => {
    if (step > 0) {
      setDirection(-1);
      setStep(step - 1);
    }
  };

  const handleCalculate = () => {
    const data: AssessmentData = {
      transport,
      food,
      energy,
      shopping,
      waste,
      completedAt: new Date().toISOString(),
    };
    setAssessment(data);
    router.push('/dashboard');
  };

  const renderStep = () => {
    switch (step) {
      case 0: // Transportation
        return (
          <div className="space-y-6">
            <Select
              label="Vehicle Type"
              value={transport.vehicleType}
              onChange={(v) => setTransport({ ...transport, vehicleType: v as VehicleType })}
              options={[
                { value: 'none', label: 'No Vehicle', description: 'Walk, bike, or WFH' },
                { value: 'electric', label: 'Electric Car', description: 'Battery EV' },
                { value: 'hybrid', label: 'Hybrid', description: 'Gas + electric' },
                { value: 'small_car', label: 'Small Car', description: 'Compact / hatchback' },
                { value: 'sedan', label: 'Sedan', description: 'Standard size car' },
                { value: 'suv', label: 'SUV / Truck', description: 'Large vehicle' },
                { value: 'motorcycle', label: 'Motorcycle', description: 'Two-wheeler' },
                { value: 'public_transit', label: 'Public Transit', description: 'Bus, train, metro' },
              ]}
            />
            <Slider
              label="Daily Distance"
              value={transport.dailyDistance}
              min={0}
              max={100}
              unit=" km"
              onChange={(v) => setTransport({ ...transport, dailyDistance: v })}
            />
            <Slider
              label="Days Per Week"
              value={transport.weeklyFrequency}
              min={0}
              max={7}
              unit=" days"
              onChange={(v) => setTransport({ ...transport, weeklyFrequency: v })}
            />
          </div>
        );

      case 1: // Food
        return (
          <div className="space-y-6">
            <Select
              label="Diet Type"
              value={food.dietType}
              onChange={(v) => setFood({ ...food, dietType: v as DietType })}
              options={[
                { value: 'vegan', label: 'Vegan', description: 'No animal products' },
                { value: 'vegetarian', label: 'Vegetarian', description: 'No meat or fish' },
                { value: 'pescatarian', label: 'Pescatarian', description: 'Fish but no meat' },
                { value: 'mixed', label: 'Mixed', description: 'Balanced diet with some meat' },
                { value: 'heavy_meat', label: 'Heavy Meat', description: 'Meat with most meals' },
              ]}
            />
            <Slider
              label="Meals Eaten Out / Delivered Per Week"
              value={food.mealsPerWeek}
              min={0}
              max={21}
              unit=" meals"
              onChange={(v) => setFood({ ...food, mealsPerWeek: v })}
            />
          </div>
        );

      case 2: // Energy
        return (
          <div className="space-y-6">
            <NumberInput
              label="Monthly Electricity Bill"
              value={energy.monthlyBill}
              min={0}
              max={1000}
              unit="USD"
              placeholder="80"
              onChange={(v) => setEnergy({ ...energy, monthlyBill: v })}
            />
            <Slider
              label="AC / Heating Usage"
              value={energy.acUsage}
              min={0}
              max={16}
              unit=" hrs/day"
              onChange={(v) => setEnergy({ ...energy, acUsage: v })}
            />
            <Select
              label="Appliance Usage"
              value={energy.applianceUsage}
              onChange={(v) => setEnergy({ ...energy, applianceUsage: v as ApplianceUsage })}
              options={[
                { value: 'minimal', label: 'Minimal', description: 'Few appliances, mindful usage' },
                { value: 'moderate', label: 'Moderate', description: 'Average household usage' },
                { value: 'heavy', label: 'Heavy', description: 'Many appliances, frequent usage' },
              ]}
            />
          </div>
        );

      case 3: // Shopping
        return (
          <div className="space-y-6">
            <Slider
              label="General Purchases Per Month"
              value={shopping.monthlyPurchases}
              min={0}
              max={30}
              unit=" items"
              onChange={(v) => setShopping({ ...shopping, monthlyPurchases: v })}
            />
            <Slider
              label="Fashion / Clothing Purchases Per Month"
              value={shopping.fashionPurchases}
              min={0}
              max={15}
              unit=" items"
              onChange={(v) => setShopping({ ...shopping, fashionPurchases: v })}
            />
          </div>
        );

      case 4: // Waste
        return (
          <div className="space-y-6">
            <Select
              label="Recycling Habits"
              value={waste.recyclingHabits}
              onChange={(v) => setWaste({ ...waste, recyclingHabits: v as RecyclingHabit })}
              options={[
                { value: 'always', label: 'Always', description: 'Diligent recycler' },
                { value: 'often', label: 'Often', description: 'Recycle most things' },
                { value: 'sometimes', label: 'Sometimes', description: 'Recycle when convenient' },
                { value: 'rarely', label: 'Rarely', description: 'Occasional recycling' },
                { value: 'never', label: 'Never', description: 'Don\'t recycle' },
              ]}
            />
            <Select
              label="Waste Generation"
              value={waste.wasteGeneration}
              onChange={(v) => setWaste({ ...waste, wasteGeneration: v as WasteGeneration })}
              options={[
                { value: 'minimal', label: 'Minimal', description: 'Very little waste' },
                { value: 'below_average', label: 'Below Average', description: 'Less than most' },
                { value: 'average', label: 'Average', description: 'Typical household' },
                { value: 'above_average', label: 'Above Average', description: 'More than most' },
                { value: 'high', label: 'High', description: 'Significant waste' },
              ]}
            />
          </div>
        );

      default:
        return null;
    }
  };

  const StepIcon = stepIcons[step];

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container-page max-w-2xl">
        {/* Header */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-text-primary mb-2">
            Carbon Assessment
          </h1>
          <p className="text-text-secondary">
            Tell us about your lifestyle to calculate your carbon footprint.
          </p>
        </motion.div>

        {/* Stepper */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {ASSESSMENT_STEPS.map((s, i) => {
            const Icon = stepIcons[i];
            return (
              <div key={s.id} className="flex items-center gap-2">
                <button
                  onClick={() => { setDirection(i > step ? 1 : -1); setStep(i); }}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                    i === step
                      ? 'bg-green-primary/20 border border-green-primary/40 text-green-primary scale-110'
                      : i < step
                        ? 'bg-green-primary/10 text-green-primary'
                        : 'bg-bg-card border border-border text-text-muted'
                  }`}
                  aria-label={s.label}
                >
                  <Icon className="w-4 h-4" />
                </button>
                {i < totalSteps - 1 && (
                  <div className={`hidden sm:block w-8 h-px ${i < step ? 'bg-green-primary/40' : 'bg-border'}`} />
                )}
              </div>
            );
          })}
        </div>

        {/* Step Label */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-green-primary/10 flex items-center justify-center">
            <StepIcon className="w-5 h-5 text-green-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-text-primary">
              {ASSESSMENT_STEPS[step].label}
            </h2>
            <p className="text-sm text-text-muted">{ASSESSMENT_STEPS[step].description}</p>
          </div>
          <span className="ml-auto text-sm text-text-muted">
            {step + 1}/{totalSteps}
          </span>
        </div>

        {/* Form Content */}
        <div className="glass-card p-6 sm:p-8 min-h-[320px] relative overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-6">
          <Button
            variant="ghost"
            onClick={goPrev}
            disabled={step === 0}
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>

          {step < totalSteps - 1 ? (
            <Button variant="primary" onClick={goNext}>
              Next
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button variant="primary" onClick={handleCalculate}>
              <Sparkles className="w-4 h-4" />
              Calculate My Impact
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
