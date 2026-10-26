/** كلام يتلوّن بالتدرّج لما يمر عليه المؤشر، كلمة كلمة. لونه الأساسي من --ink-base (أبيض افتراضياً). */
export function Ink({ children }: { children: string }) {
  return children.split(" ").map((w, i) => (
    <span key={i}>
      {i > 0 && " "}
      <span className="ink">{w}</span>
    </span>
  ));
}
