# 09 — Playtest Log

Append-only. Never delete entries. One block per session.

## Template

```
### PT-XX — YYYY-MM-DD
- Version: rules vX.X, deck vX, modules: …
- Players: N (names optional), instrument: hotseat app / paper
- Result: winner, turns, length
- Metrics: (paste/export JSON to docs/balance/raw/PT-XX.json)
- Ratings: fun _ tension _ clarity _ agency _ humour _ replay _
- Funniest moment: …
- Observed problems: …
- Flow-up decisions: D-XXX …
```

---

### PT-00 — 2026-10-25 (solo smoke test, designer)
- Version: rules v0.2, deck v1, modules: Sun Fury + Derelicts (defaults)
- Players: 1 (Gábor, all seats), instrument: hotseat app
- Result: not completed — test aborted before meaningful play
- Metrics: none
- Ratings: clarity 1/5 — others untestable
- Funniest moment: n/a
- Observed problems: **critical onboarding gap.** The app drops a brand-new player into Setup/Game with zero context: no premise, no statement of who the players are or what the goal is, no explanation of the rupture/containment core loop, override windows, turn debt, or what any card does and why you'd play it. Direct quote: "I am completely lost, and cannot have a valuable test."
- Follow-up decisions: **D-013** (onboarding layer: Mission Briefing overlay + per-card blurbs + goal reminders in Setup/HUD/handoff gate)

### PT-00 — 2026-10-25, round 2 (solo smoke test, designer; after D-013 fix)
- Version: rules v0.2, deck v1, modules: Sun Fury + Derelicts
- Players: 1 (Gábor, all seats), instrument: hotseat app
- Result: in progress (ongoing testing); three UX requests filed and implemented same day:
  1. **Background music** ("I don't like quiet") → procedural Web-Audio space-ambient loop (drone pad + pentatonic plucks, no assets, nothing to license), auto-starts on first interaction, 🔊/🔇 toggle persisted. Setup + in-game HUD.
  2. **Draw reveal** — the drawing captain must see the drawn card (with its blurb) before the device passes on → new DrawReveal overlay; engine now logs `card` in the draw event (feed still hides it — only the reveal modal shows it).
  3. **Hover info on every card, not just the hand** ("I don't know them all by title") → tooltips added to scan results, requisition give-modal, salvage chooser, and the draw reveal, all from the canonical `CARD_INFO.blurb`.
- Follow-up decisions: none new (D-013 extended in spirit: "blurbs everywhere").

### PT-00 — 2026-10-25, round 3 (solo smoke test, designer; after round-2 fixes)
- Version: rules v0.2, deck v1, modules: Sun Fury + Derelicts
- Players: 1 (Gábor, all seats), instrument: hotseat app
- Result: **limit of the instrument reached** — solo hotseat can't produce real playtest data because the designer controls every seat (no surprise, no genuine override tension). Verdict: "interesting, let's continue."
- Findings & actions:
  1. **Solo vs AI mode built** (D-014): designer plays 1 seat, greedy bots take the rest — real opposition, real override windows you don't control. Bot turns are paced (~1 s) and narrated by the log.
  2. **❄️ Coolant Cell / 🔩 Hull Plating never really used or understood** — pair mechanic unclear until two are held. UI: lone components now show "· find its twin". Structural fix option in doc 15 (Candidate B).
  3. **Designer appetite for more dangers + equal opportunities**, "maintaining integrity and gameplay flow and joy" → sketch written: `docs/15-expansion-v0.3-sketch.md` (D-015 PROPOSED).
- Goal declared for the project: reach friend-testing quality bar. In-person hotseat is already there (PT-01 schedulable); remote friends = online milestone P4.

### PT-00 — 2026-10-25, round 4 (solo vs AI, designer; after D-014)
- Version: rules v0.2, deck v1, modules: Sun Fury + Derelicts
- Players: 1 human + greedy bots, instrument: hotseat app (solo mode)
- Result: completed matches; 6 designer findings + 1 found by us, all addressed in the same session (D-017):
  1. **Override window confusion** ("counteracted, but still had to pass; why can others still react?") — the parity rule is deliberate (every Override **flips** the outcome: even = happens, odd = cancelled; the window reopens for everyone after each Override because their Override could flip it back) but was invisible in the UI. Fix: ReactionOverlay shows the live stack state (✅ will happen / 🚫 cancelled), names the target, and buttons state their effect ("Override — CANCEL it" / "Override — restore it" / "Let it happen" / "Keep it cancelled").
  2. **Targeted attacks must announce the victim** — the engine has required a chosen target since D-002 (Requisition/Boarding/pairs), but the reaction overlay never showed it. Now it does; designer explicitly OK with everyone being allowed to counteract once the target is visible.
  3. **Theft invisibility (found by us, not reported):** steal events were logged private-to-the-thief, so the victim never learned they'd been robbed. Now *who robbed whom* is public; the stolen card's identity stays private (new `steal_card` line for the thief's eyes only).
  4. **Components "zero times I could put them in action"** — fact-checked: deck has 4+4 (≈17%), bots pair-steal ~1.1/game; the real culprit is lone Components being dead weight that bot Requisitions strip first (GIVE_ORDER dumps Components). → Candidate B revised to a lone-Component floor use ("Scrap"), see doc 15.
  5. **Audio "nice start, needs development"** — bed volume lowered 0.16 → 0.10, added slow chord cycle (Am–F–C–G), sub heartbeat pulse, denser plucks, and 11 quiet log-driven stingers (play/override/cancelled/steal/give/flyby/rupture/contained/fury/eliminated/win).
  6. **"Why pass the device vs the AI?" (bug)** — the handoff gate fired on the human's own turn starts in solo mode. Gate is now pass-and-play-only (≥2 human seats); DrawReveal and Requisition-give copy are solo-aware too.
  7. **"What does Fury mean?"** — the HUD tooltip was an unreadable title-attribute. Fury HUD is now a button that opens the Mission Briefing; Setup hint expanded; `fury_up` log lines state the current reinsertion limit ("within the top 15/10/7/5").
- Ratings: deferred to next round (fix-first session).
