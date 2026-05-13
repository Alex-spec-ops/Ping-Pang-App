import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { calculateElo } from "./elo.ts";

describe("calculateElo — K variable par type de match", () => {
  // -----------------------------------------------------------
  // Valeurs K de référence : tournament=48, ranked=32, casual=16
  // -----------------------------------------------------------

  it("ranked, même rating → delta = 16", () => {
    const { delta } = calculateElo(1200, 1200, "ranked");
    assert.equal(delta, 16);
  });

  it("tournament, même rating → delta = 24 (K=48)", () => {
    const { delta } = calculateElo(1200, 1200, "tournament");
    assert.equal(delta, 24);
  });

  it("casual, même rating → delta = 8 (K=16)", () => {
    const { delta } = calculateElo(1200, 1200, "casual");
    assert.equal(delta, 8);
  });

  it("tournament > ranked > casual pour un même scénario", () => {
    const t = calculateElo(1000, 1400, "tournament").delta;
    const r = calculateElo(1000, 1400, "ranked").delta;
    const c = calculateElo(1000, 1400, "casual").delta;
    assert.ok(t > r, `tournament (${t}) doit être > ranked (${r})`);
    assert.ok(r > c, `ranked (${r}) doit être > casual (${c})`);
  });

  // -----------------------------------------------------------
  // Différentiel de rating : upset = plus de points
  // -----------------------------------------------------------

  it("upset ranked (bas bat haut) → delta élevé (> 16)", () => {
    const { delta } = calculateElo(1000, 2000, "ranked");
    assert.ok(delta > 16, `delta attendu > 16, obtenu ${delta}`);
  });

  it("favori ranked bat outsider → delta faible (< 16)", () => {
    const { delta } = calculateElo(2000, 1000, "ranked");
    assert.ok(delta < 16, `delta attendu < 16, obtenu ${delta}`);
  });

  it("upset tournament donne plus de points qu'upset ranked", () => {
    const upset_t = calculateElo(1000, 1600, "tournament").delta;
    const upset_r = calculateElo(1000, 1600, "ranked").delta;
    assert.ok(upset_t > upset_r, `tournament (${upset_t}) > ranked (${upset_r})`);
  });

  // -----------------------------------------------------------
  // Conservation et plancher
  // -----------------------------------------------------------

  it("conservation : points gagnés = points perdus (ranked, égalité)", () => {
    const { delta, newWinner, newLoser } = calculateElo(1200, 1200, "ranked");
    assert.equal(newWinner, 1200 + delta);
    assert.equal(newLoser, 1200 - delta);
  });

  it("plancher à 100 : rating ne descend jamais sous 100", () => {
    const { newLoser } = calculateElo(2000, 100, "tournament");
    assert.ok(newLoser >= 100);
  });

  it("type par défaut = ranked", () => {
    const withDefault = calculateElo(1200, 1200);
    const withRanked = calculateElo(1200, 1200, "ranked");
    assert.equal(withDefault.delta, withRanked.delta);
  });
});
