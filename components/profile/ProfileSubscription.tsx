"use client";

import type { SubscriptionInfo } from "../../lib/profile";

interface Props {
  info: SubscriptionInfo;
}

const PREMIUM_PERKS = [
  "📊 Export CSV de l'historique",
  "❄️ Jetons de freeze de streak",
  "🏅 Badges exclusifs Premium",
  "📈 Statistiques avancées",
  "🔔 Alertes défis personnalisées",
];

const DISCOUNT_STEPS = [
  { threshold: 12, discount: 1, label: "12 activités" },
  { threshold: 25, discount: 2, label: "25 activités" },
  { threshold: 40, discount: 3, label: "40 activités" },
];
const MAX_ACTIVITIES = 40;
const BASE_PRICE = 9;

export default function ProfileSubscription({ info }: Props) {
  const pct = Math.min(100, Math.round((info.activitiesThisMonth / MAX_ACTIVITIES) * 100));
  const nextStep = DISCOUNT_STEPS.find((s) => info.activitiesThisMonth < s.threshold);
  const finalPrice = BASE_PRICE - info.discount;

  if (info.plan === "free") {
    return (
      <div className="tab-content">
        <div className="sub-free-card">
          <div className="sub-free-badge">Free</div>
          <h3 className="sub-free-title">Passez à Premium</h3>
          <p className="sub-free-price">
            <span className="sub-price-big">9€</span>
            <span className="sub-price-mo">/mois</span>
          </p>
          <ul className="sub-perks-list">
            {PREMIUM_PERKS.map((p) => (
              <li key={p} className="sub-perk">{p}</li>
            ))}
          </ul>
          <button type="button" className="btn-upgrade">
            ⭐ Passer à Premium — 9€/mois
          </button>
        </div>
      </div>
    );
  }

  // Premium view
  return (
    <div className="tab-content">
      <div className="sub-premium-card">
        {/* Header */}
        <div className="sub-premium-header">
          <span className="badge-premium">⭐ Premium</span>
          <p className="sub-renewal">Renouvellement le {new Date(info.renewalDate).toLocaleDateString("fr-FR")}</p>
        </div>

        {/* Price + discount */}
        <div className="sub-price-block">
          {info.discount > 0 ? (
            <>
              <span className="sub-price-original">{BASE_PRICE}€</span>
              <span className="sub-price-discounted">{finalPrice}€</span>
              <span className="sub-price-mo">/mois</span>
              <span className="sub-discount-tag">-{info.discount}€</span>
            </>
          ) : (
            <>
              <span className="sub-price-big">{BASE_PRICE}€</span>
              <span className="sub-price-mo">/mois</span>
            </>
          )}
        </div>

        {/* Progressive discount progress bar */}
        <div className="sub-discount-section">
          <p className="sub-discount-title">
            Réduction progressive — {info.activitiesThisMonth} activités ce mois
          </p>

          {/* Bar */}
          <div className="discount-bar-wrap">
            <div className="discount-bar-track">
              <div className="discount-bar-fill" style={{ width: `${pct}%` }} />
              {/* Milestones */}
              {DISCOUNT_STEPS.map((s) => (
                <span
                  key={s.threshold}
                  className={`discount-milestone ${info.activitiesThisMonth >= s.threshold ? "discount-milestone--reached" : ""}`}
                  style={{ left: `${(s.threshold / MAX_ACTIVITIES) * 100}%` }}
                >
                  <span className="discount-milestone-dot" />
                  <span className="discount-milestone-label">-{s.discount}€</span>
                </span>
              ))}
            </div>
          </div>

          {/* Steps list */}
          <div className="discount-steps">
            {DISCOUNT_STEPS.map((s) => {
              const reached = info.activitiesThisMonth >= s.threshold;
              return (
                <div key={s.threshold} className={`discount-step ${reached ? "discount-step--reached" : ""}`}>
                  <span className="discount-step-icon">{reached ? "✅" : "🔒"}</span>
                  <span>{s.label} activités = -{s.discount}€ → {BASE_PRICE - s.discount}€/mois</span>
                </div>
              );
            })}
          </div>

          {nextStep && (
            <p className="discount-hint">
              ➡ Encore {nextStep.threshold - info.activitiesThisMonth} activités pour -{nextStep.discount}€/mois
            </p>
          )}
          {!nextStep && (
            <p className="discount-max">🎉 Réduction maximale atteinte ! Prix final : {BASE_PRICE - 3}€/mois</p>
          )}
        </div>

        <button type="button" className="btn-manage-sub">
          Gérer l'abonnement
        </button>
      </div>
    </div>
  );
}
