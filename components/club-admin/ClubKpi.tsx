type Props = {
  label: string;
  value: string;
  hint?: string;
  trend?: "up" | "down" | "flat";
  accent?: "gold" | "white" | "red" | "green";
};

const accents: Record<string, string> = {
  gold: "var(--color-gold)",
  white: "#f6f1e3",
  red: "#ff7676",
  green: "#7ad9a6",
};

export default function ClubKpi({
  label,
  value,
  hint,
  trend,
  accent = "white",
}: Props) {
  return (
    <div
      className="p-3"
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <p
        className="text-[10px] font-semibold uppercase tracking-wider"
        style={{
          color: "rgba(255,255,255,0.55)",
          fontFamily: "var(--font-ui)",
        }}
      >
        {label}
      </p>
      <p
        className="mt-1 text-2xl font-bold tabular-nums"
        style={{ color: accents[accent], fontFamily: "var(--font-display)" }}
      >
        {value}
      </p>
      {hint ? (
        <p
          className="mt-0.5 text-[11px]"
          style={{ color: "rgba(255,255,255,0.55)" }}
        >
          {trend === "up" ? "▲ " : trend === "down" ? "▼ " : ""}
          {hint}
        </p>
      ) : null}
    </div>
  );
}
