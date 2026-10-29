# 08 — Playtest Plan: first five sessions (v0.2, 2026-10-25)

Instrument: `apps/hotseat` (auto-logs metrics; export JSON per match) OR the printable paper deck in `docs/16-playtest-kit.md`. Both acceptable; digital preferred (accurate metrics). Zero-prep facilitation (teach-in script, observation sheet, paper rulings): `docs/16`.

## PT-01 — Vanilla core, 3 players (gate: is the loop fun?)

- **Hypothesis:** the core loop (play→draw, ruptures, reinsertion) is fun with ZERO modules.
- **Excluded:** Sun Fury, Derelicts, factions, combos beyond component pairs.
- **Deck:** v0.3 core (46 actions, modules off — D-026; matches the app's toggles-off config and the sim's vanilla rows). **Duration target:** 8–15 min.
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

## PT-F1 — Faction pretest, solo vs AI (gate: does each power earn its seat?)

- **Hypothesis:** a once-per-match free redirect gives Mercury real identity (tempo–dodge) without new complexity; bait-out counterplay and the public spent state keep it fair.
- **Instrument (D-029):** the app, solo vs AI, human seat = ☿ Mercury (Setup → fleet picker), 3 captains, 2–3 matches. Watch: did the power fire? strong-but-baitable or dull? did it ever confuse anyone? did the ready/spent chip stay legible?
- **Pass:** fires on average ≥ once per match, no "too strong" read, no rules confusion → keep Flare Skip and draft the next civilization. **Too strong or dull:** switch to the drafted fallback **"Slingshot Start"** (once per match, at your turn's start draw 2 then discard 1) and re-run.
- **Scope widened (D-031):** the same instrument now covers all four powers — run it once per faction (☿ ♀ ♂ ♃), mixing AI factions into the other seats so powers are also *felt from the receiving end* (a ♀ flipping your tribute, a ♃ roaring a storm at you). Extra watch items: ♂ did the discard picker read as "free" or did players fear the 📡? ♃ did anyone try to chain-shout (the engine refuses — did the refusal teach the rule)?
- Sequencing note: per Gábor's directive this pretest runs **in parallel** with the pending vanilla gates — PT-01/02 still validate the core game, and faction *playtests* still wait for them.

## Recording

Every session appends to `09-playtest-log.md` (template there) same day. Metrics JSON exports archived under `docs/balance/raw/` (add folder when first export exists). Decisions flowing from tests go to `11-decision-log.md`.

## Subjective question set (ask verbatim, 1–5, plus one free-text "funniest moment")

Fun · Tension · Clarity · Agency · Humour · Would-replay · (PT-04 only) Fun-after-elimination.
