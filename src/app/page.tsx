// ============================================================================
// Carbon Compass — Landing Page
// ============================================================================

import HeroSection from '@/components/landing/HeroSection';
import HowItWorks from '@/components/landing/HowItWorks';
import ImpactCategories from '@/components/landing/ImpactCategories';
import CoachPreview from '@/components/landing/CoachPreview';
import ProgressPreview from '@/components/landing/ProgressPreview';
import Footer from '@/components/ui/Footer';
import ParticleField from '@/components/landing/ParticleField';

export default function LandingPage() {
  return (
    <>
      <ParticleField />
      <HeroSection />
      <HowItWorks />
      <ImpactCategories />
      <CoachPreview />
      <ProgressPreview />
      <Footer />
    </>
  );
}
