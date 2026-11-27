# 22 — Agent Handover (session-to-session continuation)

Purpose: any new GAME chat session starts here with full context and zero archaeology. The owner pastes the starter prompt (bottom of this file); the new session reads this file and executes the FIRST TASK. Update this file at the end of any session that changes "current state" or the first task.

## Standing entry points (read in order)
1. `AGENTS.md` (repo rules) → 2. `PROJECT_CONTEXT.md` (mission + hard rules) → 3. `docs/NOW.md` (top entry = latest session) → 4. this file's **FIRST TASK**.

## Current snapshot (2026-11-27, after session 17)
- **Game repo:** `github.com/gabortardos/last-orbit-game-glm-style` — local `/Users/gabortardos/Desktop/Last orbit game - glm`, HEAD `e0fc51f` (session-17 NOW.md) + the handover-refresh commit on top, pushed. Tests 112/112, typecheck ×3 green — engine untouched by the last five sessions (docs/server/UI only).
- **Visual repo:** `github.com/gabortardos/last-orbit-visual-studio` — local `/Users/gabortardos/Desktop/last-orbit-visual-studio`, our last word is **QA-G-010** (pushed as `f84ceb7`; their request commit was `6f939e7`). **Card set is fully closed:** V6 signed off 19/19 (QA-G-008/009) AND the owner accepted V6 for V1 (their D018) — only the production footer swap + **D-042 licensing** remain on the set. **Race visuals:** VISUAL ran the whole captain-direction cycle after the card sign-off — the owner selected all eight captain directions (Mercury B quadrupedal glass sprinter · Venus B masked cloud organism · Earth human engineer · Mars nonhumanoid salvage organism · Jupiter manta · Saturn Ring Weaver B · Uranus B/D open · Neptune flowing bioluminescent), and QA-G-010 answered their QA-V-021 review gate: **7/8 textual PASS** with 2 mandatory corrections (♄ Saturn purple → Codex triad pale gold + ring-platinum + hexagon teal; ♃ Jupiter ceremonial pressure suit must be explicit in the master brief) and **1 NEEDS_VISUAL_REFERENCE** (♅ Uranus B-vs-D — criteria in QA-G-010). TEXT-ONLY review — no captain binaries seen; masters + crops + hashes → visual gate is next. Captain canon authority: `apps/hotseat/src/ui/Codex.tsx` sheets + `docs/14` (names: Cinder Vale, Marguerite, Amara Okafor, Bram Oxide, Tharsalla Nine-Band, Vesper Noctis, Titania Umbra, Lumen Trench — nothing generated on boards is canon). VISUAL is active — always pull first and check `Q_AND_A.md` for entries after QA-G-010.
- **Vision:** vision-capable model confirmed (sessions 14–16) — the full 19-image audit ran in ONE fresh session within budget, using the image-budget protocol below. The captain gate needs a FRESH session for its images.

## FIRST TASK next session — captain portrait masters gate (QA-G-011) + D-042 licensing disposition
Context: QA-G-010 delivered the textual direction verdicts (base @ `6f939e7`, pushed `f84ceb7`). VISUAL's Batch-01 plan: independent single-subject masters, ♃♄♅♆ first, then ♂/🌍 (anatomy caveats), ☿♀ candidates already exist; 600×800 + 512 crops at real setup/HUD sizes; private Drive sync + hashes before review requests. D-042 (19 per-card license calls) is STILL the only V1 release gate.
1. Pull both repos; check the visual mailbox for entries after QA-G-010 and whether captain binaries/hashes are synced (Drive; `contracts/civilization-portraits.json` + manifest).
2. **If masters landed:** image-budget protocol (fresh session, ≤340 px thumbs, batches of 2–3; when omissions start, STOP) → inspect each captain against its QA-G-010 mandatory markers + the differentiation matrix (♀/♆ highest risk; ♄/♅ resolved by the palette swap; ♂/🌍 junk schism) + 48 px grayscale silhouette test → **QA-G-011** per-captain PASS / CHANGE_REQUEST. Decide Uranus B vs D via the QA-G-010 criteria (needs both refs synced). Never approve unseen art.
3. **If masters haven't landed:** work the D-042 lane — if Gábor has recorded the 19 license calls, execute the first import (per-asset sign-off + public-distribution license + SHA-256 pin → `docs/visual-studio/import-log.md`) and release VISUAL onto the remaining v1 lanes; if not, ask him (blanket + exceptions is valid). Never assume licenses.
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
- **Mailbox protocol:** append-only entries (next number **QA-G-011**); pull before writing; on conflict, reset to theirs and re-append — never overwrite their entries.
- Conventional commits · `docs/NOW.md` every session · AI Nexus check at substantial-session start (owner mandate NX-01–05).

## Queue
1. **Captain portrait gate (active — see FIRST TASK).**
2. First approved import → `docs/visual-studio/import-log.md` (per D-042, once licensed) → release VISUAL onto the non-card v1 lanes.
3. Semantic icon inventory (their QA-V-013 ask) — one docs session.
4. Dev-only visual harness (`LO_ASSET_DIR`) — real-app screenshots, incl. the 320 px card-legibility pass flagged in QA-G-009.
5. M3 code remainder: Derelict spectator view + Final Transmission entry.
6. M4 RC: galaxy deal-code polish (word-style codes), full gate pass.

## Owner's starter prompt (paste into the new chat)
> New GAME session. Read AGENTS.md, PROJECT_CONTEXT.md, docs/NOW.md (top entry) and docs/22-agent-handover.md, then execute its FIRST TASK (captain portrait masters gate + D-042 licensing disposition). Report in plain words.
