# 22 — Agent Handover (session-to-session continuation)

Purpose: any new GAME chat session starts here with full context and zero archaeology. The owner pastes the starter prompt (bottom of this file); the new session reads this file and executes the FIRST TASK. Update this file at the end of any session that changes "current state" or the first task.

## Standing entry points (read in order)
1. `AGENTS.md` (repo rules) → 2. `PROJECT_CONTEXT.md` (mission + hard rules) → 3. `docs/NOW.md` (top entry = latest session) → 4. this file's **FIRST TASK**.

## Current snapshot (2026-11-27, after session 19)
- **Game repo:** `github.com/gabortardos/last-orbit-game-glm-style` — local `/Users/gabortardos/Desktop/Last orbit game - glm`, HEAD = session-19 NOW.md + D-045 decision row + import #1, pushed. Engine untouched since session 18 (112/112 tests + typecheck ×3 remain valid). **NEW: `apps/hotseat/public/visual/` = the 19 approved V6 card assets, byte-identical + SHA-256-pinned (`docs/visual-studio/import-log.md` import #1, D-045) — UI wiring NOT started.**
- **Visual repo:** our last words are **QA-G-013…019** (pushed on top of their `95ded0c` after three live rebase races — VISUAL iterates fast; always fetch first). **Captain DESIGN CLOSED 8/8:** ☿ final on the owner-locked QA-V-030 LEFT panel (production checks: no-mouth at full res, glass-facet toes not talons) · ♅ final on the owner's QA-V-033 six-panel pick "Titania Umbra" (master mandatory: magenta axis at exactly 0° + one level edge; 48 px pair-test vs ♄ stays; **B/D question MOOT**; QA-V-030 right panel concurred-rejected as a literal instrument/monogram). Results concept + fixture **layout PASS** (QA-G-014, implementation constraints listed: 2–5 seats, Fury 0–5, viewer-conditional victory/defeat, exact export authorization). Overlays direction **PASS with ONE mandatory** — strip the CANCEL affordances on forced-choice tiles (engine has no cancel path; every QA-V-029 claim verified with file:line) (QA-G-015). Lobby/settings/codex/briefing boards **layout PASS**, board 1 primary, content guardrails mandatory (no invented audio toggles/8-seat lobby; exact CIVS/SHEETS/Briefing strings; Codex tiles already carry the approved ♅ art) (QA-G-016). Mercury environment **DIRECTION_PASS** + mandatories (no moon, no exposed liquid → cast-glass channels, text-free; entry labels were swapped) (QA-G-018); QA-V-036 owner corrections **acknowledged — sail density REDUCED (selective tech, not architecture), text/logo/icon-free masters binding** (QA-G-019). **D-042 CLOSED by D-045** (owner blanket for the 19 V6 card assets, first import executed); the hash+log import gate is permanent; **captain masters + derivatives still need their own clearance call** at the export gate.
- **Vision:** an 11-image session ran clean within budget (fresh session, ≤420 px thumbs, batches of 2–3, zero omissions) — the budget comfortably covers a full review sweep when the session starts fresh.


## FIRST TASK next session — captain-masters export gate + V6 UI wiring + implementation supervision
Context: captain design is CLOSED 8/8 (QA-G-013); the 19 V6 card assets are imported and published (D-045, `apps/hotseat/public/visual/`, import-log #1); VISUAL is released onto the implementation lanes with GAME constraints recorded (QA-G-014/015/016). QA-V-035…038 (environment explorations + owner env/icon direction) are answered or self-assessed; Uranus/Neptune environments + captain masters remain their outstanding production work.
1. Pull both repos; check the mailbox for entries after **QA-V-038 (theirs) / QA-G-020 (ours)**; check Drive for new deliveries (hashes first, always).
2. **Captain masters + 600×800/512 derivatives + per-file hashes + the 48 px pair-tests (♀/♆, ♄/♅) when landed:** fresh-session image pass → per-captain export verdicts → **then the captains' OWN license-clearance call** (the D-045 blanket does NOT cover portraits — ask Gábor, blanket + exceptions form) → only then captain import rows.
3. **V6 wiring lane (game code, docs-side prepped):** footer swap (REVIEW EDITION), V6 card faces into UI/fixtures from `/visual/<id>.png`, semantic faction-mapping re-check before any environment export (QA-V-036 request).
4. **Implementation supervision:** review VISUAL's results-screen + overlays implementations against QA-G-014/015 constraints (browser fixtures, 320 px, exact string parity; overlays must NOT carry cancel affordances); lobby/settings/codex/briefing editable fixtures vs QA-G-016 guardrails.
5. **WebP optimization** when an encoder is available — NEW import rows with re-pinned hashes (never edit row #1).
6. Update `docs/NOW.md` (new session entry), commit both repos, push. Report to the owner in plain words.

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
- **D-042 → D-045:** the licensing gate is CLOSED for the 19 V6 card assets (owner blanket, 2026-11-27, first import executed). EVERY import still requires hash verification + an import-log row, and anything outside the 19 (captain masters, derivatives, environments) needs its own owner clearance before import.
- **D-043:** galaxy seed — online seeds are server-owned, never client-settable; hotseat/solo keep the shareable deal code.
- **D-044:** v1.0 = "Classic complete" (cards + UI polish); cinematic/animation = v2 lane; 3D backdrop is an optional toggle, not a v1 gate.
- **Engine purity:** no `Math.random`/`Date.now` in `game-core`; any rules change = decision-log entry + matching docs in the same commit.
- **Mailbox protocol:** append-only entries (next number **QA-G-020**); pull before writing; on conflict, resolve keeping their entries first then re-append ours (session 19 hit FOUR live races — fetch, rebase, keep-theirs-then-ours); never overwrite their entries. Large entries: stage via the editor tool into /tmp files, then a short `cat >>` — a big heredoc through the terminal mangles (sessions 18 AND 19; in 19 a mangled import heredoc never touched the tree — editor-written scripts + short `python3 /tmp/x.py` runs are the reliable pattern).
- Conventional commits · `docs/NOW.md` every session · AI Nexus check at substantial-session start (owner mandate NX-01–05).

## Queue
1. **Captain masters + derivatives + hashes → per-captain export verdicts → the captains' own clearance call → captain import rows (active — see FIRST TASK).**
2. **V6 wiring:** footer swap + V6 faces into UI/fixtures from `public/visual/` + semantic mapping re-check (QA-V-036).
3. **Supervise VISUAL implementation lanes** vs QA-G-014/015/016 constraints (results screen; overlays incl. the CANCEL mandatory; lobby/settings/codex/briefing fixtures).
4. Semantic icon inventory (their QA-V-013 ask) — one docs session.
5. Dev-only visual harness (`LO_ASSET_DIR`) — real-app screenshots, incl. the 320 px card-legibility pass flagged in QA-G-009.
6. WebP optimization + re-pin (new import rows; needs a local encoder — none present).
7. M3 code remainder: Derelict spectator view + Final Transmission entry.
8. M4 RC: galaxy deal-code polish (word-style codes), full gate pass.

## Owner's starter prompt (paste into the new chat)
> New GAME session. Read AGENTS.md, PROJECT_CONTEXT.md, docs/NOW.md (top entry) and docs/22-agent-handover.md, then execute its FIRST TASK (captain-masters export gate + V6 UI wiring + implementation supervision). Report in plain words.
