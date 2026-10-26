import { Nav } from "./components/Nav";
import { Hero } from "./components/hero/Hero";
import { Services } from "./components/services/Services";
import { How } from "./components/how/How";
import { Why } from "./components/why/Why";
import { Pricing } from "./components/pricing/Pricing";
import { Footer } from "./components/footer/Footer";

export function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Services />
        <How />
        <Why />
        <Pricing />
      </main>
      <Footer />
    </>
  );
}
