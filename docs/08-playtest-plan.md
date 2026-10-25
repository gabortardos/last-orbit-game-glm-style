# 08 — Playtest Plan: first five sessions (v0.2, 2026-10-25)

Instrument: `apps/hotseat` (auto-logs metrics; export JSON per match) OR paper deck printed from `04-card-catalogue.md`. Both acceptable; digital preferred (accurate metrics).

## PT-01 — Vanilla core, 3 players (gate: is the loop fun?)

- **Hypothesis:** the core loop (play→draw, ruptures, reinsertion) is fun with ZERO modules.
- **Excluded:** Sun Fury, Derelicts, factions, combos beyond component pairs.
- **Deck:** v0.2 (N=3). **Duration target:** 8–15 min.
- **Metrics:** match length; turns/player; first-elimination turn; eliminated downtime; card usage; dead cards; steal/override frequencies; comeback flag.
- **Subjective (1–5):** fun, tension, clarity, agency, humour, "would replay".
- **Pass:** fun ≥4, clarity ≥4, replay ≥4/5 for ≥2 of 3 testers. **Revise:** any metric 3–3.5. **Reject:** fun <3 → core loop redesign (return to ledger).

## PT-02 — Vanilla core, 4–5 players (gate: does it scale?)

- **Hypothesis:** social play scales; downtime acceptable WITHOUT the Derelict module.
- Same exclusions/metrics as PT-01 + per-seat win/loss, attack-target logs.
- **Pass:** downtime median ≤2 min; no "boring elimination" complaint from >1 tester. **If fail:** schedule Derelict module immediately (PT-04 moves up).

## PT-03 — Core + Sun Fury, 3–4 players (gate: signature mechanic)

- **Hypothesis:** Fury escalation raises tension & ending satisfaction without confusion.
- **Metrics:** + Fury reached distribution; reinsert-depth choices; match length delta vs PT-01/02.
- **Pass:** clarity ≥4; "ending felt tense" > "ending felt unfair"; Fury 5 in <25% of matches; length still ≤20 min.

## PT-04 — Core + Derelicts, 4–5 players (gate: downtime fix)

- **Hypothesis:** Final Transmissions keep eliminated players engaged; no serious kingmaking.
- **Metrics:** eliminated-player engagement (did they use/hold transmission?); transmission effect on outcomes; winner's margin.
- **Pass:** eliminated testers rate "stayed fun after elimination" ≥3.5; kingmaking complaints = 0.

## PT-05 — Full package + 2-player deep check (gate: v0.2 freeze)

- **Hypothesis:** all modules + 2p mode = shippable rule set for Phase 3.
- Includes: 2× 2-player, 2× 4–5-player full-package matches; final metrics sweep vs sim predictions.
- **Pass:** all PT-01/03/04 criteria hold together; 2p fun ≥3.5. Then: **freeze v0.2 → open faction design (P2).**

## Recording

Every session appends to `09-playtest-log.md` (template there) same day. Metrics JSON exports archived under `docs/balance/raw/` (add folder when first export exists). Decisions flowing from tests go to `11-decision-log.md`.

## Subjective question set (ask verbatim, 1–5, plus one free-text "funniest moment")

Fun · Tension · Clarity · Agency · Humour · Would-replay · (PT-04 only) Fun-after-elimination.
