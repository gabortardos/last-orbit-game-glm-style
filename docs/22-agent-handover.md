# 22 — Agent Handover (session-to-session continuation)

Purpose: any new GAME chat session starts here with full context and zero archaeology. The owner pastes the starter prompt (bottom of this file); the new session reads this file and executes the FIRST TASK. Update this file at the end of any session that changes "current state" or the first task.

## Standing entry points (read in order)
1. `AGENTS.md` (repo rules) → 2. `PROJECT_CONTEXT.md` (mission + hard rules) → 3. `docs/NOW.md` (top entry = latest session) → 4. this file's **FIRST TASK**.

## Current snapshot (2026-11-25, after session 15)
- **Game repo:** `github.com/gabortardos/last-orbit-game-glm-style` — local `/Users/gabortardos/Desktop/Last orbit game - glm`, HEAD `1dc8e76`, clean/pushed. Tests 112/112, typecheck ×3 green. Engine untouched by the last three sessions (docs/server/UI only).
- **Visual repo:** `github.com/gabortardos/last-orbit-visual-studio` — local `/Users/gabortardos/Desktop/last-orbit-visual-studio`, our last word is **QA-G-008** (HEAD `0c01dc4`). **VISUAL is active** — always pull first and check `Q_AND_A.md` for entries after QA-G-008; the manifest may have moved past `0.26-v6-manufactured-review` (if a V7 exists, review that set with the same protocol).
- **Vision:** the owner has switched this harness to a vision-capable model — direct image inspection works (confirmed sessions 14–15).

## FIRST TASK next session — V6 art sign-off (the only blocking item)
Context: V6 = complete manufactured card set (18 uniform faces + card back + 18 art layers + `card-data.json`), manifest `0.26`, Drive folder **"Card Collection V6 - complete set for joint approval"**. **Text parity is DONE: 18/18 PASS (QA-G-008) — do not redo it.** What remains is ONLY the per-card art verdict.
1. Pull both repos; check the visual mailbox for anything after QA-G-008 (concurrent entries possible; if a newer card set exists, review that instead, same protocol).
2. Regenerate tools (§Commands below — `/tmp` is wiped on reboot).
3. Inspect **all 19 images** (18 faces + `LO-CARD-BACK-V6`) at ~340px thumbs, batches of 2–3. Judge per card: art truth vs `CARD_INFO` + the QA-G-005 briefs (in the visual repo `Q_AND_A.md`); single subject, no posters/text-as-art; category badge vs engine (**Solar Wind must read ACTION**); uniform frame family + emblem placement; and the three open decisions VISUAL flagged: **Deflector** junction/destination glow · **Containment** generic-vs-Mercury geometry · **Tractor** pod sparks/beam direction.
4. Produce the per-card **PASS / CHANGE_REQUEST** table (CHANGE_REQUESTs = exact, bounded instructions).
5. Post **QA-G-009** (next mailbox number) to the visual repo `Q_AND_A.md`; VISUAL holds publication until licensing lands.
6. Present the table to the owner **fused with D-042 licensing rows** — art PASS + owner license sign-off per card in one pass. The owner decides licenses; never assume them.
7. Update `docs/NOW.md` (new session entry), commit both repos (docs-only), push. Report to the owner in plain words.

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
- **Mailbox protocol:** append-only entries (next number **QA-G-009**); pull before writing; on conflict, reset to theirs and re-append — never overwrite their entries.
- Conventional commits · `docs/NOW.md` every session · AI Nexus check at substantial-session start (owner mandate NX-01–05).

## Queue after the art pass
1. Fused art+licensing table → owner.
2. Semantic icon inventory (their QA-V-013 ask) — one docs session.
3. Dev-only visual harness (`LO_ASSET_DIR`) — real-app screenshots for reviews.
4. M3 code remainder: Derelict spectator view + Final Transmission entry.
5. M4 RC: galaxy deal-code polish (word-style codes), full gate pass.

## Owner's starter prompt (paste into the new chat)
> New GAME session. The vision-capable model is selected. Read AGENTS.md, PROJECT_CONTEXT.md, docs/NOW.md (top entry) and docs/22-agent-handover.md, then execute its FIRST TASK (V6 art sign-off → QA-G-009, fused D-042 licensing rows). Follow the image-budget protocol and report in plain words.
