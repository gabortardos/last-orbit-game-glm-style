# 10 — Balance Findings

Home of simulation results and their interpretation. Human playtest numbers live in `09-playtest-log.md`; decisions triggered here go to `11-decision-log.md`.

## Simulation reports

- [`balance/sim-report-v0.2.md`](balance/sim-report-v0.2.md) — session 1 baseline (18,000 games: 2/3/4/5 players × module configs × random/greedy bots).

## Open balance questions (from ledger & catalogue)

1. Salvage ×2 — contested or oppressive? (usage + win-correlation)
2. Scan ×4 hoarding — are scans played or hoarded to death?
3. Flyby debt cap 6 — ever reached? chain lengths felt?
4. Sun Fury pacing — distribution of final Fury; depth-5 endings "fair"?
5. Boarding vs Component pairs — overlapping roles?
6. 2-player viability — length & fun proxies.
7. Seat advantage — win rate by seat index.

## Findings

### Session 1 (2026-10-25) — baseline v0.2, 16,500 bot games

**Verdict: baseline is healthy → proceed to human playtests (PT-01/PT-02).** Key numbers & reads:

1. **Match length** — median 29–40 turns ≈ 10–13 min at 20s/turn; p90 ≤ 45 turns. Inside the 10–20 min target at every player count. 2p ≈ 13 min is acceptable for now; re-check after PT-05.
2. **Sun Fury works as designed** — it *shortens* matches slightly (4p median 33.2 → 32.9) while ending them hot (final Fury mean 3.8 (2p) → 4.9 (5p)). Watch item for PT-03: Fury ≥ 4 in 85–99% of 3–5p games — if humans call it unfair, candidate dials are gentler depths (12/8/6/4) or Fury rising only on *consecutive* containments.
3. **Derelicts cost nothing and meddle plenty** — no match-length inflation (5p: 29.3 → 28.9 median); Final Transmissions actually fire (0.4/game at 3p → 1.3/game at 5p); override volume grows ~+1/game at 5p. Downtime ≈ 5 turns ≈ 1.5 min — under the 2-min bar even without the module.
4. **Seat balance** — every config within ~1pp of 1/N ✔. No first-seat or last-seat advantage.
5. **Comebacks** — 34–41% at 3–5p ✔ healthy. *Metric caveat:* the 2p comeback flag is structurally 0% (a 2p match has exactly one elimination event — the final one). Replace with a 2p-specific proxy in the next sim revision (e.g., winner held zero Containments at some point).
6. **Pass-turn rate ~72%** — expected for bots (random policy draws most turns; it is a floor, not a ceiling for interaction density). Human watch item for PT-01: if humans also turtle ("play nothing & pray"), consider incentives — deliberately not in v0.2.
7. **Chains** — tallest override stack observed: 6; flyby debt peak: 4 (cap 6 never hit). The drama exists; the caps have headroom.
8. **Card usage** (plays/game): Override 3.6 · Scan 2.8 · Requisition 2.7 · Components ≈ 2.3 · Burn 1.1 · Flyby 1.0 · Slingshot 0.7 · Reversal 0.5 · **Salvage 0.5 — unmeasured for humans**: the greedy bot never plays Salvage and random rarely does. Question Q1 (Salvage power) stays open for PT-01.
9. **E-1 reshuffle never triggered** in 16,500 games — the rule is theoretical safety, keep it (it costs nothing).

**Bot caveats (numbers are a floor):** greedy has same-turn scan memory only, never salvages, requisitions only at 6+ cards; random plays an action ~30% of turns. Improve policies in P2 if sim-driven tuning becomes necessary.

## v0.3 expansion sim gate (2026-10-25, `sim-report-v0.3.md`)

All four candidates in (D-015 A+B, D-016 C, D-018 D) + bots that use them (greedy: deflects when targeted, surge/snag the biggest hand, scraps lone Components; random: 30% deflect/override).

**Gate result: PASS after one prescribed trim (D-019).** The full menu first pushed match length past the doc-15 warning line (2p 15.3 min, 3p 14.7); applied the pre-agreed substitution −1 🔭 Scan + −1 🌀 Slingshot (46 action cards → 55 total at 4 captains):

| Config (median turns) | v0.2 | v0.3 full menu | v0.3 trimmed |
|---|---|---|---|
| 2p vanilla | 40 (13.3 min) | 46 (15.3) | **44 (14.7)** |
| 3p vanilla | 36 (12.0) | 44 (14.7) | **42 (14.0)** |
| 4p vanilla | 33 (11.0) | 41 (13.7) | **39 (13.0)** |
| 5p vanilla | 29 (9.7) | 37 (12.3) | **35 (11.7)** |
| 4p Fury+Derelicts | 33 (11.0) | 40 (13.3) | **38 (12.7)** |

New-mechanic health checks (trimmed run, all configs):
1. **Escalation is real but bounded** — ~0.9–1.1 deflections/game; tallest chain observed: 2 hops (only 2 Deflectors exist — cap 3 has headroom); 2p "bounce-back" tennis works (deflections/game 1.1 — the 2p max is 1 per chain).
2. **Destruction economy active** — ⚡ Ion Surge lands ~1.2–1.3 forced discards/game; contained-count drops slightly (4p vanilla 7904 → 7105) because random jettisons sometimes destroy 🛡️ from hands — the squeeze tightens late-game. Intended, watch in PT-01.
3. **Components got a floor** — bots scrap ~4/game (info-only, no card advantage); lone-Component dead weight is gone.
4. **Pass-turn rate 72% → 68%** — bots have more worth doing; human read pending PT-01.
5. **Comebacks 34–41% → 37–43%** — slightly up (destruction creates underdog moments). Seats stay uniform (max seat share within ~1pp of 1/N everywhere) ✔.
6. **Match length is the cost of content** — +6–8 median turns vs v0.2 at every count, still inside the 10–20 min band; 2p at 14.7 min stays on the watch-list (already flagged as the weakest count).

**Verdict: v0.3 ships to solo-vs-AI round 5, then PT-01.**

