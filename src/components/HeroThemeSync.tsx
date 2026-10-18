"use client";

import { useEffect } from "react";

/** الهيدر والـ dock بياخدوا الشكل الغامق طول ما الهيرو تحتهم. */
export function HeroThemeSync() {
  useEffect(() => {
    const hero = document.getElementById("hero");
    if (!hero) return;
    const root = document.documentElement;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) root.dataset.top = "dark";
      else delete root.dataset.top;
    }, { rootMargin: "0px 0px -99% 0px" });
    io.observe(hero);
    return () => {
      io.disconnect();
      delete root.dataset.top;
    };
  }, []);
  return null;
}
