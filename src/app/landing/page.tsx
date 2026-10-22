import { LandingNav } from "@/components/landing/LandingNav";
import { MascotHero } from "@/components/landing/MascotHero";
import { Services } from "@/components/landing/Services";
import { WhyUs } from "@/components/landing/WhyUs";

export default function LandingPage() {
  return (
    <>
      <LandingNav />
      <main>
        <MascotHero />
        <Services />
        <WhyUs />
      </main>
    </>
  );
}
