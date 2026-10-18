"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { MascotEngine, type EmoteOptions } from "./engine";
import type { EmoteName, MascotStateName } from "./look";

export type MascotHandle = {
  setState: (name: MascotStateName) => void;
  triggerEmote: (name: EmoteName, opts?: EmoteOptions) => void;
  greet: () => void;
  /** إحداثيات العميل. hold بالثواني؛ من غيره يفضل يبص هناك. null = يرجع يتبع الماوس. */
  lookAt: (x: number | null, y?: number, hold?: number) => void;
  lookAtElement: (el: Element | null, hold?: number) => void;
};

type Props = {
  size?: number;
  greetOnMount?: boolean;
  sound?: boolean;
  className?: string;
  label?: string;
};

export const Mascot = forwardRef<MascotHandle, Props>(function Mascot(
  { size = 240, greetOnMount = true, sound = true, className, label = "شخصية مسوّقك الذكي" },
  ref,
) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engine = useRef<MascotEngine | null>(null);
  // أوامر جت قبل ما الـ engine يتعمل
  const queue = useRef<((e: MascotEngine) => void)[]>([]);

  const run = (fn: (e: MascotEngine) => void) => {
    if (engine.current) fn(engine.current);
    else queue.current.push(fn);
  };

  useImperativeHandle(ref, () => ({
    setState: (name) => run((e) => e.setState(name)),
    triggerEmote: (name, opts) => run((e) => e.triggerEmote(name, opts)),
    greet: () => run((e) => e.greet()),
    lookAt: (x, y, hold) => run((e) => e.lookAt(x, y, hold)),
    lookAtElement: (el, hold) => run((e) => e.lookAtElement(el, hold)),
  }));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const e = new MascotEngine(canvas, size);
    engine.current = e;
    queue.current.splice(0).forEach((fn) => fn(e));
    const greet = greetOnMount ? window.setTimeout(() => e.greet(), 500) : 0;
    return () => {
      window.clearTimeout(greet);
      e.destroy();
      engine.current = null;
    };
    // الـ engine بيتعمل مرة واحدة؛ المقاس والصوت بيتحدّثوا تحت
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    engine.current?.setSize(size);
  }, [size]);

  useEffect(() => {
    if (engine.current) engine.current.sound = sound;
  }, [sound]);

  return <canvas ref={canvasRef} className={className} role="img" aria-label={label} style={{ width: size, height: size, touchAction: "manipulation" }} />;
});
