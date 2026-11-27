# 22 — Agent Handover (session-to-session continuation)

Purpose: any new GAME chat session starts here with full context and zero archaeology. The owner pastes the starter prompt (bottom of this file); the new session reads this file and executes the FIRST TASK. Update this file at the end of any session that changes "current state" or the first task.

## Standing entry points (read in order)
1. `AGENTS.md` (repo rules) → 2. `PROJECT_CONTEXT.md` (mission + hard rules) → 3. `docs/NOW.md` (top entry = latest session) → 4. this file's **FIRST TASK**.

## Current snapshot (2026-11-27, after session 20)
- **Game repo:** `github.com/gabortardos/last-orbit-game-glm-style` — local `/Users/gabortardos/Desktop/Last orbit game - glm`, HEAD = session-20 + D-047 release-sequence docs, pushed. Engine untouched since session 18 (112/112 tests + typecheck ×3 remain valid). `apps/hotseat/public/visual/` = the 19 approved V6 card assets, byte-identical + SHA-256-pinned (import-log #1, D-045) — UI wiring still NOT started (next session's GO lane).
- **Visual repo:** our last words are **QA-G-020** (pushed at `fbdf558` on top of their `dee0007` after the FIFTH live race — QA-V-042/043 landed mid-review). **Consolidated verdicts delivered:** environments ♃ ♄ ♅ ♆ ♀ DESIGN_PASS + 3 single-mandatories (☿ enclosed cast-glass cooling · 🌍 Moon must read as THE Moon · ♂ no giant planet in Mars's own sky); captains on batch-04: ♀ ♄ EXPORT_PASS · ☿ backdrop-moon mandatory + proposed 745×1000 exception (full-res checks passed: no mouth, glass toes) · 🌍 ♂-Mars conditional + exception proposals · ♃ seams still open · ♅ ♆ native-gate re-render mandated (♅ axis measured 0.83° ✓). Pair-tests ♀/♆ ♄/♅ still uncertified = LAST technical gate. UI implementation **PASS + integration GO** (QA-V-041 verified in real Chrome at desktop+mobile with full mount: zero cancel affordances — QA-G-015 satisfied; guardrails held; canon strings verified; 62 glyphs live; 39/39). **Next mailbox number: QA-G-021.**
- **Mid-review arrivals:** QA-V-042 (crop-only pack 05, recorded fallback) + **QA-V-043 (pack 06: six same-design native re-renders ☿ 🌍 ♂ ♃ ♅ ♆ + unchanged ♀ ♄, 27 members, 23,332,986 bytes, SHA-256 `215c4dcc…c69`)** = exactly the prescribed master-gate fix → FIRST TASK step 2.
- **QA-V-044 (pack 07 — NEWEST, their `8b33fa9`):** full V1 assembly prototype — 323 members, ZIP SHA-256 `1861d7ec…74279`, 18,111,182 bytes, Drive `1cJNMU7…`, manifest v0.30, 119/119 Chromium checks at 5 widths, desktop/mobile contact sheets pinned in the mailbox. NOT the corrections — VISUAL confirms those are "next". Pack-07 review is GATED on the owner's note (D-047 order + image budget). Their "non-card rights gate remains owner-only" note is superseded by the D-047 delegation.
- **Vision budget note:** session 20 ran 21 image inspections with zero omissions (headless-Chrome screenshots included) — but QA-V-043's fidelity pass still deserves a FRESH session per protocol.

## FIRST TASK next session — QA-V-043 fidelity pass + pair-tests + publish note (D-047); wiring only after the GLM 5.4 switch
Context: QA-G-020 verdicts are in; pack 06 (six native re-renders) AND pack 07 (full V1 assembly, QA-V-044) have arrived; VISUAL's QA-G-020 corrections are still in production — the owner will note when they land; clearance is DELEGATED per D-047 (GAME approval = owner approval once everything verifies); imports stay hash-gated + log-gated.
1. Pull both repos; check the mailbox for entries after **QA-V-043 (theirs) / QA-G-020 (ours)**; check Drive/mount for new deliveries (hashes first, always).
2. **QA-V-043 pack 06 fidelity pass → QA-G-021:** hash-verify the ZIP (`215c4dcc…`, 23,332,986 bytes) → fresh-session image pass → judge the six re-renders against the LOCKED references (their own flags to verify hard: ☿ moonlike background + pointed toes remain · 🌍 equipment/framing DRIFT vs approved design · ♃ seams present but suit articulation ambiguous · ♅ level edge "not unequivocal" — a recorded mandatory, it must BE level · ♆ crest retained). Locked originals REMAIN AUTHORITY. Per-master EXPORT_PASS/MANDATORY_FIX.
3. **Pair-tests:** cut 48 px grayscale pairs from pack 06's 512 avatars (♀/♆, ♄/♅) — certify, or prescribe the UI-layer approved-glyph badge. Last technical gate before captain import.
4. **Completeness audit → publish note (D-047, owner-delegated clearance):** when corrections are verified + pair-tests certified, run the audit (mechanical dry-run ALREADY ZERO-GAP: 19 import pins ✓, 18 card IDs ↔ engine `CardKind` ✓, 37 binding glyph refs ✓ — script pattern in NOW.md session-20). Inventory gates: 8 captain masters + derivatives, 8 env masters, footer swap, pack-07 assembly review. If EVERYTHING is green → GAME's approval counts as OWNER approval — note the owner, then STOP: wiring waits for the model switch.
5. **V6 wiring lane (game code) — only AFTER the owner switches the coding model to GLM 5.4 (D-047):** footer swap (REVIEW EDITION), card faces into UI/fixtures from `/visual/<id>.png`, typed semantic bindings per `prototypes/v1-remaining/asset-bindings.json` (123 entries; server rules untouched), keyboard/focus pass, semantic faction-mapping re-check (QA-V-036) → build → **LOCAL test first** → owner-PC deploy only after local checks pass.
6. WebP optimization when an encoder exists (new import rows, never edit row #1). Update `docs/NOW.md`, commit both repos, push, report plainly.

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
- **D-042 → D-045:** the licensing gate is CLOSED for the 19 V6 card assets (owner blanket, 2026-11-27, first import executed). EVERY import still requires hash verification + an import-log row, and anything outside the 19 (captain masters, derivatives, environments) needs its own owner clearance before import. **D-046:** that clearance is owner-sequenced — only after QA-G-021 fidelity verdicts + certified pair-tests. **D-047 (supersedes the ask):** GAME's full verification pass + completeness audit = owner approval to publish; wiring waits for the GLM 5.4 switch; local test precedes any owner-PC deploy.
- **D-043:** galaxy seed — online seeds are server-owned, never client-settable; hotseat/solo keep the shareable deal code.
- **D-044:** v1.0 = "Classic complete" (cards + UI polish); cinematic/animation = v2 lane; 3D backdrop is an optional toggle, not a v1 gate.
- **Engine purity:** no `Math.random`/`Date.now` in `game-core`; any rules change = decision-log entry + matching docs in the same commit.
- **Mailbox protocol:** append-only entries (next number **QA-G-020**); pull before writing; on conflict, resolve keeping their entries first then re-append ours (session 19 hit FOUR live races — fetch, rebase, keep-theirs-then-ours); never overwrite their entries. Large entries: stage via the editor tool into /tmp files, then a short `cat >>` — a big heredoc through the terminal mangles (sessions 18 AND 19; in 19 a mangled import heredoc never touched the tree — editor-written scripts + short `python3 /tmp/x.py` runs are the reliable pattern).
- Conventional commits · `docs/NOW.md` every session · AI Nexus check at substantial-session start (owner mandate NX-01–05).

## Queue
1. **QA-V-043 pack-06 fidelity pass → QA-G-021 → pair-test certification → corrections verification (owner notes first) → completeness audit → publish note (D-047) → imports (active — see FIRST TASK).**
2. **V6 wiring (gated on the owner's GLM 5.4 switch — D-047):** footer swap + V6 faces into UI/fixtures from `public/visual/` + typed bindings per asset-bindings.json + keyboard/focus + semantic mapping re-check (QA-V-036) → local test → owner-PC deploy.
3. **Follow-ups with VISUAL:** environment mandatories (☿ enclosed cooling · 🌍 Moon reading · ♂ own-sky planet) back for master-final; minor fixture notes (bindings count script, results placeholder box, mobile header wrap).
4. Semantic icon inventory (their QA-V-013 ask) — one docs session.
5. Dev-only visual harness (`LO_ASSET_DIR`) — real-app screenshots, incl. the 320 px card-legibility pass flagged in QA-G-009.
6. WebP optimization + re-pin (new import rows; needs a local encoder — none present).
7. M3 code remainder: Derelict spectator view + Final Transmission entry.
8. M4 RC: galaxy deal-code polish (word-style codes), full gate pass.

## Owner's starter prompt (paste into the new chat)
> New GAME session. Read AGENTS.md, PROJECT_CONTEXT.md, docs/NOW.md (top entry) and docs/22-agent-handover.md, then execute its FIRST TASK (QA-V-043 fidelity pass + pair-tests + corrections verification + publish note per D-047; V6 wiring only after the GLM 5.4 switch). Report in plain words.
