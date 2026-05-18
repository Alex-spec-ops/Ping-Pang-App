"use client";

import { useState } from "react";
import type { Venue, VenueReview } from "../lib/venues";
import { moderateReview } from "../lib/venues";
import { getVenueLeaderboard } from "../lib/territory";
import { timeAgo } from "../lib/format";

interface Props {
  venue: Venue;
  reviews: VenueReview[];
  isOpen: boolean;
  onClose: () => void;
  onCheckin: (venueId: string) => void;
  checkedIn: boolean;
}

export default function VenueSheet({ venue, reviews, isOpen, onClose, onCheckin, checkedIn }: Props) {
  const territory = getVenueLeaderboard(venue.id);
  const owner = territory[0] ?? null;
  const [photoIdx, setPhotoIdx] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [submittedReview, setSubmittedReview] = useState(false);

  // Review form state
  const [reviewRating, setReviewRating]       = useState(0);
  const [reviewComment, setReviewComment]     = useState("");
  const [ratingTables, setRatingTables]       = useState(0);
  const [ratingAmbiance, setRatingAmbiance]   = useState(0);
  const [ratingClean, setRatingClean]         = useState(0);
  const [ratingAccess, setRatingAccess]       = useState(0);
  const [reviewError, setReviewError]         = useState<string | null>(null);

  function submitReview() {
    const check = moderateReview(reviewComment);
    if (!check.ok) { setReviewError(check.reason!); return; }
    if (reviewRating === 0) { setReviewError("Choisissez une note globale."); return; }
    setReviewError(null);
    setSubmittedReview(true);
    setShowReviewForm(false);
  }

  const directionUrl = `https://www.google.com/maps/dir/?api=1&destination=${venue.lat},${venue.lng}`;

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[1px]"
          onClick={onClose}
        />
      )}

      {/* Sheet */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 mx-auto max-w-md overflow-y-auto shadow-2xl transition-transform duration-300 ease-out"
        style={{
          maxHeight: "88vh",
          transform: isOpen ? "translateY(0)" : "translateY(110%)",
          paddingBottom: "env(safe-area-inset-bottom)",
          background: "var(--color-bg)",
          borderTop: "var(--border-thin)",
        }}
      >
        {/* Drag handle */}
        <div
          className="sticky top-0 z-10 flex justify-center pt-3 pb-1"
          style={{ background: "var(--color-bg)" }}
        >
          <div className="h-1 w-10 rounded-full" style={{ background: "var(--color-line)" }} />
        </div>

        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-20 grid h-8 w-8 place-items-center text-sm"
          style={{ border: "var(--border-thin)", color: "var(--color-muted)" }}
        >
          ✕
        </button>

        {/* Photo carousel */}
        <div className="relative h-44 overflow-hidden">
          <div
            className="flex h-full transition-transform duration-300"
            style={{ transform: `translateX(-${photoIdx * 100}%)` }}
          >
            {venue.photos.map(([from, to], i) => (
              <div
                key={i}
                className="flex h-full w-full shrink-0 items-center justify-center"
                style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
              >
                <span className="text-6xl opacity-70">
                  {venue.surface === "outdoor" ? "🌳" : venue.type === "bar" ? "🍹" : "🏓"}
                </span>
              </div>
            ))}
          </div>

          {/* Dots */}
          {venue.photos.length > 1 && (
            <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5">
              {venue.photos.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setPhotoIdx(i)}
                  className={`h-1.5 rounded-full transition-all ${
                    i === photoIdx ? "w-4 bg-white" : "w-1.5 bg-white/50"
                  }`}
                />
              ))}
            </div>
          )}

          {/* Nav arrows */}
          {photoIdx > 0 && (
            <button
              type="button"
              onClick={() => setPhotoIdx((i) => i - 1)}
              className="absolute left-2 top-1/2 -translate-y-1/2 grid h-8 w-8 place-items-center rounded-full bg-black/30 text-white"
            >
              ‹
            </button>
          )}
          {photoIdx < venue.photos.length - 1 && (
            <button
              type="button"
              onClick={() => setPhotoIdx((i) => i + 1)}
              className="absolute right-2 top-1/2 -translate-y-1/2 grid h-8 w-8 place-items-center rounded-full bg-black/30 text-white"
            >
              ›
            </button>
          )}
        </div>

        {/* Content */}
        <div className="px-4 pt-4">
          {/* Name + badges */}
          <div className="flex items-start gap-2">
            <div className="flex-1">
              <h2
                className="text-lg font-bold"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {venue.name}
              </h2>
              <p className="text-xs" style={{ color: "var(--color-muted)" }}>📍 {venue.address}</p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <TypeBadge type={venue.type} />
              <SurfaceBadge surface={venue.surface} />
            </div>
          </div>

          {/* Rating */}
          <div className="mt-3 flex items-center gap-3">
            <div className="flex items-center gap-1">
              <StarDisplay rating={venue.rating} />
              <span className="text-sm font-bold tabular-nums">{venue.rating.toFixed(1)}</span>
            </div>
            <span className="text-xs" style={{ color: "var(--color-muted)" }}>
              {venue.reviewCount} avis
            </span>
            <span className="ml-auto text-xs" style={{ color: "var(--color-muted)" }}>
              🏓 {venue.tables} table{venue.tables > 1 ? "s" : ""}
            </span>
          </div>

          {/* Tags */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            <PricingBadge pricing={venue.pricing} priceInfo={venue.priceInfo} />
            {venue.tags.map((t) => (
              <span
                key={t}
                className="px-2.5 py-0.5 text-[11px]"
                style={{ background: "var(--color-line)", color: "var(--color-ink)" }}
              >
                {t}
              </span>
            ))}
          </div>

          {/* Description */}
          <p className="mt-3 text-xs leading-relaxed" style={{ color: "var(--color-muted)" }}>
            {venue.description}
          </p>

          {/* Horaires */}
          <div className="mt-4">
            <p
              className="mb-1.5 text-xs font-semibold uppercase tracking-wide"
              style={{ color: "var(--color-muted)", fontFamily: "var(--font-ui)" }}
            >
              Horaires
            </p>
            <div className="space-y-1 px-3 py-2.5" style={{ background: "var(--color-cream)", border: "var(--border-thin)" }}>
              {venue.hours.map((h) => (
                <div key={h.days} className="flex justify-between text-xs">
                  <span style={{ color: "var(--color-muted)" }}>{h.days}</span>
                  <span
                    className="font-medium"
                    style={{ color: h.time === "Fermé" ? "var(--color-red)" : "var(--color-ink)" }}
                  >
                    {h.time}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-4 grid grid-cols-2 gap-2">
            <a
              href={directionUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 py-2.5 text-sm font-semibold text-white"
              style={{ background: "var(--color-forest)", fontFamily: "var(--font-ui)" }}
            >
              🗺 Itinéraire
            </a>
            <button
              type="button"
              onClick={() => onCheckin(venue.id)}
              className="flex items-center justify-center gap-1.5 py-2.5 text-sm font-semibold transition-colors"
              style={{
                background: checkedIn ? "var(--color-cream)" : "var(--color-line)",
                color: checkedIn ? "var(--color-forest)" : "var(--color-ink)",
                border: checkedIn ? "1px solid var(--color-forest)" : "var(--border-thin)",
                fontFamily: "var(--font-ui)",
              }}
            >
              {checkedIn ? "✓ J'y suis !" : "📍 J'y suis"}
            </button>
          </div>

          {/* Territory section */}
          {territory.length > 0 && (
            <div className="mt-5 pt-4" style={{ borderTop: "var(--border-thin)" }}>
              <div className="mb-2 flex items-center gap-2">
                <p
                  className="text-xs font-semibold uppercase tracking-wide"
                  style={{ color: "var(--color-muted)", fontFamily: "var(--font-ui)" }}
                >
                  Territoire
                </p>
                {owner && (
                  <span
                    className="px-2 py-0.5 text-[10px] font-bold"
                    style={{ background: owner.club.color, color: "#fff" }}
                  >
                    {owner.club.logo} {owner.club.shortName}
                  </span>
                )}
              </div>

              {owner && (
                <div
                  className="mb-3 flex items-center gap-3 p-3"
                  style={{ background: owner.club.color + "18", border: `1.5px solid ${owner.club.color}55` }}
                >
                  <span className="text-2xl">{owner.club.logo}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate" style={{ fontFamily: "var(--font-display)", color: owner.club.color }}>
                      {owner.club.name}
                    </p>
                    <p className="text-[11px]" style={{ color: "var(--color-muted)" }}>
                      {owner.wins} victoire{owner.wins > 1 ? "s" : ""} · {owner.club.city}
                    </p>
                  </div>
                  <div
                    className="flex h-8 w-8 items-center justify-center text-xs font-bold"
                    style={{ background: owner.club.color, color: "#fff" }}
                  >
                    👑
                  </div>
                </div>
              )}

              {territory.length > 1 && (
                <ul className="space-y-1.5">
                  {territory.map((entry, i) => {
                    const total = territory[0].wins;
                    const pct = Math.round((entry.wins / total) * 100);
                    return (
                      <li key={entry.clubId} className="flex items-center gap-2">
                        <span
                          className="w-4 text-center text-[10px] font-bold tabular-nums"
                          style={{ color: "var(--color-muted)" }}
                        >
                          {i + 1}
                        </span>
                        <span className="text-base leading-none">{entry.club.logo}</span>
                        <span className="w-16 truncate text-[11px] font-medium">{entry.club.shortName}</span>
                        <div
                          className="flex-1 overflow-hidden"
                          style={{ height: 4, background: "var(--color-line)" }}
                        >
                          <div
                            className="h-full transition-all"
                            style={{ width: `${pct}%`, background: entry.club.color }}
                          />
                        </div>
                        <span
                          className="w-8 text-right text-[10px] font-semibold tabular-nums"
                          style={{ color: "var(--color-muted)" }}
                        >
                          {entry.wins}V
                        </span>
                      </li>
                    );
                  })}
                </ul>
              )}

              <p
                className="mt-2 text-[10px] leading-tight"
                style={{ color: "var(--color-muted)" }}
              >
                Le club qui cumule le plus de victoires sur cette table en devient propriétaire. Les victoires s'additionnent chaque jour pour tous les membres du club.
              </p>
            </div>
          )}

          {/* Reviews section */}
          <div className="mt-5 pt-4" style={{ borderTop: "var(--border-thin)" }}>
            <div className="mb-3 flex items-center justify-between">
              <p
                className="text-xs font-semibold uppercase tracking-wide"
                style={{ color: "var(--color-muted)", fontFamily: "var(--font-ui)" }}
              >
                Avis ({reviews.length})
              </p>
              {!submittedReview && (
                <button
                  type="button"
                  onClick={() => setShowReviewForm((v) => !v)}
                  className="text-xs font-semibold"
                  style={{ color: "var(--color-forest)" }}
                >
                  {showReviewForm ? "Annuler" : "+ Laisser un avis"}
                </button>
              )}
            </div>

            {/* Criteria summary */}
            {reviews.length > 0 && (
              <CriteriaSummary reviews={reviews} />
            )}

            {/* Write review form */}
            {showReviewForm && (
              <div className="mb-4 p-3" style={{ background: "var(--color-cream)", border: "var(--border-thin)" }}>
                <p className="mb-2 text-xs font-semibold">Note globale</p>
                <StarInput value={reviewRating} onChange={setReviewRating} size="lg" />

                <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2">
                  {[
                    { label: "Tables", value: ratingTables, set: setRatingTables },
                    { label: "Ambiance", value: ratingAmbiance, set: setRatingAmbiance },
                    { label: "Propreté", value: ratingClean, set: setRatingClean },
                    { label: "Accès", value: ratingAccess, set: setRatingAccess },
                  ].map(({ label, value, set }) => (
                    <div key={label}>
                      <p className="mb-0.5 text-[10px]" style={{ color: "var(--color-muted)" }}>{label}</p>
                      <StarInput value={value} onChange={set} size="sm" />
                    </div>
                  ))}
                </div>

                <div className="mt-3">
                  <textarea
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    maxLength={500}
                    rows={3}
                    placeholder="Décrivez votre expérience… (10–500 caractères)"
                    className="w-full resize-none px-3 py-2 text-xs outline-none"
                    style={{
                      background: "var(--color-bg)",
                      border: "var(--border-thin)",
                      fontFamily: "var(--font-ui)",
                    }}
                  />
                  <p className="mt-0.5 text-right text-[10px]" style={{ color: "var(--color-muted)" }}>
                    {reviewComment.length}/500
                  </p>
                </div>

                {reviewError && (
                  <p className="mt-1 text-[11px]" style={{ color: "var(--color-red)" }}>{reviewError}</p>
                )}

                <button
                  type="button"
                  onClick={submitReview}
                  className="mt-2 w-full py-2 text-xs font-semibold text-white"
                  style={{ background: "var(--color-forest)", fontFamily: "var(--font-ui)" }}
                >
                  Publier l'avis
                </button>
              </div>
            )}

            {submittedReview && (
              <div
                className="mb-3 flex items-center gap-2 px-3 py-2.5 text-xs"
                style={{ background: "var(--color-cream)", border: "1px solid var(--color-forest)", color: "var(--color-forest)" }}
              >
                <span>✓</span> Avis soumis — merci ! Il apparaîtra après modération.
              </div>
            )}

            {/* Reviews list */}
            {reviews.length === 0 ? (
              <p className="py-4 text-center text-xs" style={{ color: "var(--color-muted)" }}>
                Aucun avis pour l'instant. Soyez le premier !
              </p>
            ) : (
              <ul className="space-y-3 pb-4">
                {reviews.slice(0, 3).map((r) => (
                  <li
                    key={r.id}
                    className="p-3"
                    style={{ background: "var(--color-cream)", border: "var(--border-thin)" }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{r.authorEmoji}</span>
                      <div className="flex-1">
                        <p className="text-[11px] font-semibold">{r.authorName}</p>
                        <p className="text-[10px]" style={{ color: "var(--color-muted)" }}>
                          {timeAgo(r.createdAt)}
                        </p>
                      </div>
                      <StarDisplay rating={r.rating} />
                    </div>
                    <p className="mt-1.5 text-xs leading-relaxed" style={{ color: "var(--color-ink)" }}>
                      {r.comment}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StarDisplay({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return (
    <span className="text-xs leading-none" style={{ color: "var(--color-gold)" }}>
      {"★".repeat(full)}
      {half ? "½" : ""}
      {"☆".repeat(5 - full - (half ? 1 : 0))}
    </span>
  );
}

function StarInput({
  value,
  onChange,
  size = "lg",
}: {
  value: number;
  onChange: (n: number) => void;
  size?: "lg" | "sm";
}) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          className={`transition-transform hover:scale-110 ${size === "lg" ? "text-xl" : "text-sm"}`}
        >
          {n <= (hover || value) ? "⭐" : "☆"}
        </button>
      ))}
    </div>
  );
}

function CriteriaSummary({ reviews }: { reviews: VenueReview[] }) {
  const avg = (key: keyof VenueReview) =>
    reviews.reduce((s, r) => s + (r[key] as number), 0) / reviews.length;

  const criteria = [
    { label: "Tables", value: avg("tables") },
    { label: "Ambiance", value: avg("ambiance") },
    { label: "Propreté", value: avg("cleanliness") },
    { label: "Accès", value: avg("accessibility") },
  ];

  return (
    <div className="mb-3 grid grid-cols-2 gap-x-4 gap-y-1.5 p-3" style={{ background: "var(--color-cream)", border: "var(--border-thin)" }}>
      {criteria.map(({ label, value }) => (
        <div key={label} className="flex items-center gap-2">
          <span className="w-14 text-[10px]" style={{ color: "var(--color-muted)" }}>{label}</span>
          <div className="flex-1 overflow-hidden" style={{ height: 5, background: "var(--color-line)" }}>
            <div
              className="h-full"
              style={{ width: `${(value / 5) * 100}%`, background: "var(--color-forest)" }}
            />
          </div>
          <span className="w-5 text-right text-[10px] font-semibold tabular-nums">
            {value.toFixed(1)}
          </span>
        </div>
      ))}
    </div>
  );
}

function TypeBadge({ type }: { type: Venue["type"] }) {
  const map = {
    club:   { label: "Club",   bg: "var(--color-forest)", color: "#fff" },
    public: { label: "Public", bg: "var(--color-line)",   color: "var(--color-ink)" },
    bar:    { label: "Bar",    bg: "var(--color-gold)",   color: "var(--color-ink)" },
  };
  const { label, bg, color } = map[type];
  return (
    <span
      className="px-2 py-0.5 text-[10px] font-semibold"
      style={{ background: bg, color }}
    >
      {label}
    </span>
  );
}

function SurfaceBadge({ surface }: { surface: Venue["surface"] }) {
  return (
    <span
      className="px-2 py-0.5 text-[10px] font-semibold"
      style={{ background: "var(--color-line)", color: "var(--color-ink)" }}
    >
      {surface === "indoor" ? "🏢 Intérieur" : "🌳 Extérieur"}
    </span>
  );
}

function PricingBadge({ pricing, priceInfo }: { pricing: Venue["pricing"]; priceInfo?: string }) {
  const map = {
    free:       { label: "Gratuit",              bg: "var(--color-forest)", color: "#fff" },
    paid:       { label: priceInfo ?? "Payant",  bg: "var(--color-line)",   color: "var(--color-ink)" },
    membership: { label: priceInfo ?? "Licence", bg: "var(--color-line)",   color: "var(--color-ink)" },
  };
  const { label, bg, color } = map[pricing];
  return (
    <span
      className="px-2.5 py-0.5 text-[11px] font-semibold"
      style={{ background: bg, color }}
    >
      {label}
    </span>
  );
}
