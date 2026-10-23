import { Nav } from "@/components/Nav";
import { Hero } from "@/components/hero/Hero";
import { Campaigns } from "@/components/sections/Campaigns";
import { Clarity } from "@/components/sections/Clarity";
import { Closing, Footer } from "@/components/sections/Closing";
import { Events } from "@/components/sections/Events";
import { Faq } from "@/components/sections/Faq";
import { How } from "@/components/sections/How";
import { Pricing } from "@/components/sections/Pricing";
import { Publish } from "@/components/sections/Publish";
import { PinDefs } from "@/components/ui/Pin";
import { SmoothScroll } from "@/components/ui/SmoothScroll";

export default function Home() {
  return (
    <>
      <PinDefs />
      <SmoothScroll />
      <Nav />
      <main>
        <Hero />
        <How />
        <Events />
        <Campaigns />
        <Publish />
        <Clarity />
        <Pricing />
        <Faq />
        <Closing />
      </main>
      <Footer />
    </>
  );
}
