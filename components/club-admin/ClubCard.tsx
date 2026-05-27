type Props = {
  children: React.ReactNode;
  className?: string;
};

export default function ClubCard({ children, className = "" }: Props) {
  return (
    <div
      className={`rounded-xl p-3 ${className}`}
      style={{
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.10)",
      }}
    >
      {children}
    </div>
  );
}

export function ClubSectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="mb-2 text-[10px] font-bold uppercase tracking-widest"
      style={{ color: "var(--color-gold)", fontFamily: "var(--font-ui)" }}
    >
      {children}
    </h2>
  );
}

export function ClubPrimaryButton({
  children,
  onClick,
  type = "button",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-wider transition-opacity hover:opacity-90"
      style={{
        background: "var(--color-gold)",
        color: "var(--color-forest-deep)",
        fontFamily: "var(--font-ui)",
      }}
    >
      {children}
    </button>
  );
}

export function ClubGhostButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-wider transition-opacity hover:opacity-80"
      style={{
        background: "transparent",
        color: "#f6f1e3",
        border: "1px solid rgba(255,255,255,0.20)",
        fontFamily: "var(--font-ui)",
      }}
    >
      {children}
    </button>
  );
}
