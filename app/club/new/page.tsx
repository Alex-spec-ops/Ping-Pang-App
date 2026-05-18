"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import TopBar from "../../../components/TopBar";

type ClubType = "physical" | "digital";

export default function NewClubPage() {
  const router = useRouter();
  const [step, setStep] = useState<"type" | "form">("type");
  const [clubType, setClubType] = useState<ClubType>("physical");
  const [membershipFree, setMembershipFree] = useState(false);
  const [price, setPrice] = useState("80");

  function handleTypeSelect(t: ClubType) {
    setClubType(t);
    setStep("form");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Demo: just redirect to clubs list
    router.push("/clubs");
  }

  return (
    <>
      <TopBar title="Créer un club" subtitle="Démo · données mock" />
      <main className="px-4 py-6 space-y-4">

        {step === "type" && (
          <>
            <p
              className="text-sm text-center pb-2"
              style={{ color: "var(--color-muted)", fontFamily: "var(--font-ui)" }}
            >
              Quel type de club veux-tu créer ?
            </p>
            <button
              type="button"
              onClick={() => handleTypeSelect("physical")}
              className="w-full p-5 text-left"
              style={{
                background: "var(--color-cream)",
                border: "var(--border-thin)",
                fontFamily: "var(--font-ui)",
              }}
            >
              <p className="text-2xl mb-1">🏢</p>
              <p className="font-bold text-base" style={{ fontFamily: "var(--font-display)" }}>
                Club physique
              </p>
              <p className="text-xs mt-1" style={{ color: "var(--color-muted)" }}>
                Salle de ping, tables à réserver, entraînements en présentiel. Accès à la réservation de tables.
              </p>
            </button>
            <button
              type="button"
              onClick={() => handleTypeSelect("digital")}
              className="w-full p-5 text-left"
              style={{
                background: "var(--color-cream)",
                border: "var(--border-thin)",
                fontFamily: "var(--font-ui)",
              }}
            >
              <p className="text-2xl mb-1">💻</p>
              <p className="font-bold text-base" style={{ fontFamily: "var(--font-display)" }}>
                Club digital
              </p>
              <p className="text-xs mt-1" style={{ color: "var(--color-muted)" }}>
                Communauté en ligne, classements, défis. Pas de salle physique — pas de réservation de tables.
              </p>
            </button>
          </>
        )}

        {step === "form" && (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div
              className="flex items-center gap-2 px-3 py-2 text-sm"
              style={{
                background: "var(--color-cream)",
                border: "var(--border-thin)",
                fontFamily: "var(--font-ui)",
              }}
            >
              <span>{clubType === "physical" ? "🏢" : "💻"}</span>
              <span className="font-semibold">
                {clubType === "physical" ? "Club physique" : "Club digital"}
              </span>
              <button
                type="button"
                onClick={() => setStep("type")}
                className="ml-auto text-xs underline"
                style={{ color: "var(--color-muted)" }}
              >
                Changer
              </button>
            </div>

            <input
              type="text"
              placeholder="Nom du club"
              required
              className="w-full px-4 py-3 text-sm"
              style={{
                background: "#fff",
                border: "var(--border-thin)",
                fontFamily: "var(--font-ui)",
              }}
            />
            <input
              type="text"
              placeholder="Ville"
              required
              className="w-full px-4 py-3 text-sm"
              style={{
                background: "#fff",
                border: "var(--border-thin)",
                fontFamily: "var(--font-ui)",
              }}
            />

            {/* Membership */}
            <div
              className="p-4 space-y-3"
              style={{
                background: "var(--color-cream)",
                border: "var(--border-thin)",
                fontFamily: "var(--font-ui)",
              }}
            >
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--color-muted)" }}>
                Adhésion
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setMembershipFree(true)}
                  className="flex-1 py-2 text-sm font-bold"
                  style={{
                    background: membershipFree ? "var(--color-forest)" : "#fff",
                    color: membershipFree ? "#fff" : "var(--color-ink)",
                    border: "var(--border-thin)",
                  }}
                >
                  Gratuite
                </button>
                <button
                  type="button"
                  onClick={() => setMembershipFree(false)}
                  className="flex-1 py-2 text-sm font-bold"
                  style={{
                    background: !membershipFree ? "var(--color-forest)" : "#fff",
                    color: !membershipFree ? "#fff" : "var(--color-ink)",
                    border: "var(--border-thin)",
                  }}
                >
                  Payante
                </button>
              </div>
              {!membershipFree && (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-24 px-3 py-2 text-sm"
                    style={{
                      background: "#fff",
                      border: "var(--border-thin)",
                      fontFamily: "var(--font-ui)",
                    }}
                  />
                  <span className="text-sm" style={{ color: "var(--color-muted)" }}>€ / an</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 text-sm font-bold uppercase tracking-wider"
              style={{
                background: "var(--color-forest)",
                color: "#fff",
                fontFamily: "var(--font-ui)",
              }}
            >
              Créer le club (démo)
            </button>
          </form>
        )}
      </main>
    </>
  );
}
