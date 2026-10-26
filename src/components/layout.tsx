import type { ComponentProps } from "react";

/*
 * قواعد التخطيط لكل الصفحة (القيم نفسها في index.css):
 *   --gutter     هامش الجنب: 16px في الجوال، يكبر لين 32px.
 *   max-w-page   أقصى عرض للمحتوى: 80rem (1280px) شامل الهامش.
 *   --section-y  مسافة كل قسم من فوق وتحت: 64px في الجوال، تكبر لين 128px.
 *   --nav-h      ارتفاع النافبار الثابت مع مسافته من فوق، عشان ما يغطي أول المحتوى.
 * كل قسم يمشي على Container، فالحواف تركب على بعض من النافبار لآخر الصفحة.
 */

export function Container({ className = "", ...props }: ComponentProps<"div">) {
  return <div className={`mx-auto w-full max-w-page px-(--gutter) ${className}`} {...props} />;
}

/** قسم عادي بمسافته الثابتة. الهيرو له تخطيطه الخاص لأنه يملا الشاشة. */
export function Section({ className = "", children, ...props }: ComponentProps<"section">) {
  return (
    <section className={`py-(--section-y) ${className}`} {...props}>
      <Container>{children}</Container>
    </section>
  );
}
