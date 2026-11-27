# 22 — Agent Handover (session-to-session continuation)

Purpose: any new GAME chat session starts here with full context and zero archaeology. The owner pastes the starter prompt (bottom of this file); the new session reads this file and executes the FIRST TASK. Update this file at the end of any session that changes "current state" or the first task.

## Standing entry points (read in order)
1. `AGENTS.md` (repo rules) → 2. `PROJECT_CONTEXT.md` (mission + hard rules) → 3. `docs/NOW.md` (top entry = latest session) → 4. this file's **FIRST TASK**.

## Current snapshot (2026-11-27, after session 18)
- **Game repo:** `github.com/gabortardos/last-orbit-game-glm-style` — local `/Users/gabortardos/Desktop/Last orbit game - glm`, HEAD = session-18 NOW.md + this handover commit, pushed. Tests 112/112, typecheck ×3 green — engine untouched by the last six sessions (docs/server/UI only).
- **Visual repo:** `github.com/gabortardos/last-orbit-visual-studio` — local `/Users/gabortardos/Desktop/last-orbit-visual-studio`, our last words are **QA-G-011 + QA-G-012** (pushed as `68addb4`; their request commits `af4d800`, reviewed base `b8b5739`). **Captain DESIGN review is CLOSED for 6/8** (♀ Venus · 🌍 Earth · ♂ Mars · ♃ Jupiter on the owner-authoritative diptych right panel · ♄ Saturn with the palette correction verified on the binary · ♆ Neptune) and **open for 2**: ☿ Mercury = MANDATORY_FIX (candidate is a beaked upright raptor — restage to the selected low quadrupedal sprinter with a cast-glass visor head, no beak/no mouth; keep the gold sails) and ♅ Uranus = MANDATORY_FIX (jewel-crystal → drafting-instrument vocabulary, keep the one magenta vertical, add level/plumb geometry; 48 px grayscale collides with Saturn) + the B-vs-D pick still NEEDS_VISUAL_REFERENCE (B, D, hoop candidate all unseen). **V1 UI + pictograms fully DESIGN_PASS** (menu · fleet · command deck · reaction window · 62-mark pictogram library) — zero visual blockers; remaining items are integration notes (V4 faces → V6 swaps, text parity, 320 px, timer). Production mandatories recorded: 48 px grayscale pair-tests on finals (♀/♆, ♄/♅), Neptune master re-render (512 px tile source), Jupiter suit articulation preserving the owner's accepted anatomy. Captain canon authority: `apps/hotseat/src/ui/Codex.tsx` sheets + `docs/14`. VISUAL is active — always pull first and check `Q_AND_A.md` for entries after **QA-V-029** (their latest: results fixture + overlays direction, which also await GAME review — see FIRST TASK).
- **Vision:** vision-capable model confirmed (sessions 14–18) — the 19-image V6 audit (session 16) and the 14-image captain/UI pass (session 18) each ran in ONE fresh session within budget, batches of 2–3, zero omissions. The next visual pass (corrected ☿/♅ + B/D pick) still needs a FRESH session.

## FIRST TASK next session — corrected ☿/♅ visual pass (QA-G-013) + results/overlays GAME review (QA-V-027/028/029) + D-042 disposition
Context: QA-G-011 closed captain DESIGN for 6/8 and QA-G-012 passed all five V1 UI/pictogram areas (base @ `b8b5739`, pushed `68addb4`). VISUAL's next deliveries: corrected Mercury + Uranus candidates, Uranus B/D reference sync, then standalone masters + derivatives + hashes. Meanwhile they filed three new GAME-review requests: QA-V-027 (results concept — layout only), QA-V-028 (results implementation fixture), QA-V-029 (overlays direction with mandatory behavior corrections). D-042 (19 per-card license calls) is STILL the only V1 release gate.
1. Pull both repos; check the mailbox for entries after QA-V-029 (theirs) / QA-G-012 (ours); check Drive for corrected ☿/♅ candidates + Uranus B/D refs (hashes first, always).
2. **If the corrected captains + B/D refs landed:** fresh session, image-budget protocol (thumbs ≤340 px, batches of 2–3, STOP when omissions start) → inspect ☿ fix (low quadrupedal sprinter, cast-glass visor head, no beak/mouth, 5° lean, sails) + ♅ fix (drafting-instrument vocabulary, one magenta vertical, level/plumb geometry) + **Uranus B-vs-D pick via the QA-G-010 criteria** → **QA-G-013**. Never approve unseen art.
3. **Results/overlays review (docs + engine-verification lane, no images needed for QA-V-028):** verify QA-V-029's behavior claims against `Overlays.tsx`/`game-core` (no cancel on forced choices · reinsert range dynamic + ends turn · own card faces not backs · Storm Shout = redirect to eligible other captain, no discard, once per match, original drawer only · Scan reveals existing order, never reorders · Tractor exact count incl. duplicates · handoff hides private data until explicit start) and QA-V-028's fixture field list vs the real `GameOverModal` (2–5 seats, Fury 0–5, viewer-specific victory/defeat only when viewer known). Reply per-area DESIGN_PASS / MANDATORY_FIX / NOT_INSPECTED.
4. **D-042 lane:** if Gábor has recorded the 19 license calls, execute the first import (per-asset sign-off + public-distribution license + SHA-256 pin → `docs/visual-studio/import-log.md`) and release VISUAL onto the remaining v1 lanes; if not, ask him (blanket + exceptions is valid). Never assume licenses.
5. Update `docs/NOW.md` (new session entry), commit both repos, push. Report to the owner in plain words.

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
- **D-042:** no visual asset import/publication without the owner's per-item license sign-off; everything review-only until then.
- **D-043:** galaxy seed — online seeds are server-owned, never client-settable; hotseat/solo keep the shareable deal code.
- **D-044:** v1.0 = "Classic complete" (cards + UI polish); cinematic/animation = v2 lane; 3D backdrop is an optional toggle, not a v1 gate.
- **Engine purity:** no `Math.random`/`Date.now` in `game-core`; any rules change = decision-log entry + matching docs in the same commit.
- **Mailbox protocol:** append-only entries (next number **QA-G-013**); pull before writing; on conflict, reset to theirs and re-append — never overwrite their entries. Large entries: stage via the editor tool into /tmp files, then a short `cat >>` — a big heredoc through the terminal mangles (session 18, recovered clean).
- Conventional commits · `docs/NOW.md` every session · AI Nexus check at substantial-session start (owner mandate NX-01–05).

## Queue
1. **Corrected ☿/♅ visual pass + Uranus B/D pick (active — see FIRST TASK, QA-G-013).**
2. **Results/overlays GAME review (QA-V-027/028/029)** — engine-behavior verification vs `Overlays.tsx`/`game-core` + fixture field check; docs + possible small UI-code fixes.
3. First approved import → `docs/visual-studio/import-log.md` (per D-042, once licensed) → release VISUAL onto the non-card v1 lanes (V6 faces into fixtures, footer swap).
4. Semantic icon inventory (their QA-V-013 ask) — one docs session.
5. Dev-only visual harness (`LO_ASSET_DIR`) — real-app screenshots, incl. the 320 px card-legibility pass flagged in QA-G-009.
6. M3 code remainder: Derelict spectator view + Final Transmission entry.
7. M4 RC: galaxy deal-code polish (word-style codes), full gate pass.

## Owner's starter prompt (paste into the new chat)
> New GAME session. Read AGENTS.md, PROJECT_CONTEXT.md, docs/NOW.md (top entry) and docs/22-agent-handover.md, then execute its FIRST TASK (corrected Mercury/Uranus pass + Uranus B/D pick, results/overlays review, D-042 disposition). Report in plain words.
