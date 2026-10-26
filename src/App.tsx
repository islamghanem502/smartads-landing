import { Nav } from "./components/Nav";
import { Hero } from "./components/hero/Hero";
import { Services } from "./components/services/Services";
import { How } from "./components/how/How";
import { Why } from "./components/why/Why";

export function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Services />
        <How />
        <Why />
      </main>
    </>
  );
}
