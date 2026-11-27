# 22 — Agent Handover (session-to-session continuation)

Purpose: any new GAME chat session starts here with full context and zero archaeology. The owner pastes the starter prompt (bottom of this file); the new session reads this file and executes the FIRST TASK. Update this file at the end of any session that changes "current state" or the first task.

## Standing entry points (read in order)
1. `AGENTS.md` (repo rules) → 2. `PROJECT_CONTEXT.md` (mission + hard rules) → 3. `docs/NOW.md` (top entry = latest session) → 4. this file's **FIRST TASK**.

## Current snapshot (2026-11-27, after session 21)
- **Game repo:** `github.com/gabortardos/last-orbit-game-glm-style` — local `/Users/gabortardos/Desktop/Last orbit game - glm`, HEAD = session-21 (D-048 + imports #2/#3 + wiring begun). Engine untouched since session 18 (112/112 tests + typecheck ×3 remain valid). `apps/hotseat/public/visual/` = **51 runtime-approved assets**: 19 V6 cards (import #1, D-045) + 16 captains + 16 environments (imports #2/#3, QA-G-021 + D-047), all SHA-256-pinned, byte-identical. **Wiring started:** `ui/visualAssets.ts` (typed 18/18 card map + faction maps), V6 faces on hand/pair cards, captain portraits in player panels + fleet picker, `ReviewFooter.tsx` on Setup + GameView (REMOVE AT PRODUCTION FLIP).
- **Visual repo:** our last words are **QA-G-021 — the FINAL approval round: QA-V-043 (six masters EXPORT_PASS; ♃ seam + ♅ level-edge resolved; ☿ 745×1000 exception approved) + QA-V-044 (assembly APPROVED) + QA-V-045 (corrections PASS; ☿ sealed conduits meet the mandatory; mattes clean at native) + 48px pairs CERTIFIED with the glyph+name mitigation (art-only NOT certified standalone). ZERO visual blockers; NO further requests — the visual lane for v1 is CLOSED.** Manifest v0.32: 32 assets flipped `runtime_approved` (51 total). **Next mailbox number: QA-G-022.**

## FIRST TASK next session — integrated QA + release prep (all remaining gates are GAME/owner lane)
Context: every visual and rights gate is closed (D-048). The owner's directive: integration wherever possible, next step = **release of v1**. D-047's local-test-before-deploy rule STANDS; footer removal happens only at the production flip.
1. Pull both repos; mailbox check for anything after **QA-G-021 (ours) / QA-V-045 (theirs)**.
2. `npm test` + `npm run typecheck` + build; then mount-audit the built app: all 51 `/visual/*` paths resolve (grep the dist for asset refs; no 404s in a local serve).
3. **Integrated QA pass = VISUAL's `docs/V1_ACCEPTANCE_PROTOCOL.md` (A01–A24, adopted via QA-G-022):** evidence pins first (GAME commit + visual manifest v0.32 + import-log #1–#3), then the live passes — A01 asset integrity, A04 live 48px pair presentation (glyph+name certified pattern), A06–A15 functional, A19–A21 accessibility/consistency/performance. No inferred passes; retest after material changes. Optional authorized polish with APPROVED assets only: env backgrounds into title/codex surfaces.
4. **Owner release acceptance:** local build → owner plays (D-039 M4/M5 gates) → on acceptance, production flip = remove `<ReviewFooter />` (single component + CSS) → rebuild → **owner-PC deploy per `docs/19`** (local test first, always).
5. Post-release lanes stay parked: WebP re-pin (needs encoder), semantic icon inventory docs session, M3 remainder, D-035 passives.

## Image-budget protocol (hard-won, sessions 14–15)
The harness permits roughly **5–10 images per conversation**; beyond that, media is omitted (`[media omitted: invalid or exceeds size limit]`) even at ~84KB. It is **not** the GLM plan quota (calls are unlimited) — it is the conversation context/request size, and it only resets with a **new chat** (or harness compaction). Protocol: fresh session for visual audits · thumbs ≤340px · batches of 2–3 · text work via JSON (cheap) · when omissions start, STOP and continue next session · **never approve unseen art**.

## Commands (regenerate — /tmp does not survive reboots)
```bash
# review copies (from the Drive V6 folder)
cd "$HOME/Library/CloudStorage/GoogleDrive-gardianofthedigitalworld@gmail.com/My Drive/AI/Last Orbit/UI/Card Collection V6 - complete set for joint approval"
for f in *.png; do sips -Z 340 "$f" --out "/tmp/v6thumb/$f"; done

# display copy + hash gate
unzip -p LAST_ORBIT_Card_Collection_V6.zip '*card-data*' > /tmp/card-data-v6.json
python3 /tmp/verify_v6.py   # manifest→Drive SHA-256 gate; recreate from docs/visual-studio pattern if wiped; RESULT must be 0 mismatched
```
`card-data-v6.json` fields: `id, category, rules (=engine, EXACT_ENGINE_EXPORT), displayLead, displayRules, *Status`. Engine text authority: `packages/game-core/src/cards.ts` `CARD_INFO`.

## Standing decisions you must not violate
- **D-042 → D-045 → D-048:** ALL rights and visual gates are CLOSED (owner blanket D-045 for 19 cards; D-047 delegation + QA-G-021 verdicts for the 32 captain/environment assets; imports #1–#3 executed hash-first). EVERY future import still requires hash verification + an import-log row — that gate is permanent. **D-048:** integration unblocked by owner directive; release gates = GAME integrated QA → owner acceptance → footer removal at production flip; D-047's local-test-before-deploy rule stands. **D-046:** satisfied and closed by QA-G-021. **D-047:** publish note delivered (QA-G-021); the GLM 5.4 switch is no longer a blocking gate (D-048).
- **D-043:** galaxy seed — online seeds are server-owned, never client-settable; hotseat/solo keep the shareable deal code.
- **D-044:** v1.0 = "Classic complete" (cards + UI polish); cinematic/animation = v2 lane; 3D backdrop is an optional toggle, not a v1 gate.
- **Engine purity:** no `Math.random`/`Date.now` in `game-core`; any rules change = decision-log entry + matching docs in the same commit.
- **Mailbox protocol:** append-only entries (next number **QA-G-020**); pull before writing; on conflict, resolve keeping their entries first then re-append ours (session 19 hit FOUR live races — fetch, rebase, keep-theirs-then-ours); never overwrite their entries. Large entries: stage via the editor tool into /tmp files, then a short `cat >>` — a big heredoc through the terminal mangles (sessions 18 AND 19; in 19 a mangled import heredoc never touched the tree — editor-written scripts + short `python3 /tmp/x.py` runs are the reliable pattern).
- Conventional commits · `docs/NOW.md` every session · AI Nexus check at substantial-session start (owner mandate NX-01–05).

## Queue
1. **Integrated QA on the wired app (GAME lane, closure doc):** keyboard/focus walk, rules spot-check, privacy, performance sanity, glyph+name at small sizes → local build → **owner release acceptance**.
2. **Production flip + deploy (on acceptance):** remove `<ReviewFooter />` (single component + CSS), rebuild, **owner-PC deploy per `docs/19`** — local test first, always (D-047 rule stands).
3. **Post-release parking lot (ordered per D-039):** WebP re-pin (new import rows; needs a local encoder) · semantic icon inventory (their QA-V-013 ask) · dev visual harness (`LO_ASSET_DIR`) · M3 remainder (Derelict spectator + Final Transmission entry) · M4 RC polish · D-035 passives.

## Owner's starter prompt (paste into the new chat)
> New GAME session. Read AGENTS.md, PROJECT_CONTEXT.md, docs/NOW.md (top entry) and docs/22-agent-handover.md, then execute its FIRST TASK (QA-V-043 fidelity pass + pair-tests + corrections verification + publish note per D-047; V6 wiring only after the GLM 5.4 switch). Report in plain words.
