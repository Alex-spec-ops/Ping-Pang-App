type Props = {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
};

export default function TopBar({ title, subtitle, right }: Props) {
  return (
    <header
      className="sticky top-0 z-30 border-b border-zinc-200 bg-white/90 backdrop-blur dark:border-zinc-800 dark:bg-black/90"
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      <div className="mx-auto flex max-w-md items-end justify-between gap-3 px-4 py-3">
        <div className="min-w-0">
          <h1 className="truncate text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            {title}
          </h1>
          {subtitle ? (
            <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
              {subtitle}
            </p>
          ) : null}
        </div>
        {right ? <div className="shrink-0">{right}</div> : null}
      </div>
    </header>
  );
}
