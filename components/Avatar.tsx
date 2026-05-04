type Size = "xs" | "sm" | "md" | "lg" | "xl";

const sizes: Record<Size, string> = {
  xs: "h-6 w-6 text-sm",
  sm: "h-8 w-8 text-base",
  md: "h-10 w-10 text-lg",
  lg: "h-14 w-14 text-2xl",
  xl: "h-24 w-24 text-5xl",
};

export default function Avatar({
  emoji,
  size = "md",
}: {
  emoji: string;
  size?: Size;
}) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-100 to-sky-100 ring-1 ring-zinc-200 dark:from-emerald-900/40 dark:to-sky-900/40 dark:ring-zinc-700 ${sizes[size]}`}
    >
      <span aria-hidden>{emoji}</span>
    </span>
  );
}
