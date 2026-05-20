type Props = {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
};

export default function TopBar({ title, subtitle, right }: Props) {
  return (
    <header
      className="sticky top-0 z-30 backdrop-blur"
      style={{
        borderBottom: "var(--border-thin)",
        background: "rgba(249,249,255,0.95)",
        paddingTop: "env(safe-area-inset-top)",
      }}
    >
      <div className="mx-auto flex max-w-md items-end justify-between gap-3 px-4 py-3">
        <div className="min-w-0">
          <h1
            className="truncate text-xl font-bold tracking-tight"
            style={{ fontFamily: "var(--font-display)", color: "var(--color-ink)" }}
          >
            {title}
          </h1>
          {subtitle ? (
            <p className="truncate text-xs" style={{ color: "var(--color-muted)" }}>
              {subtitle}
            </p>
          ) : null}
        </div>
        {right ? <div className="shrink-0">{right}</div> : null}
      </div>
    </header>
  );
}
