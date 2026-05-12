import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { calculateElo } from "./elo.ts";

describe("calculateElo", () => {
  it("même rating → delta = 16", () => {
    const { delta } = calculateElo(1200, 1200);
    assert.equal(delta, 16);
  });

  it("upset (bas bat haut) → delta élevé (> 16)", () => {
    // 1000 gagne contre 2000 : très inattendu → gros gain
    const { delta } = calculateElo(1000, 2000);
    assert.ok(delta > 16, `delta attendu > 16, obtenu ${delta}`);
  });

  it("favori bat outsider → delta faible (< 16)", () => {
    // 2000 gagne contre 1000 : très attendu → petit gain
    const { delta } = calculateElo(2000, 1000);
    assert.ok(delta < 16, `delta attendu < 16, obtenu ${delta}`);
  });

  it("conservation : points gagnés ≈ points perdus", () => {
    const { delta, newWinner, newLoser } = calculateElo(1200, 1200);
    // Les deux côtés bougent du même delta (hors plancher 100)
    assert.equal(newWinner, 1200 + delta);
    assert.equal(newLoser, 1200 - delta);
  });

  it("plancher à 100 : rating ne descend pas sous 100", () => {
    const { newLoser } = calculateElo(2000, 100);
    assert.ok(newLoser >= 100);
  });
});
