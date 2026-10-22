"use client";

import React from "react";
import { FloatingDock, type DockItem } from "@/components/ui/floating-dock";
import {
  IconHome,
  IconBriefcase,
  IconUsers,
  IconApps,
  IconPlayerPlay,
  IconTag,
  IconArticle,
  IconMessageCircle,
} from "@tabler/icons-react";
import { APP_URL } from "@/lib/links";

export const NAV_LINKS: DockItem[] = [
  {
    title: "الرئيسية",
    icon: <IconHome className="size-full text-neutral-300 group-hover:text-white" />,
    href: "/",
  },
  {
    title: "وش نسوي",
    icon: <IconBriefcase className="size-full text-neutral-300 group-hover:text-white" />,
    href: "#events",
  },
  {
    title: "من نحن",
    icon: <IconUsers className="size-full text-neutral-300 group-hover:text-white" />,
    href: "#about",
  },
  {
    title: "المنصات",
    icon: <IconApps className="size-full text-neutral-300 group-hover:text-white" />,
    href: "#platforms",
  },
  {
    title: "كيف نبدأ",
    icon: <IconPlayerPlay className="size-full text-neutral-300 group-hover:text-white" />,
    href: "#how",
  },
  {
    title: "الأسعار",
    icon: <IconTag className="size-full text-neutral-300 group-hover:text-white" />,
    href: "#pricing",
  },
  {
    title: "المدونة",
    icon: <IconArticle className="size-full text-neutral-300 group-hover:text-white" />,
    href: `${APP_URL}/blog`,
  },
  {
    title: "تواصل معنا",
    icon: <IconMessageCircle className="size-full text-neutral-300 group-hover:text-white" />,
    href: "#contact",
  },
];

export function FloatingDockNav() {
  return (
    <nav
      aria-label="التنقل الرئيسي"
      className="fixed inset-x-0 bottom-4 z-50 flex justify-center px-4 md:bottom-auto md:top-3 pointer-events-auto"
    >
      <FloatingDock
        items={NAV_LINKS}
        showLabelsBelow={true}
        desktopClassName="bg-neutral-900/85 backdrop-blur-2xl border border-white/15 shadow-2xl shadow-black/40"
        mobileClassName="fixed bottom-5 right-5"
      />
    </nav>
  );
}
