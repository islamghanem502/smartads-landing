"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { inject } from "./core/styles";
import { LAP, tour, type FigureMount, type Readout, type Tour } from "./core/stage";

const NS = "http://www.w3.org/2000/svg";

type Props = {
  engine: FigureMount;
  /** رقم الرسمة نفسها (المدى الأوسط في range). */
  value: number;
  label: string;
  /** يمشي الرسمة لحالها لين يجي المؤشر. */
  play?: boolean;
  stops?: Tour;
  onRead?: (text: string) => void;
  className?: string;
  style?: CSSProperties;
};

/** يركّب رسمة hairline على div: نفس عقد الحزمة (stage, svg, read) بدون قائمة رسوماتها. */
export function HairlineFigure({ engine, value, label, play = false, stops, onRead, className, style }: Props) {
  const el = useRef<HTMLDivElement>(null);
  const read = useRef(onRead);
  read.current = onRead;

  useEffect(() => {
    const stage = el.current;
    if (!stage) return;
    inject(document);
    const svg = document.createElementNS(NS, "svg");
    svg.setAttribute("viewBox", "0 0 400 320");
    svg.setAttribute("aria-hidden", "true");
    stage.appendChild(svg);

    let text: string | null = null;
    const out: Readout = {
      get textContent() { return text; },
      set textContent(v) {
        const next = v ?? "";
        if (next === text) return;
        text = next;
        read.current?.(next);
      },
    };

    // الجولة قبل الرسمة، عشان تتحرك أول كل إطار
    const ghost = play ? tour(stage, stops ?? LAP) : null;
    const handle = engine({ stage, svg, read: out }, value);
    if (text === null) out.textContent = "rest";
    return () => {
      ghost?.stop();
      handle.destroy();
      svg.remove();
    };
    // تتركّب مرة وحدة
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [engine]);

  return (
    <div
      ref={el}
      data-hairline=""
      role="img"
      aria-label={label}
      className={className}
      style={{ aspectRatio: "5 / 4", ...style }}
    />
  );
}
