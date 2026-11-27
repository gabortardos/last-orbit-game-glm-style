# 22 — Agent Handover (session-to-session continuation)

Purpose: any new GAME chat session starts here with full context and zero archaeology. The owner pastes the starter prompt (bottom of this file); the new session reads this file and executes the FIRST TASK. Update this file at the end of any session that changes "current state" or the first task.

## Standing entry points (read in order)
1. `AGENTS.md` (repo rules) → 2. `PROJECT_CONTEXT.md` (mission + hard rules) → 3. `docs/NOW.md` (top entry = latest session) → 4. this file's **FIRST TASK**.

## Current snapshot (2026-11-27, after session 16)
- **Game repo:** `github.com/gabortardos/last-orbit-game-glm-style` — local `/Users/gabortardos/Desktop/Last orbit game - glm`, HEAD `13ad478` (session-16 docs), pushed. Tests 112/112, typecheck ×3 green — engine untouched by the last four sessions (docs/server/UI only).
- **Visual repo:** `github.com/gabortardos/last-orbit-visual-studio` — local `/Users/gabortardos/Desktop/last-orbit-visual-studio`, our last word is **QA-G-009** (HEAD `426968a`). **V6 art is signed off: 19/19 PASS, zero change requests** (text parity 18/18 PASS in QA-G-008 — do not redo). The ONLY gate left on the card set is **D-042 licensing**: the owner's per-card sign-offs (manifest `rights` fields still "unverified"). VISUAL is active — always pull first and check `Q_AND_A.md` for entries after QA-G-009 (they may confirm receipt or prep next lanes).
- **Vision:** vision-capable model confirmed (sessions 14–16) — the full 19-image audit ran in ONE fresh session within budget, using the image-budget protocol below.

## FIRST TASK next session — D-042 licensing disposition (the only gate left on V6)
Context: the V6 art verdict is delivered — QA-G-009: **19/19 PASS, zero CHANGE_REQUESTs**, three open decisions accepted (Deflector junction glow · Containment generic geometry · Tractor sparks/drift). Text parity is DONE (QA-G-008, 18/18). The fused art+license table went to the owner (session-16 report + QA-G-009). Manifest `rights` fields are "unverified" and the art is AI-generated via external tools, so public-distribution clearance is a real owner call.
1. Pull both repos; check the visual mailbox for anything after QA-G-009 (VISUAL may confirm receipt or prep next-lane work).
2. **If Gábor has recorded license decisions** (decision log / import-log / his session word): execute the first import per D-042 — per-asset sign-off + license approved for *public* distribution + SHA-256 manifest pin → `docs/visual-studio/import-log.md`; then VISUAL is released onto the remaining v1 lanes (menu/command-deck/reaction polish, faction portraits, icon integration).
3. **If not:** ask Gábor for the 19 license calls (blanket decision + per-card exceptions is a valid form). Never assume licenses; nothing imports or publishes without explicit per-item owner sign-off.
4. Update `docs/NOW.md` (new session entry), commit both repos (docs-only), push. Report to the owner in plain words.

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
- **Mailbox protocol:** append-only entries (next number **QA-G-010**); pull before writing; on conflict, reset to theirs and re-append — never overwrite their entries.
- Conventional commits · `docs/NOW.md` every session · AI Nexus check at substantial-session start (owner mandate NX-01–05).

## Queue after licensing
1. First approved import → `docs/visual-studio/import-log.md` (per D-042) → release VISUAL onto the non-card v1 lanes.
2. Semantic icon inventory (their QA-V-013 ask) — one docs session.
3. Dev-only visual harness (`LO_ASSET_DIR`) — real-app screenshots, incl. the 320 px card-legibility pass flagged in QA-G-009.
4. M3 code remainder: Derelict spectator view + Final Transmission entry.
5. M4 RC: galaxy deal-code polish (word-style codes), full gate pass.

## Owner's starter prompt (paste into the new chat)
> New GAME session. Read AGENTS.md, PROJECT_CONTEXT.md, docs/NOW.md (top entry) and docs/22-agent-handover.md, then execute its FIRST TASK (D-042 licensing disposition on the signed-off V6 set). Report in plain words.
