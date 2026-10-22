"use client";
import { cn } from "@/lib/utils";
import { IconLayoutNavbarCollapse } from "@tabler/icons-react";
import {
  AnimatePresence,
  MotionValue,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import { useRef, useState } from "react";

export interface DockItem {
  title: string;
  icon: React.ReactNode;
  href: string;
}

export const FloatingDock = ({
  items,
  desktopClassName,
  mobileClassName,
  showLabelsBelow = true,
}: {
  items: DockItem[];
  desktopClassName?: string;
  mobileClassName?: string;
  showLabelsBelow?: boolean;
}) => {
  return (
    <>
      <FloatingDockDesktop
        items={items}
        className={desktopClassName}
        showLabelsBelow={showLabelsBelow}
      />
      <FloatingDockMobile items={items} className={mobileClassName} />
    </>
  );
};

const FloatingDockMobile = ({
  items,
  className,
}: {
  items: DockItem[];
  className?: string;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <div className={cn("relative block md:hidden", className)}>
      <AnimatePresence>
        {open && (
          <motion.div
            layoutId="nav"
            className="absolute inset-x-0 bottom-full mb-2 flex flex-col gap-2 z-50"
          >
            {items.map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: 10,
                  transition: {
                    delay: idx * 0.05,
                  },
                }}
                transition={{ delay: (items.length - 1 - idx) * 0.05 }}
              >
                <a
                  href={item.href}
                  key={item.title}
                  className="flex h-11 w-auto min-w-[44px] items-center gap-2.5 px-3 rounded-full bg-white/90 backdrop-blur-md border border-black/10 shadow-lg text-ink"
                >
                  <div className="h-4 w-4 shrink-0">{item.icon}</div>
                  <span className="text-xs font-semibold">{item.title}</span>
                </a>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <button
        onClick={() => setOpen(!open)}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-white border border-black/10 shadow-md text-ink"
      >
        <IconLayoutNavbarCollapse className="h-5 w-5 text-ink-soft" />
      </button>
    </div>
  );
};

const FloatingDockDesktop = ({
  items,
  className,
  showLabelsBelow = true,
}: {
  items: DockItem[];
  className?: string;
  showLabelsBelow?: boolean;
}) => {
  let mouseX = useMotionValue(Infinity);
  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={cn(
        "mx-auto hidden items-end gap-3 rounded-2xl bg-white/80 backdrop-blur-xl border border-black/[0.08] px-3.5 pb-2 pt-2.5 shadow-xl md:flex",
        showLabelsBelow ? "h-auto" : "h-16",
        className,
      )}
    >
      {items.map((item) => (
        <IconContainer
          mouseX={mouseX}
          key={item.title}
          showLabelBelow={showLabelsBelow}
          {...item}
        />
      ))}
    </motion.div>
  );
};

function IconContainer({
  mouseX,
  title,
  icon,
  href,
  showLabelBelow = true,
}: {
  mouseX: MotionValue;
  title: string;
  icon: React.ReactNode;
  href: string;
  showLabelBelow?: boolean;
}) {
  let ref = useRef<HTMLDivElement>(null);

  let distance = useTransform(mouseX, (val) => {
    let bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };

    return val - bounds.x - bounds.width / 2;
  });

  let widthTransform = useTransform(distance, [-150, 0, 150], [42, 64, 42]);
  let heightTransform = useTransform(distance, [-150, 0, 150], [42, 64, 42]);

  let widthTransformIcon = useTransform(distance, [-150, 0, 150], [20, 32, 20]);
  let heightTransformIcon = useTransform(
    distance,
    [-150, 0, 150],
    [20, 32, 20],
  );

  let width = useSpring(widthTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });
  let height = useSpring(heightTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  let widthIcon = useSpring(widthTransformIcon, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });
  let heightIcon = useSpring(heightTransformIcon, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  const [hovered, setHovered] = useState(false);

  return (
    <a href={href} className="flex flex-col items-center group">
      <motion.div
        ref={ref}
        style={{ width, height }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="relative flex aspect-square items-center justify-center rounded-2xl bg-white/[0.08] hover:bg-white/[0.15] border border-white/15 text-white shadow-sm transition-colors"
      >
        {/* التولتيب المنبثق بالأعلى في حالة عدم تفعيل النص الدائم */}
        {!showLabelBelow && (
          <AnimatePresence>
            {hovered && (
              <motion.div
                initial={{ opacity: 0, y: 10, x: "-50%" }}
                animate={{ opacity: 1, y: 0, x: "-50%" }}
                exit={{ opacity: 0, y: 2, x: "-50%" }}
                className="absolute -top-8 left-1/2 w-fit rounded-md border border-white/10 bg-neutral-900 px-2 py-0.5 text-xs whitespace-pre text-neutral-200 shadow-md"
              >
                {title}
              </motion.div>
            )}
          </AnimatePresence>
        )}

        <motion.div
          style={{ width: widthIcon, height: heightIcon }}
          className="flex items-center justify-center"
        >
          {icon}
        </motion.div>
      </motion.div>

      {/* الاسم أسفل الأيقونة كما طلب المستخدم */}
      {showLabelBelow && (
        <span className="mt-1.5 text-[11px] font-medium text-neutral-300 group-hover:text-white transition-colors whitespace-nowrap">
          {title}
        </span>
      )}
    </a>
  );
}

export default FloatingDock;
