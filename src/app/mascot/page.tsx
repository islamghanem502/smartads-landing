import type { Metadata } from "next";
import { MascotLab } from "./MascotLab";

export const metadata: Metadata = { title: "الشخصية — مراجعة" };

export default function MascotPage() {
  return <MascotLab />;
}
