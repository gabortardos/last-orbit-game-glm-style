# 22 — Agent Handover (session-to-session continuation)

Purpose: any new GAME chat session starts here with full context and zero archaeology. The owner pastes the starter prompt (bottom of this file); the new session reads this file and executes the FIRST TASK. Update this file at the end of any session that changes "current state" or the first task.

## Standing entry points (read in order)
1. `AGENTS.md` (repo rules) → 2. `PROJECT_CONTEXT.md` (mission + hard rules) → 3. `docs/NOW.md` (top entry = latest session) → 4. this file's **FIRST TASK**.

## Current snapshot (2026-11-27, after session 21)
- **Game repo:** `github.com/gabortardos/last-orbit-game-glm-style` — local `/Users/gabortardos/Desktop/Last orbit game - glm`, HEAD = session-22 (V1 wiring sprint complete). Engine untouched since session 18 (112/112 tests + typecheck ×3 green). `apps/hotseat/public/visual/` = **51 runtime-approved assets** (19 V6 cards + 16 captains + 16 environments), all SHA-256-pinned. **EVERY approved surface is wired:** hand/pair cards, HUD draw+discard piles (V6 back + live top card), draw reveal, reaction window (faces + captain avatars), scan/deep/scrap reveals, give/storm/snag choice hands, handoff gate, game-over ceremony (winner portrait + homeworld backdrop), Codex (portraits + backdrops ×8), Briefing card reference, Setup homeworlds hero strip, fleet picker portraits, `ReviewFooter` on Setup + GameView (**REMOVE AT PRODUCTION FLIP**). Keyboard/focus: Esc closes Briefing/Codex, focus returns to opener, `:focus-visible` outlines.
- **Visual repo:** our last words are **QA-G-022** (on their `3323bb9`): QA-V-046 release-prep suite acknowledged + **A01–A24 acceptance protocol adopted**; QA-G-021 = the FINAL approval round (QA-V-043/044/045 ALL APPROVED, 48px pairs certified with glyph+name). ZERO visual blockers; visual lane CLOSED. Manifest v0.32: 51 runtime-approved. **Next mailbox number: QA-G-023.**

## FIRST TASK next session — owner local check → acceptance → production flip → deploy
Context: V1 development is COMPLETE (sessions 21–22: all approvals closed, 51 assets imported, every approved surface wired, 112/112 tests, build green). The only remaining gate is the owner playing the wired build locally and accepting it.
1. Pull both repos; mailbox check for anything after **QA-G-022 (ours) / QA-V-046 (theirs)**.
2. **Support the owner's local check:** `npm run dev` (or build + serve `apps/hotseat/dist`). If anything visual is off, fix UI-only (approved assets only — no new scope, no engine changes).
3. **On owner acceptance → production flip:** remove `<ReviewFooter />` from `Setup.tsx` and `GameView.tsx` (2 lines) + the `.review-footer` CSS block → typecheck + test + build → **owner-PC deploy per `docs/19`** (local test first, always — D-047 rule).
4. Optional evidence: run VISUAL's `docs/V1_ACCEPTANCE_PROTOCOL.md` A01–A24 against the final build and record PASS/FAIL per case (the formal release evidence matrix).
5. Post-release parking lot (ordered per D-039): WebP re-pin (needs encoder) · semantic icon inventory · online-lobby portrait chips · dev visual harness · M3 remainder · D-035 passives.

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
1. **Owner local check of the wired build → acceptance** (the only remaining gate): `npm run dev` → play → accept.
2. **Production flip + deploy (on acceptance):** remove `<ReviewFooter />` (2 lines + CSS), rebuild, **owner-PC deploy per `docs/19`** — local test first, always.
3. **Post-release parking lot (ordered per D-039):** A01–A24 formal evidence run · WebP re-pin (needs encoder) · semantic icon inventory · online-lobby portrait chips · dev visual harness (`LO_ASSET_DIR`) · M3 remainder (Derelict spectator + Final Transmission entry) · M4 RC polish · D-035 passives.

## Owner's starter prompt (paste into the new chat)
> New GAME session. Read AGENTS.md, PROJECT_CONTEXT.md, docs/NOW.md (top entry) and docs/22-agent-handover.md, then execute its FIRST TASK (QA-V-043 fidelity pass + pair-tests + corrections verification + publish note per D-047; V6 wiring only after the GLM 5.4 switch). Report in plain words.
