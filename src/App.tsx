import { Nav } from "./components/Nav";
import { Hero } from "./components/hero/Hero";
import { Services } from "./components/services/Services";

export function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Services />
      </main>
    </>
  );
}
