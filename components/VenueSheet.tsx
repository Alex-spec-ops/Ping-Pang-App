"use client";

import { useState } from "react";
import type { Venue, VenueReview } from "../lib/venues";
import { moderateReview } from "../lib/venues";
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
        className="fixed bottom-0 left-0 right-0 z-50 mx-auto max-w-md overflow-y-auto rounded-t-2xl bg-white shadow-2xl transition-transform duration-300 ease-out dark:bg-zinc-950"
        style={{
          maxHeight: "88vh",
          transform: isOpen ? "translateY(0)" : "translateY(110%)",
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
      >
        {/* Drag handle */}
        <div className="sticky top-0 z-10 flex justify-center bg-white pt-3 pb-1 dark:bg-zinc-950">
          <div className="h-1 w-10 rounded-full bg-zinc-300 dark:bg-zinc-700" />
        </div>

        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-20 grid h-8 w-8 place-items-center rounded-full bg-zinc-100 text-sm text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300"
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
              <h2 className="text-lg font-bold">{venue.name}</h2>
              <p className="text-xs text-zinc-500">📍 {venue.address}</p>
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
            <span className="text-xs text-zinc-500">
              {venue.reviewCount} avis
            </span>
            <span className="ml-auto text-xs text-zinc-500">
              🏓 {venue.tables} table{venue.tables > 1 ? "s" : ""}
            </span>
          </div>

          {/* Tags */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            <PricingBadge pricing={venue.pricing} priceInfo={venue.priceInfo} />
            {venue.tags.map((t) => (
              <span
                key={t}
                className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-[11px] text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
              >
                {t}
              </span>
            ))}
          </div>

          {/* Description */}
          <p className="mt-3 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
            {venue.description}
          </p>

          {/* Horaires */}
          <div className="mt-4">
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Horaires
            </p>
            <div className="space-y-1 rounded-xl bg-zinc-50 px-3 py-2.5 dark:bg-zinc-900">
              {venue.hours.map((h) => (
                <div key={h.days} className="flex justify-between text-xs">
                  <span className="text-zinc-600 dark:text-zinc-400">{h.days}</span>
                  <span className={`font-medium ${h.time === "Fermé" ? "text-rose-500" : ""}`}>
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
              className="flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 py-2.5 text-sm font-semibold text-white"
            >
              🗺 Itinéraire
            </a>
            <button
              type="button"
              onClick={() => onCheckin(venue.id)}
              className={`flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-sm font-semibold transition-colors ${
                checkedIn
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                  : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-200"
              }`}
            >
              {checkedIn ? "✓ J'y suis !" : "📍 J'y suis"}
            </button>
          </div>

          {/* Reviews section */}
          <div className="mt-5 border-t border-zinc-100 pt-4 dark:border-zinc-800">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                Avis ({reviews.length})
              </p>
              {!submittedReview && (
                <button
                  type="button"
                  onClick={() => setShowReviewForm((v) => !v)}
                  className="text-xs font-semibold text-emerald-600 dark:text-emerald-400"
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
              <div className="mb-4 rounded-xl bg-zinc-50 p-3 ring-1 ring-zinc-200 dark:bg-zinc-900 dark:ring-zinc-700">
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
                      <p className="mb-0.5 text-[10px] text-zinc-500">{label}</p>
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
                    className="w-full resize-none rounded-lg bg-white px-3 py-2 text-xs ring-1 ring-zinc-200 outline-none focus:ring-emerald-400 dark:bg-zinc-800 dark:ring-zinc-700"
                  />
                  <p className="mt-0.5 text-right text-[10px] text-zinc-400">
                    {reviewComment.length}/500
                  </p>
                </div>

                {reviewError && (
                  <p className="mt-1 text-[11px] text-rose-600">{reviewError}</p>
                )}

                <button
                  type="button"
                  onClick={submitReview}
                  className="mt-2 w-full rounded-lg bg-emerald-600 py-2 text-xs font-semibold text-white"
                >
                  Publier l'avis
                </button>
              </div>
            )}

            {submittedReview && (
              <div className="mb-3 flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2.5 text-xs text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300">
                <span>✓</span> Avis soumis — merci ! Il apparaîtra après modération.
              </div>
            )}

            {/* Reviews list */}
            {reviews.length === 0 ? (
              <p className="py-4 text-center text-xs text-zinc-400">
                Aucun avis pour l'instant. Soyez le premier !
              </p>
            ) : (
              <ul className="space-y-3 pb-4">
                {reviews.slice(0, 3).map((r) => (
                  <li
                    key={r.id}
                    className="rounded-xl bg-zinc-50 p-3 dark:bg-zinc-900"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{r.authorEmoji}</span>
                      <div className="flex-1">
                        <p className="text-[11px] font-semibold">{r.authorName}</p>
                        <p className="text-[10px] text-zinc-400">
                          {timeAgo(r.createdAt)}
                        </p>
                      </div>
                      <StarDisplay rating={r.rating} />
                    </div>
                    <p className="mt-1.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
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
    <span className="text-xs leading-none">
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
    <div className="mb-3 grid grid-cols-2 gap-x-4 gap-y-1.5 rounded-xl bg-zinc-50 p-3 dark:bg-zinc-900">
      {criteria.map(({ label, value }) => (
        <div key={label} className="flex items-center gap-2">
          <span className="w-14 text-[10px] text-zinc-500">{label}</span>
          <div className="flex-1 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700" style={{ height: 5 }}>
            <div
              className="h-full rounded-full bg-emerald-500"
              style={{ width: `${(value / 5) * 100}%` }}
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
    club:   { label: "Club", cls: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400" },
    public: { label: "Public", cls: "bg-sky-100 text-sky-700 dark:bg-sky-950/40 dark:text-sky-400" },
    bar:    { label: "Bar", cls: "bg-violet-100 text-violet-700 dark:bg-violet-950/40 dark:text-violet-400" },
  };
  const { label, cls } = map[type];
  return <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${cls}`}>{label}</span>;
}

function SurfaceBadge({ surface }: { surface: Venue["surface"] }) {
  return (
    <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-semibold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
      {surface === "indoor" ? "🏢 Intérieur" : "🌳 Extérieur"}
    </span>
  );
}

function PricingBadge({ pricing, priceInfo }: { pricing: Venue["pricing"]; priceInfo?: string }) {
  const map = {
    free:       { label: "Gratuit",   cls: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400" },
    paid:       { label: priceInfo ?? "Payant",  cls: "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400" },
    membership: { label: priceInfo ?? "Licence", cls: "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400" },
  };
  const { label, cls } = map[pricing];
  return <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${cls}`}>{label}</span>;
}
