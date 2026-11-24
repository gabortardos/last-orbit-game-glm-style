# 21 — Release Plan: v1.0 (plan of record)

**Status:** ADOPTED — decision **D-039**. Mandate: Gábor, 2026-10-25 — *"after examining the above questions, and taking care of them, I'd like to proceed towards a release — let's plan that"*; in the same message he approved progressing the 3D vision (**D-038**).
**Date:** 2026-10-25 · Roadmap cross-reference: `docs/13` (P3/P4 annotations) · standing rule unchanged: **the P5 "good game" gate stays the release arbiter.**

## v1.0 scope (frozen by D-039)

**IN:**
- **Players 2–5** — mission envelope (`docs/00`); 8-player deck math kills it for v1.0 (appendix A)
- **Rules v0.3 frozen** — the full pick-(g) package (A+B+C+D, D-019 trim) as implemented; the freeze act = Gábor's in-game 8-power testing + beta round 1
- **All 8 civilizations, active powers** (☿♀♂♃🌍♄♅♆) — opt-in; vanilla seats provably unchanged
- **Modes:** hotseat pass-and-play · solo vs AI · online (rooms, share-links, server bots, timers/autopilot, 30 s reconnect, spectators)
- **Visuals:** rung 1 "living table" (D-038) — animated 3D solar system behind the card glass; glass UI stays as tactical + reduced-motion + low-end mode
- **Onboarding:** Mission Briefing, per-card tooltips, ❓ help, 📖 Codex
- **Hosting:** PC + Cloudflare Tunnel per `docs/19` (0 €/mo) · free to play

**OUT (post-1.0 parking lot, §5):** passives (D-035) · homeworlds + world mode (D-038 rungs 2–3) · Grand Fleet 6–8p · generator platform (P6 / D-037) · monetization (charter: P5) · Explorer technique evaluation (read-only, P5) · final title (P5 polish; "Last Orbit" stays the working title through v1.0).

## Milestones

### M0 — Deploy the beta ⏳ (blocked on Gábor)
- [ ] `git push` go-ahead — local commits on `main` ahead of origin (`d4f2e16`, `ef7252c`, `b0762ca` + later)
- [ ] ~30-min PC session: Node + clone + `npm ci` + build · `cloudflared` install + tunnel · **DNS Part A (email-survival checklist, `docs/19`)** · `play.`/`lastorbit.` hostnames
- [ ] Smoke: two devices, one full online match started from a share-link
- **Exit:** beta URL live; one completed remote match.

### M1 — Friends-and-family beta 🔄 (carries PT-01 3p + PT-02 4–5p, D-034)
- [ ] Gábor tests all 8 powers in-game (solo vs AI is a fine start)
- [ ] Family online sessions — 3p and 4–5p — feedback captured per `docs/08`/`docs/09`
- [ ] Same-session triage loop (as practiced: concrete UX blockers fixed the day they're reported)
- **Exit (= the P5 "good game" gate + v1.0 rules freeze):** full sessions with zero rules arguments · at least one session where the table asks to play again · no blocker-severity issues open → v0.3 rules stamped **v1.0**.

### M2 — Living table, rung 1 (D-038; parallel lane, starts now) 🔄
- [ ] 6 style frames, code-drawn (HTML/CSS/SVG) so they review in the browser: match open · Fury peak · reaction window · rupture draw · endgame · victory
- [ ] three.js + react-three-fiber shell behind the existing card glass; the Sun's state = Fury level; seats = orbiting planets
- [ ] Log events → animated light between orbits (steal = cable, Override = jam wave, rupture = flare, deflection = bouncing beam); animation director = pure `(logEntry, prevState, state)` function (testable headless)
- [ ] Quality presets · reduced-motion → glass-UI fallback
- **Exit (P3 state-readability gate):** a new player can read, at a glance, in the 3D view: whose turn · what was played · who's targeted · Fury level · cards left.

### M3 — Online UX hardening (open P4 item) ⬜
- [ ] Reaction countdown ring · turn-timer display · autopilot notices · reconnect overlay · Derelict spectator view + Final Transmission entry
- **Exit:** beta-hardened — family sessions run without live support.

### M4 — Release candidate ⬜
- [ ] Full pass: tests, typecheck ×3, build, fresh 2×3,000-game sim vs the v1.0 rules baseline
- [ ] Accessibility: reduced motion, contrast, tooltips, mobile pass
- [ ] Sound — minimal SFX pass or silent v1.0 (**Gábor's call, Q3**); PWA (stretch, Q3)
- [ ] Playtest-kit full run (`docs/16`) · known-issues sweep (`docs/12` → empty or documented)
- **Exit:** Gábor's RC sign-off.

### M5 — Launch ⬜
- [ ] `git tag v1.0.0` · rules doc stamped v1.0 · decision-log + NOW entries
- [ ] Announce (blast radius = Q4: family-only soft launch vs wider)
- [ ] Post-launch watch: PC uptime, tunnel health, room-log review after each session
- **Rollback:** `git revert` → PC rebuild → re-tunnel (~15 min, `docs/19`).

## Why no gate is jumped

M2 is UI-only — engine, sim and the 110 tests stay untouched — so the visual lane runs parallel to the beta without diluting the "good game" verdict. If M1's exit criteria aren't met, v1.0 waits (the visuals render any rules). Scope changes to this plan are decision-log entries (D-039 + successors).

## Open questions for Gábor (non-blocking for M0–M2)

- **Q1** Beta host comfort — is "PC on during family sessions" OK? (autopilot + reconnect already cover drops)
- **Q2** Confirm 2–5 for v1.0 (D-039 default; appendix A has the numbers)
- **Q3** Audio — minimal SFX pass in v1.0 or silent launch? PWA stretch?
- **Q4** Launch blast radius — family/friends soft launch, or announce wider immediately?

## Post-1.0 parking lot (priority order, all PROPOSED)

1. **D-035 passives** — needs the family pick (A resistances / B body modifiers / mix) + faction-seated sim + per-civ sign-off (`docs/14` §Passives)
2. **Rung 2 — homeworlds** (Codex → 3D vignettes; faction card art)
3. **Rung 3 — world mode** (play inside the system)
4. **Grand Fleet 6–8p** — trigger: family demand for 6+ seats
5. **Generator platform** (P6, post-P5 by Gábor's own sequencing rule — `docs/18`)
6. Monetization + final title (the P5-polish items that deliberately miss the v1.0 train)

## Appendix A — why 8 players is not in v1.0

The deck is fixed at **51 cards** (46 base + 5 rupture/containment), independent of player count. Eight captains × 5-card hands = 40 dealt → **~11 draw cards left with 7 ruptures among them** — an endgame bloodbath, not a longer game. A "Grand Fleet" 6–8p variant needs a scaled deck recipe (more base cards + containments), cap lifts in engine (`createGame` 2..5) / server room clamp / Setup UI, and a full sim gate (match length, reaction-window length with 7 respondents, Fury pacing). The mission envelope is 2–5 (`docs/00`). Revisit post-1.0 if family tests demand 6+.