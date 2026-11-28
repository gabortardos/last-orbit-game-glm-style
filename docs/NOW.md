# NOW — Current Status (update every work session; most recent on top; every entry must state the dev-plan step executed and what remains — Gábor's standing request, 2026-10-25)
## Session 22 — V1 WIRING SPRINT COMPLETE (GLM 5.4): every approved surface wired; the game is visually complete and ready for the owner's local check — 2026-11-28 ✅

**Dev plan step executed:** owner directive — "I switched the model to glm 5.4, you have everything, to wire the whole v1 together. I approve everything. Try to get to the point where we are done with v1 development and next step I can check the upgraded fully wired visually updated game in local." Engine untouched; UI-only wiring of ALREADY-APPROVED assets (D-048 scope; no new V1 scope).

- **Shared plumbing:** new `ui/CardFace.tsx` (xs/sm/md/lg face renderer) + `ENV_THUMB` map in `visualAssets.ts` (640×360 homeworld thumbs). Every path still flows through the typed `Record<CardKind/FactionId, …>` maps — compiler-enforced coverage.
- **Surfaces wired this session (on top of session-21's hand cards/portraits/footer):** HUD **draw pile** (V6 card back + count) and **discard pile** (live top-of-discard face + count — public info, now readable at a glance) · draw-reveal modal (large face) · reaction window (hand chips carry faces; every respondent row + bot row carries its captain portrait) · Deep-Space Scan / Deep Sight / scrap-peek reveals (small faces) · Requisition-give / Storm-jettison / Tractor-snag choice hands (faces; picked state = gold outline, not color-only) · privacy handoff gate (next captain's portrait) · **game-over ceremony** (winner's captain portrait + homeworld backdrop behind the results table) · **Codex** (captain portrait + homeworld backdrop on all 8 civ tiles; portrait chips on every deep-sheet header) · Mission Briefing card reference (faces) · **Setup homeworlds hero strip** (all 8 env thumbs under the title).
- **Keyboard/focus pass (A07/A15/A19):** Esc closes Briefing/Codex; focus returns to the opener button on close (`helpBtn`/`civsBtn` refs); gold `:focus-visible` outline on every interactive element; `prefers-reduced-motion` kills transitions; all card choices remain native `<button>`s (Enter/Space, tab order).
- **Verification:** typecheck ×3 green · **112/112 tests** · build green · bundle contains all three asset families (`/visual/LO-CARD-`, `LO-CAPT-`, `LO-ENV-`) · `dist/visual` = 51 assets · live-served DOM: homeworlds strip = 8 thumbs, review footer present, zero console errors. Final screenshot omitted by the harness (image budget spent this conversation — expected per protocol; DOM + bundle evidence recorded instead; no art was approved unseen — all approvals predate this sprint).
- **Deliberately not wired:** the flight log stays text (faces in a scrolling log = noise); the online lobby's fleet chips stay text-only (M3 lane; noted as optional polish). No engine, rules, or network changes.
- **AI Nexus:** still 404 this session; recorded (VISUAL's relayed revision noted in QA-G-022).

**Next — OWNER LOCAL CHECK (the only remaining gate):** in `/Users/gabortardos/Desktop/Last orbit game - glm`: `npm install` (fresh machine) → `npm run dev` → open http://localhost:5173 — or `npm run build` and serve `apps/hotseat/dist`. Play hotseat + solo; check codex/briefing/reaction/choice/give/storm/snag/game-over surfaces. On acceptance → production flip = delete `<ReviewFooter />` from `Setup.tsx` + `GameView.tsx` (+ its CSS block) → rebuild → owner-PC deploy per `docs/19`. VISUAL's A01–A24 protocol remains the formal evidence matrix for the live pass.


## Session 21 — FINAL VISUAL APPROVAL ROUND: QA-V-043/044/045 ALL APPROVED + 48px pairs CERTIFIED + imports #2/#3 + wiring begun — 2026-11-27 ✅

**Dev plan step executed:** owner directive — "Execute the outstanding LAST ORBIT V1 visual approval round, including QA-V-043, QA-V-044 and QA-V-045. Inspect the actual uploaded assets, verify their checksums, review the targeted corrections and certify the 48px captain readability comparisons. Return explicit approval verdicts and identify only genuine remaining release blockers. Continue with authorized game integration wherever possible. Do not reopen approved creative designs or introduce new V1 scope. Communicate all results through our shared GitHub Q&A… the next step I want to be the release of v1."

- **Hash gates first (hash before open, all four packs):** on the Drive mount vs mailbox declarations — 05 `2485da12…14ee0` ✓ · 06 `215c4dcc…8c69` ✓ · 07 `1861d7ec…4279` ✓ · 08 `5da03f5a…f06b` ✓ — then unpacked. **95/95 verifier checks** (`/tmp/verify_round.py`): pack 06 — 24 files hash+size+declared-dims, all 8 `approved_reference_sha256` == locked batch-04 sources byte-for-byte, ♀/♄ masters byte-identical to locked; pack 08 — 69/69 members, 🌍 portrait/avatar byte-exact vs pack 05, all dim gates (3× 1672×941 · ☿ 745×1000 · ♃ 1086×1448 · 8× true-grayscale 48px), 10 locked-env pins re-verified; pack 07 — 322/322 members + carries all 19 imported card pins; pack-08 UI snapshots byte-identical to current repo; VISUAL's `validate-bindings.py` re-run: 123 bindings / 59 unique / 0 invalid (matches our independent audit).
- **Verdicts pushed as QA-G-021 (base @ their `9286552`):** **QA-V-043 — six masters EXPORT_PASS** (♃ pressure seam RESOLVED via integrated membrane fringes; ♅ "level edge not unequivocal" RESOLVED — 06 extends the figure below the old hard horizontal cut; ☿ toe faceting accepted as stylization + moon handled by 08 rematte; 🌍 framing/equipment evolution accepted as same captain; native gate certified 8/8). **QA-V-045 — corrections PASS** (☿ env: sealed cast-glass conduits SATISFY the mandatory, composition change accepted as the prescribed targeted correction, habitat direction continuous; 🌍/♂ sky mattes clean at 100% native crops — no halo, no seam; ☿ captain rematte anatomy untouched + **745×1000 native exception APPROVED**; 🌍 portrait/avatar byte-exact 05 outputs). **48px pairs CERTIFIED with the glyph+name mitigation** — own pixel metrics on their exact 48px PNGs (♀/♆ MAD 67.8–72.7 vs unrelated-pair median 57.2; ♄/♅ MAD 53.9–59.2, hamming 6–7/36 = tightest margin): art-only 48px display NOT certified standalone; art + approved glyph + visible name IS certified (their 24px badges accepted; mount at ≤48px; no baked glyphs). **QA-V-044 — assembly APPROVED** (own headless-Chromium pass: clean DOM, zero JS errors; contact sheets reviewed — 16 screens; their 119/119 + 23/23 accepted as evidence; results-binding/wordmark/grid/status fixes verified via snapshot byte-identity). **ZERO visual blockers; no further requests to VISUAL — the visual lane for v1 is CLOSED.**
- **D-048 recorded (decision log):** D-046 gate satisfied → D-047 delegation exercised → **imports #2/#3 executed:** 16 captain assets (`LO-CAPT-{FACTION}-PORTRAIT/AVATAR-V1.webp` — ☿ on the 08 rematte track, 🌍 byte-exact 05, rest pack-06 derivatives) + 16 environment assets (`LO-ENV-{FACTION}-BG/THUMB-V1.webp` — ☿🌍♂ on the 08 corrected track, ♀♃♄♅♆ locked originals) into `apps/hotseat/public/visual/`; every file SHA-256 vs pack manifests BEFORE copy, byte-identical, no re-encode; import-log rows complete. Visual manifest **v0.32**: 32 new entries `runtime_approved` (51 approved runtime assets total), rights `owner-cleared-public-distribution (D-047 delegated approval via QA-G-021)`. **Owner's in-session integration directive supersedes D-047's wait-for-GLM-5.4 as a blocking gate** (the switch stays available for remaining build work).
- **Wiring begun (the authorized GO lane; engine untouched):** new `apps/hotseat/src/ui/visualAssets.ts` — typed `Record<CardKind, …>` V6 face map (the COMPILER enforces 18/18 card-kind coverage) + portrait/avatar/env maps whose faction keys mirror `asset-bindings.json` exactly (QA-V-036 re-check 8/8) · hand cards + pair buttons mount the V6 faces above readable names · captain portraits in player panels + fleet picker · new `ReviewFooter.tsx` ("V1 REVIEW · REVIEW EDITION — private review build · not for distribution") mounted on Setup + GameView — **remove at the production flip**.
- **Image ledger:** 8 real review inspections (captain-fidelity sheet, env before/after sheet, ☿/♃ detail sheet with 100% native crops, 48px pair sheet, assembly contact sheet + 3 broken-placeholder reads that consumed budget but showed nothing). Within budget, zero omissions, no art approved unseen.
- **AI Nexus:** HTTP 404 again this session (repo page + raw AGENTS.md) — recorded; last verified revision practice stands.

**Next (GAME lane only):** `npm test` + typecheck + build green → commit + push both repos → **integrated QA = VISUAL's `docs/V1_ACCEPTANCE_PROTOCOL.md` A01–A24** (adopted via QA-G-022; evidence pins first: GAME commit `e1850ae`, visual manifest v0.32 `661bb2d`, import-log #1–#3) → local build for owner release acceptance → production flip (ReviewFooter off — the only change) → owner-PC deploy per `docs/19`. **No remaining visual or rights gates; D-047's local-test-before-deploy rule stands.**



## Session 20 — CONSOLIDATED APPROVAL ROUND QA-G-020: environments + batch-04 exports + UI implementation verdicts — 2026-11-27 ✅

**Dev plan step executed:** owner directive — "Read the latest shared Q&A and execute the consolidated approval round (QA-V-039 all eight environments, QA-V-040 captain/environment production assets + exports, QA-V-041 corrected overlays + editable lobby/settings/codex/briefing + pictogram implementation). Inspect the actual assets, browser-test where applicable, return individual verdicts + blockers." Docs + mailbox only; engine untouched.

- **Retrieval + integrity (hashes first):** QA-V-040 ZIP found on the owner's LOCAL Drive mount (`UI/Card Collection V6…/LAST_ORBIT_V1_Production_04.zip`) — size 41,888,623 + SHA-256 `5ba15d42…71864` matched VISUAL's declaration EXACTLY before opening. 52/52 members; 48/48 internal manifest hashes+sizes+dims re-verified with a purpose-built checker; the 8 env binaries byte-match the QA-V-039 Drive declarations. **Provenance proven at pixel level:** ☿ ♅ ♂ ♃ sources are PIXEL-EXACT crops of the pinned owner/GAME-reviewed originals (decoded the pinned diptych/six-panel files, cut the declared crop boxes, diffed: ZERO differing channel samples — node/zlib PNG decoder in /tmp/cropcheck.js); ♀ ♄ ♆ 🌍 byte-match the prior review package. The stale `All_8_Captains_Review.zip` in ~/Downloads (19 MB, `6a3a2ac6…`) is an EARLIER package — do not review from it.
- **Verdicts pushed as QA-G-020 (visual `fbdf558`, on top of their `dee0007` after the FIFTH live race — QA-V-042/043 landed mid-review, acknowledged + queued in an addendum):** **Environments:** ♃ ♄ ♅ ♆ ♀ DESIGN_PASS (Uranus read as a Titania moon-vista — commit to that in the manifest; Venus salon furniture ruled ON-canon per CIVS "hosts a salon at apogee") + 3 single-mandatories: ☿ cyan flows must be ENCLOSED cast-glass cooling (owner QA-V-036) · 🌍 sky-body must read as THE Moon or go · ♂ giant planet in Mars's own sky is misleading astronomy. **Captains (batch-04):** ♀ ♄ EXPORT_PASS (both 1086×1448 native) · ☿ MANDATORY: cratered moon in backdrop violates "Mercury has no moon" (re-matte only; creature pixels locked) + full-res checks PASSED (no mouth ✓ glass toes ✓) + proposed 745×1000 native exception · 🌍 ♂-Mars conditional passes + exception proposals (runtime derivatives are clean downscales) · ♃ seam-articulation mandatory STANDS (their own admission) · ♅ ♆ master-gate re-render mandated (509/512 native; 600×800 would be 1.5×+ upscale) — ♅ design checks all PASS incl. **axis measured 0.83° from vertical** (sub-degree: "True Level" survives). **Pair-tests (♀/♆ ♄/♅) still NOT certified — the last technical gate before captain import.** **UI (QA-V-041): PASS + integration GO** — verified in REAL Chrome (desktop 1280×800 + mobile 390×844) with the full mount contract applied (18 V6 faces + 8 portraits + 8 env backgrounds): ZERO cancel affordances (QA-G-015 SATISFIED, wording adopted verbatim), results field parity exact in-render, QA-G-016 guardrails held (no invented audio toggles; host/join/reconnect only), canon.js strings verified against Codex.tsx ("cloud-glass mask", "Morning Star", "True Level"), 62 glyphs live, 39/39 self-checks.
- **Image ledger:** 21 inspections (8 envs + 8 captain sources incl. ☿ at native 745×1000 + 1 runtime portrait + 4 browser screenshots), zero omissions. Browser passes are real headless-Chrome captures (not just DOM stubs); keyboard/focus pass still open → V6 wiring checklist.
- **Mid-review deliveries:** QA-V-042 (crop-only pack 05, fallback) + **QA-V-043 (six same-design native 1086×1448 re-renders ☿ 🌍 ♂ ♃ ♅ ♆ + unchanged ♀ ♄ — exactly the prescribed master-gate fix)** — queued as the immediate next pass (fresh session): hash-verify pack 06 (ZIP `16nfZCue…`, 23,332,986 bytes, SHA-256 `215c4dcc…`) → per-master fidelity review vs the LOCKED references (their own flags: ☿ moon+toes remain, 🌍 equipment/framing drifted, ♃ articulation ambiguous, ♅ level edge "not unequivocal") → per-master verdicts as QA-G-021. Locked originals stay authority.
- **AI Nexus:** unreachable again (HTTP 404, repo page + raw AGENTS.md) — record stands.
- **Release sequence locked (D-047) + QA-V-044 arrived:** VISUAL pushed the V1 ASSEMBLY pack 07 (`ab5f3c6`+`8b33fa9`, ff-pulled cleanly) — the fully assembled review prototype: 323 members, ZIP SHA-256 `1861d7ec…74279`, 18,111,182 bytes, Drive `1cJNMU7…`, manifest v0.30, 119/119 Chromium checks, contact sheets pinned. NOT the corrections — they confirm those are "next independent VISUAL production". Pack-07 review is GATED on the owner's note (image budget + D-047 order). Owner also DELEGATED clearance: if GAME's verification + completeness audit pass everything, that approval = owner approval (no separate licensing call); then GLM 5.4 switch → wiring sprint → LOCAL test → owner-PC deploy. Mechanical completeness dry-run run this session: ZERO gaps — 19/19 import pins re-verified, 18/18 bound card IDs = engine `CardKind` union, 37/37 binding glyph refs render (62 defined), 195 manifest assets inventoried (19 approved = the card set; all else correctly pending).

**Next:** QA-V-043 fidelity pass → QA-G-021; certified pair-tests; corrections verification when the owner notes (hash-first, fresh session — D-047); completeness audit → if ALL green, publish note (GAME approval = owner-approved); owner switches to GLM 5.4 → wiring sprint (footer, faces, typed bindings, keyboard/focus) → LOCAL test → owner-PC deploy. WebP re-pin when an encoder exists.



## Session 19 — QA-G-013…019: captain gate CLOSED 8/8 + results/overlays/UI verdicts + D-042 LIFTED (owner blanket) + first import executed — 2026-11-27 ✅

**Dev plan step executed:** owner directive — "All 19 cleared — I've checked the AI tool's terms and I'm fine publishing them" + "check the latest visuals to approve, there are a lot… report back, approve, deny, explain, direct." Engine untouched (assets + docs only).

- **D-042 LIFTED → D-045 (decision row in this commit):** owner blanket clearance for exactly the 19 V6 card assets. Visual manifest flags flipped (19 assets → `runtime_approved: true`, rights `owner-cleared-public-distribution (D-045)`, `approval_ref: QA-G-017`; visual commit `f9c18b8`). **First import executed:** 19/19 files SHA-256 + byte-size verified against the manifest BEFORE copy → `apps/hotseat/public/visual/<assetId>.png` (37 MB, byte-identical; Vite `publicDir` → runtime path `/visual/<id>.png`); `docs/visual-studio/import-log.md` import #1 records every pin. WebP optimization = follow-up lane (new import row + re-pinned hashes when an encoder exists). **UI wiring not started** — no code references the files yet. Captain masters are NOT covered by the blanket (their clearance call comes at the export gate).
- **Visual reviews — 11 images, fresh session, zero omissions:** ☿ Mercury **DESIGN_PASS final** on the owner-locked QA-V-030 left panel (quadrupedal sprinter, cast glass, gold sails, cyan ✓; production: confirm no mouth at full res + glass-facet toes, not talons) · ♅ Uranus **DESIGN_PASS final** on the owner's QA-V-033 six-panel pick (intrinsic magenta axis, rectilinear vs Saturn; master mandatory: axis at exactly 0°; **B/D question MOOT**) · QA-V-030 right panel **concurred-rejected** (literal instrument/monogram object, not a creature) → **QA-G-013 closes captain design 8/8.** QA-G-014: results concept + fixture **layout PASS** (field parity vs the real `GameOverModal` verified; implementation constraints: 2–5 seats, Fury 0–5, viewer-conditional victory/defeat). QA-G-015: overlays direction **PASS with ONE mandatory** — the concept still draws CANCEL on forced-choice tiles (engine has no cancel path); every QA-V-029 behavior claim verified with file:line (Storm Shout drawer-only/once/no-discard `commands.ts:199-208`; dynamic reinsert `:350-351`; Tractor exact count `:333` + UI `Overlays.tsx:561-604`; handoff privacy `App.tsx:32`). QA-G-016: lobby/settings/codex/briefing boards **layout PASS** (board 1 primary) with content guardrails (no invented audio toggles / 8-seat lobby; exact CIVS/SHEETS/Briefing strings; Codex tiles already carry the approved ♅ art ✓). QA-G-018: Mercury environment **DIRECTION_PASS** + mandatories (no moon — Mercury has none; liquid → cast-glass channels; text-free) + accuracy note (synced 001 carries the baked title; 002 is the text-free one — entry labels swapped). QA-G-019: QA-V-036 owner env/icon direction **acknowledged — the sail-density correction supersedes QA-G-018's sail praise** (sails = selective functional tech); text/logo/icon-free masters binding; pictogram library stays the only UI icon source.
- **Carry-over RESOLVED:** QA-G-011's "5 DESIGN_PASS" header was a miscount — the body was always 6 PASS (♀ 🌍 ♂ ♃ ♄ ♆) + 2 targeted fixes; superseded by QA-G-013 (8/8 closed). This entry states the corrected count.
- **Visual repo pushed through THREE live races** (VISUAL pushed QA-V-035/036/037/038 mid-session): rebased each time, append-only respected; final state = QA-G-013…019 on top of their `2d213b9` (the earlier `f9c18b8` manifest + `97065d6` mailbox commits kept their hashes through the rebases).
- **Remaining:** captain masters + derivatives + per-file hashes → export gate (+ the captains' own clearance call — NOT covered by the 19-asset blanket); V6 wiring into the UI (footer swap, fixture faces, semantic mapping re-check); WebP re-pin; VISUAL is active on the results/overlays/UI-fixture implementation lanes under the QA-G-014…016 constraints; semantic icon inventory (queue #4) still open.

## Session 18 — captain design closure + V1 UI/pictogram approvals: QA-G-011 (5 DESIGN_PASS, 2 targeted fixes) + QA-G-012 (5/5 DESIGN_PASS) pushed — 2026-11-27 ✅

**Dev plan step executed:** owner request — "execute both pending approval assignments (QA-V-025 eight-captain visual approval, QA-V-026 main menu / fleet / command deck / reaction window / pictogram library), inspect the actual Drive assets, mandatory-only corrections, never reopen V6, report via shared Q&A" — this is the handover FIRST TASK with the binaries finally synced. Docs-only: engine untouched.

- **Hash gates first:** captains ZIP `LAST_ORBIT_All_8_Captains_Review.zip` SHA-256 `6a3a2ac6…` ✓ (19,206,552 bytes ✓) with **24/24 inner files matching the ZIP's own manifest**; owner-authoritative Mars/Jupiter diptych pinned `55059ea7…` (2,639,707 bytes); pictogram pack + 6 UI files + 2 HTML fixtures — **9/9 declared Drive hashes matched** the local synced copies. `LO-CLASSIC-V4-COMMAND-PACK-001` (53 MB) not in the Drive sync — flagged to VISUAL (the two individually hashed screens carry the review).
- **QA-G-011 — captains: 5 DESIGN_PASS + 2 MANDATORY_FIX, judged on real binaries (14 images, zero omissions, batches of 2–3):** ♀ Venus PASS (permanent mask ✓, emphatic warm triad) · 🌍 Earth PASS (taped orange workwear, loved junk) · ♂ Mars PASS (diptych left panel: nonhumanoid welded salvage organism) · ♄ Saturn PASS (**the QA-G-010 palette correction is verified on the binary — no purple, pale gold + platinum + teal**) · ♆ Neptune PASS (cold/flowing, chartreuse-as-warning) · ♃ Jupiter PASS **on the diptych RIGHT panel (owner override — ZIP Jupiter never reviewed)**, ceremonial sheath reads, master must preserve the owner-accepted anatomy exactly. **Fixes:** ☿ Mercury — the candidate is an upright BEAKED raptor: restage to the selected low quadrupedal sprinter + cast-glass visor head (no beak, no mouth); keep the excellent gold sails · ♅ Uranus — jewel-crystal, not drafting-instrument, and its 48 px grayscale silhouette collides with Saturn; keep the one perfect magenta vertical, add plumb-bob/set-square/level geometry. **Uranus B-vs-D stays NEEDS_VISUAL_REFERENCE** (B, D and the hoop candidate all unseen by GAME). Production mandatories: 48 px grayscale pair-tests (♀/♆, ♄/♅) on finals; Neptune master re-render (source is a 512 px tile); Jupiter suit articulation without anatomy change.
- **QA-G-012 — V1 UI + pictograms: 5/5 areas DESIGN_PASS, zero mandatory visual blockers** — main menu (canon mode trio, sun-centric, premium gold/dark), fleet selection (8 canon factions + canon captain preview), command deck (**single END TURN + draw preserved**, captain-orders sidebar, hand + systems), reaction window (respond-or-pass with "Let it Happen"), pictogram library (36 UI symbols + 8 faction insignia + 18 card insignia — semantic keys map exactly to the engine's cards). Production/integration notes only: V4-era card faces inside fixtures must swap to approved V6 exports; fleet preview embeds the CURRENT Mercury art (swaps after the ☿ fix); text parity, 320 px reflow and timer visibility = implementation lane.
- **Differentiation confirmed in colour across the full set** (♀/♆ warm-vs-cold works at a glance; ♂/🌍 junk schism reads; tone rude-not-grim everywhere). V6 untouched; nothing imports; **D-042 unchanged** — the 19 owner license calls remain the only release gate.
- **Process integrity (mailbox protocol held under fire):** the first append was mangled by a terminal heredoc paste → restored via `git checkout` and re-appended cleanly (editor-staged temp files + short `cat`); a concurrent VISUAL push landed mid-session (QA-V-027/028 results fixture + QA-V-029 overlays direction — outside this approval scope, no impact on verdicts) → integrated by reset-to-theirs + re-append. Both entries pushed as visual `68addb4` (base: their HEAD `b8b5739` reviewed; requests `af4d800`).
- **AI Nexus (NX-01):** unreachable again this session (HTTP 404, repo page + raw AGENTS.md); standing practice from last verified revision `cdbaf035` continues.

**Next:**
1. VISUAL: corrected ☿/♅ candidates + Uranus B/D reference sync → fresh-session GAME visual pass → **QA-G-013**; masters + derivatives + hashes → export/integration gate.
2. GAME review of VISUAL's new requests: QA-V-027/028 (results screen concept + fixture) and QA-V-029 (overlays direction with mandatory behavior corrections — verify the engine-behavior claims vs `Overlays.tsx`/`game-core`: no cancel on forced choices, dynamic reinsert range, Storm Shout once-per-match redirect, Scan never reorders, Tractor exact count, handoff privacy).
3. **Gábor: the 19 D-042 license sign-offs** (blanket + exceptions fine).
4. On license clearance: first import → `docs/visual-studio/import-log.md`; VISUAL released onto remaining v1 lanes; then icon inventory (QA-V-013), dev visual harness, M3 remainder → M4 RC.



## Session 17 — race visuals: captain direction review (all 8 owner-selected bases) → QA-G-010: 7/8 textual PASS (2 mandatory corrections), 1 NEEDS_VISUAL_REFERENCE — 2026-11-27 ✅

**Dev plan step executed:** owner request ("check the direction of the races visuals — we just created the bases; if not satisfied, explain and commit your feedback") + VISUAL's QA-V-021 review gate. Docs-only: engine untouched.

- Pulled the visual repo: a full **captain-direction cycle** landed after the V6 approval (their D018) — sprint docs (Mercury 02–08, Venus 09–12), `CIVILIZATION_PORTRAIT_CHECKPOINT.md`, `CAPTAIN_AUDIT_2026-11-27_AGENT_TAKEOVER.md`, `contracts/civilization-portraits.json` (v0.1-concept), and **owner selections for all eight captains**: ☿ Mercury B low quadrupedal cast-glass sprinter · ♀ Venus B flowing translucent masked cloud organism · 🌍 Earth young-adult human engineer (Amara "Warranty Void" Okafor) · ♂ Mars nonhumanoid industrial salvage organism · ♃ Jupiter faceless atmospheric manta · ♄ Saturn "Ring Weaver B" clean faceted crystal (no body-wrapped hoops; prize-orbit deferred to wider scenes) · ♅ Uranus angular ice geometry (B vs D open) · ♆ Neptune flowing blue bioluminescent organism. QA-V-021 = the textual concept-review gate this session answers.
- **Verdict committed as QA-G-010** (visual mailbox, base @ their HEAD `6f939e7`): **7/8 textual PASS** · **2 mandatory corrections** — ♄ Saturn's purple/gold ribbons must move to the Codex triad pale gold + ring-platinum + hexagon teal (purple is in nobody's palette and collides with Uranus's one vertical-magenta accent at chip sizes), ♃ Jupiter's ceremonial pressure suit must be explicit in the master brief (Codex: "gaseous manta giants IN ceremonial pressure suits"); **1 NEEDS_VISUAL_REFERENCE** — ♅ Uranus B-vs-D pick (binaries not synced; canon selection criteria provided: drafting-instrument anatomy, ONE magenta accent, the "True Level" level/tilted gag, 48 px grayscale vs Saturn).
- Mandatory canon markers recorded per faction for the masters (Mercury: cast glass, gold seams = service history, visor-slits, **no visible mouth**, 5° lean, sails = engine · Venus: never-removed mask + warm triad champagne/rose-copper/acid-cream · Earth: the junk visible and loved · Mars: welded seams, stencils, rust/bone/oil, drill lineage in some form · Neptune: chartreuse glow as warning signal, restrained glare) + **differentiation matrix** (♀/♆ = highest collision risk, warm-vs-cold split mandatory; ♂/🌍 junk schism visible; ♄/♅ resolved by the palette swap) + tone gate ("rude, not grim" — impudent competitors, never menacing).
- **Honesty flag kept:** TEXT-ONLY review — no captain binaries were seen (not synced to Drive); stated explicitly in QA-G-010; final per-captain verdicts await masters + 600×800/512 crops + hashes at real UI sizes.
- **Answered VISUAL's QA-V-020 question:** no portrait slot exists in the live UI today — faction identity is a text chip (~11.5 px) + glyph (~17 px); masters must survive the 512×512 tile, the 600×800 crop and 48 px grayscale, keep a central ~60% safe area, and carry no baked text or faction glyphs (☿♀🌍♂♃♄♅♆ are UI-layer marks).
- Canon register confirmed (Codex names/callsigns only; invented board names — Ivy Patch, Axis Architect, Ring Curator — dead); no GAME objection to the owner's Mercury/Venus B picks overriding VISUAL's A-recommendations.
- AI Nexus (NX-01): 404 again this session (repo page + raw `AGENTS.md` on main **and** master); VISUAL's relayed D019 completion gate adopted; noted in QA-G-010.
- **Unchanged: D-042 licensing — the 19 per-card owner license calls remain the only V1 release gate;** nothing imports or publishes.

**Next:**
1. VISUAL: independent masters (Batch 01: ♃♄♅♆ first) → private Drive sync + hashes → GAME visual-inspection gate (image protocol incl. 48 px grayscale + the differentiation matrix) → QA-G-011 per-captain verdicts; Uranus B/D decided via QA-G-010 criteria.
2. **Gábor: the 19 D-042 license sign-offs** (fused table delivered in session 16; blanket + exceptions fine).
3. On license clearance: first import → `docs/visual-studio/import-log.md`; VISUAL released onto remaining v1 lanes; then icon inventory (QA-V-013), dev visual harness (`LO_ASSET_DIR`), M3 code remainder → M4 RC.


## Session 16 — V6 art sign-off COMPLETE: 19/19 vision-audited, all PASS, zero change requests; VISUAL's three open decisions accepted; QA-G-009 posted — 2026-11-27 ✅

**Dev plan step executed:** handover FIRST TASK (docs/22) — the per-card art verdict table (19) → QA-G-009, fused D-042 licensing rows presented to the owner. Docs-only: engine, server, sims, UI untouched; no rules change (no test gate required).

- **Fresh image budget held the full pass:** all 19 images (18 faces + card back) inspected at ≤340 px thumbs in batches of 2–3 — zero omissions, nothing deferred this time (fresh chat = fresh budget, as the handover predicted).
- **Hash gate re-run first** (regenerated `/tmp/verify_v6.py`): **19/19 SHA-256 MATCH** vs manifest `0.26-v6-manufactured-review`, 0 mismatched, 0 missing — the mounted set is the reviewed set.
- **Verdict: 19/19 PASS, zero CHANGE_REQUESTs.** Highlights: **Solar Wind reads ACTION — the V5 blocker is closed**; Reversal ("persists" + all-counts no-draw) and Boarding (no invented conditional) text fixes confirmed on the faces; Containment bubble, Deflector glance-off, Burn pristine hull, Scan abstract returns (privacy honored), Tractor drift-to-discard, Flyby station-pass all match their QA-G-005 briefs.
- **VISUAL's three open decisions accepted as delivered** (owner still arbitrates): Deflector junction glow = deflection energy, not impact harm; Containment generic ship = right call for a faction-neutral card (the set varies ships per face); Tractor sparks/drift = release truth, not theft. Full per-card table in **QA-G-009** (visual repo `Q_AND_A.md`).
- **Set-level audit clean:** categories 2 catastrophe / 1 survival / 13 action / 2 component exact vs engine; uniform frame family with distinct category colors, never color-only; emblems confined to template plates; no text-as-art/posters; single subject everywhere. Non-blocking notes: Tractor is the busiest face (still one coherent scene); the "REVIEW EDITION" footer must swap in the production template before runtime/print; 320 px legibility belongs to the real-UI harness pass.
- **QA-G-009 posted** to the visual mailbox (append-only, fresh pull first; their HEAD `0c01dc4` unchanged since QA-G-008 — no V7, no concurrent entries). Publication hold stands until licensing lands.
- **AI Nexus (NX-01):** unreachable this session — HTTP 404 on raw `AGENTS.md` and the repo page; no local clone found on this Mac. Standing practice continues from the last verified revision `cdbaf035` (session 11); a docs-only art-verdict session raises no nexus-level questions.
- **D-042 fused table → owner (the decision that remains):** art column = GAME's verdict (this session); license column = **Gábor's per-card call — 19 sign-offs pending**. Manifest still carries `rights: "unverified"` on all V6 assets, and the art is generated via external AI tools, so public-distribution clearance is genuinely open (a blanket decision + per-card exceptions is a valid form). On sign-off: first approved import lands in `docs/visual-studio/import-log.md`, and VISUAL is released onto the remaining v1 lanes.

**Next:**
1. **Gábor: the 19 D-042 license sign-offs** (fused table delivered this session; blanket + exceptions fine).
2. On license clearance: first import → `docs/visual-studio/import-log.md`; VISUAL released onto non-card v1 lanes (menu/command-deck/reaction polish, faction portraits, icon integration).
3. Semantic icon inventory (QA-V-013 ask) — one docs session.
4. Dev-only visual harness (`LO_ASSET_DIR`) — real-app screenshots incl. 320 px card legibility.
5. M3 code remainder: Derelict spectator view + Final Transmission entry → M4 RC (galaxy deal-code polish).


## Session 15 — V6 complete card set: hashes 19/19 clean · text parity 18/18 PASS; art sign-off queued next session (vision budget spent) — 2026-11-25 ✅

**Dev plan step executed:** owner's ask — review VISUAL's finished V6 production and approve if satisfactory; owner accepted the session-14 ideas (licensing fusion, template/art-layer split, pictograms-before-baking, dev harness, v1/v2 split → D-044 ADOPTED, docs/21 amended). Docs-only for the game repo.

- **V6 received** (their `16ecd43`, manifest `0.26-v6-manufactured-review`, Drive "Card Collection V6 - complete set for joint approval"): 18 uniform faces + **card back** + 18 separate art layers + 4 category frames + `card-data.json` + CSS/tests. The fixed-template + art-layer production form (session-14 idea) is real — generated text can no longer become authority by construction.
- **Hash gate: 19/19 clean** (18 faces + back) from the Mac mount vs manifest; 6 auxiliary manifest entries (pack ZIP under its manifest name, gallery, sheets) cloud-pending as usual — pack contents reviewed via the mounted ZIP.
- **Text parity COMPLETE: 18/18 PASS, zero semantic errors** — `sourceRulesStatus = EXACT_ENGINE_EXPORT` verified against live `CARD_INFO`; every QA-G-007 text fix confirmed in `card-data.json` (Reversal persists + no-draw at all counts; Boarding conditional removed; Wind on-draw action truth). Full per-card review in QA-G-008.
- **Art sign-off deferred one session — honestly:** the harness's per-session image budget was spent in the V5 round (7 faces seen) and did not recycle this session (even 84KB singles dropped). Nothing rejected; the per-card PASS/CHANGE_REQUEST table (all 19, including their three open decisions: Deflector junction glow, Containment geometry, Tractor sparks/direction) is the FIRST item of the next session. **QA-G-008** posted with the partial verdict; VISUAL asked to hold publication until it lands; D-042 unchanged.
- **D-044 ADOPTED** on the owner's word — docs/21 amended same commit: v1.0 visuals = "Classic complete" (cards + UI polish); 3D backdrop optional; living-table/cinematic = v2 lane (M2 re-titled).

**Next:**
1. **First item next session: the per-card art verdict table (19) → QA-G-009.** On PASS, the owner releases VISUAL onto the remaining v1 requirements. Handover: `docs/22-agent-handover.md` — the owner starts a fresh chat with its starter prompt (fresh image budget).
2. Owner may start VISUAL on non-card v1 lanes (menu/command-deck/reaction polish, faction portraits) in parallel — card text is approved and art direction is approved; only the 3 flagged cards carry change risk.
3. Per-card D-042 licensing sign-off fused into the art verdict table (session-14 idea).
4. Icon inventory (QA-V-013) + dev-only visual harness (QA-G-004 B).
5. M3 code remainder: Derelict spectator view + Final Transmission entry.


## Session 14 — vision enabled: V5 card faces audited (18/18 hashes · 6 faces inspected), direction approved with punch list; v1/v2 reconciled (D-044 proposed) — 2026-11-25 ✅

**Dev plan step executed:** owner's ask — verify the visual agent's V5 card-face delivery (GitHub `b8fc6fc` + Drive), approve or reject to unlock the next visual tasks; reconcile the v1/v2 release framing. Docs-only for the game repo (no engine/app change; tests untouched).

- **Vision works.** The owner switched this harness to a vision-capable model — GAME read card art directly from the Drive mount (the QA-G-005/006 answer validated in practice).
- **Hash gate:** 18/18 V5 review faces SHA-256-verified against manifest `0.25-v5-face-review` (new `/tmp/verify_v5.py`; all synced to the Mac mount, 0 mismatched, 0 missing).
- **Visual audit — 6 of 18 this session** (the harness's per-session media budget is rolling; the remaining 12 are queued first-next-session): **Override, Burn, Scan, Slingshot, Boarding, Reversal — all PASS their QA-G-005 briefs** (single subject, mechanic truth, no posters/collages, nothing harmed). Baked-text parity vs live `CARD_INFO`: **Reversal wrong twice** (the direction flip persists — not "remainder of the turn" — and the no-draw turn-end applies at all player counts), **Boarding invents a containment conditional** (a stolen 🛡️ just goes to the thief's hand); **Override flag retracted after engine check** (baked line matches the live blurb verbatim).
- **Cross-checks vs their QA-V-016/CARD_V5_QUALITY_REVIEW:** categories 2 catastrophe / 1 survival / 13 action / 2 component verified exact in `cards.ts`; **Wind = action confirmed** → their "blocker" stands (catastrophe-styled face on an action card); their Tractor/Deflector/Containment refinements + action-frame normalization adopted into a joint punch list (QA-G-007 posted to their mailbox at their HEAD `b8fc6fc`; one concurrent-write rebase tangle resolved by reset-to-theirs + clean re-append, their QA-V-014/015 acknowledged side-by-side).
- **Verdict:** direction approved → punch-list work proceeds; not runtime-ready; D-042 import gates unchanged. Production-form recommendation re-logged: fixed CSS template + art-layer split so generated text can never become authority.
- **v1/v2 reconciled:** the visual repo's `RELEASE_1_VISUAL_SCOPE.md` matches the owner's framing — **R1 = polished Classic card game** (18 rights-cleared art IDs, one back, engine-sourced text, controlled UI upgrade, playable checks, owner acceptance) · **R2 = moving environments, faction ships, event FX, cutscenes** (premium-motion gate intact). This supersedes docs/21's v1.0 "living table rung 1" scope — **D-044 PROPOSED**: the shipped D-041 3D backdrop stays in the build as an optional toggle, not a v1 release requirement; docs/21 amended on the owner's word.

**Next:**
1. GAME: remaining 12 V5 face inspections + full parity pass of proposed display copy vs `CARD_INFO` (next session, media budget fresh).
2. VISUAL: punch list per QA-G-007 (Wind restyle, Tractor/Deflector/Containment refinements, frame normalization, Reversal/Boarding text regen).
3. D-044 owner call: v1.0 = Classic complete; v2 = cinematic — docs/21 amended on approval.
4. Icon inventory (QA-V-013 ask) + dev-only visual harness (QA-G-004 B).
5. M3 code remainder: Derelict spectator view + Final Transmission entry.
6. D-042 per-import licensing calls (fuse into the per-card art approval pass).


## Session 13 — Galaxy seed (D-043): player-friendly deal codes, server-owned online deals — 2026-11-25 ✅

**Dev plan step executed:** Gábor's competitive-integrity directive — the seed must stay a feature but must never be player-settable against real competitors, and needs human-facing copy. Engine untouched (pure server/UI layer); M3 scope unaffected.

- **Setup screen: "Seed" → 🌌 Galaxy seed** with the owner-approved copy — *"every number is a different galaxy: same number, same luck, every time"* — plus a 🎲 "new galaxy" re-spin button. The description teaches what it's for now: identical-deal rematches and share-a-deal-with-a-friend races, and states plainly that online matches are always dealt by the server. Local hotseat/solo keep the field (default random) — D-043.
- **Online: the seed is the server's, full stop.** `LastOrbitRoom` now **ignores any client-supplied seed** on `start`. The old `msg?.seed ?? …` path let the host inject a memorized deal *invisibly* — views deliberately hide the seed from the other seats, so victims could never even suspect. Unpinned rooms deal crypto-random (`node:crypto`); the bot stream re-keys to the dealt galaxy; room-creation `options.seed` remains a server-side pin for tests/dev. `OnlineConn.startMatch()` no longer carries a seed (`'start' {}` on the wire); `net.ts` protocol comment + `docs/17-online-architecture.md` updated.
- **Test:** +1 — a modified client sending `start { seed: 777 }` at an unpinned room still gets a server-dealt galaxy (≠777), privacy audit intact. All prior room tests now pin determinism via server-side room options (identical behavior — each already matched its old wire seed). **112/112 tests, typecheck ×3 green.**
- Session also answered the owner's questions: the seed explainer (determinism → replayable matches, stable tests, the online replay-attack guard) and the model switch (GLM-5.4 + Cline "Support Images" — empirically proven the current model can't see images; vision on the Coding Plan costs nothing extra).

- **Same-day follow-up:** D-043 propagated to the visual channel — handoff screens inventory + `visual-game-export.json` Setup line refreshed (the export previously still said "seed"), test-count drift fixed (110→112); **QA-G-006** posted to the visual mailbox so VISUAL treats the Galaxy seed block as current Setup UI. Per the owner's word, `docs/21` M4 now carries a release requirement: polished human-friendly deal codes in v1.0 (bare number input is prototype-only).

**Next:**
1. M3 remainder: Derelict spectator view + Final Transmission entry → M4 release-candidate pass.
2. VISUAL recreates the failed nine per QA-G-005 → GAME re-verifies hashes and reports.
3. Semantic icon inventory for QA-V-013 (one docs session).
4. Dev-only visual harness (QA-G-004 B): env-gated `LO_ASSET_DIR` loader.
5. Gábor: 10-min screenshot session (QA-V-003) · D-042 per-import calls · model switch to `glm-5.4` + "Support Images" when convenient.


## Session 12 — M3 online-hardening essentials shipped (countdown ring · turn timers · auto-reconnect) + owner-directed card-recreation solution (QA-G-005) — 2026-11-25 ✅

**Dev plan step executed:** release-plan M3 (docs/21) — the four hardening essentials. Shipped: reaction countdown ring, turn-timer display, reconnect overlay; autopilot notices were already live from the D-036 spike. Remaining in M3: Derelict spectator view + Final Transmission entry. Engine untouched (pure server/UI layer).

- **Every online snapshot now ships the pending decision's deadline** — `timer { seat, kind: 'turn'|'reaction'|'choice', at, now, ms }` (`apps/server/src/views.ts`, `room.ts`): deadlines are recorded when `armTimers()` fires inside `commit()`, so no snapshot can ever carry a stale clock; the viewer's own deadline is preferred, other viewers get the earliest (whose move the match waits on). Spectators: earliest. Hotseat has no timers → the UI badge renders nothing there.
- **Client countdown surfaces** (`apps/hotseat/src/ui/Overlays.tsx`, `GameView.tsx`): `CountdownRing` — an SVG ring that drains gold, turns red and pulses under 10 s — sits on the decider's own windows (reaction window, storm/snag/give/reinsert choice modals); other seats see a quiet "⏱ name — Ns" chip; the HUD shows the turn timer ("your move" gold-outlined when it's ours). Clock skew derived per snapshot from `at`/`now`, ticking locally at 4 Hz between snapshots.
- **Auto-reconnect overlay** (`apps/hotseat/src/online/OnlineApp.tsx`): any non-consented drop now triggers automatic seat-restoring reconnection — 4 tries (0/2/5/10 s, inside the server's 30 s seat-hold) under a scrim that keeps the frozen table visible; the manual "Connection lost" screen remains only as the fallback. Reconnect snapshots arrive with the live countdown (the reconnected player instantly sees how long they still have).
- **Test:** `room.test.ts` +1 — the countdown rides every view (own vs earliest), flips to the respondent when a reaction window opens (seed 4242 drives a real 🌀 play), and the full privacy audit runs over every snapshot the clock travels with. **111/111 tests, typecheck ×3 green.**
- **Visual track, same session (owner's ask):** their `2ad1a1b` pulled (first pass complete: 9 usable candidates / 9 failed-deferred, 18 named layout previews, QA-G-004 A–E accepted) + concurrent `32e4ff2` (QA-V-013: owner-directed game-wide pictogram upgrade program, V3 design system). Independent verification re-run against manifest v0.20: **31/31 SHA-256 match** on the Drive mount (new Tractor/Wind art + layouts included); 12 newest review files not yet synced down to this Mac — their own flagged caveat, cloud copies stay authoritative.
- **QA-G-005 posted to their mailbox (their repo `32e4ff2..1d204aa`, concurrent-write protocol ran clean):** the owner-directed joint solution for the 9 failed cards — engine-grounded one-scene briefs for each (mechanic truth + the single moment + what must NOT be implied, e.g. Burn = evasive acceleration, hull pristine, never fire damage), anti-poster prompt constraints (no text/frames/collages, single subject, 4:3), style anchoring on the 9 successes (Coolant = component template, Flyby/Requisition = action template), D013 bounded retries, delivery to manifest v0.21. Recreation authorized by the owner's session word (this supersedes the QA-G-004 retry hold; D-042 import gates unchanged). Tractor-Snag/Deflector/Containment revision notes included. QA-V-013's icon-inventory ask acknowledged and queued.
- **Owner's "let GAME see the cards" question answered:** it is a model-capability switch in the agent harness (vision-capable model in Cline/VS Code), not a repo setting — with it on, GAME can inspect the WebPs/PNGs directly; until then visual judgment stays owner-side + harness screenshots.

**Evidence:** `npm test` 111/111 · `npm run typecheck` green · visual verification `/tmp/cardhash_v20.txt` (31/31, live run) · both repos pushed (game: this commit; visual: `32e4ff2..1d204aa`).

**Next:**
1. VISUAL recreates the failed nine per QA-G-005 briefs → GAME re-runs the hash verification and reports.
2. GAME: semantic icon inventory for QA-V-013 (every inline rules symbol, faction glyph, HUD/status/reaction/navigation emoji, sizes, constraints + a semantics-preserving vector mapping proposal) — one docs session.
3. Dev-only visual harness (QA-G-004 B): env-gated `LO_ASSET_DIR` Drive loader — QA-V-011 cards in real app chrome (320px floor) + QA-V-007 GLB checks (4 sail pivots, 104-track morphs, 3-texture material, fps report).
4. M3 remainder: Derelict spectator view + Final Transmission entry → M4 release-candidate pass.
5. Gábor: 10-min screenshot session (QA-V-003) · D-042 per-import licensing calls · optional: switch the harness to a vision-capable model so GAME can review card art directly.


## Session 11 — visual status audited, card batch independently verified 15/15, AI Nexus adopted, joint conclusion proposed (QA-G-004) — 2026-11-25 ✅

**Dev plan step executed:** Gábor's ask — check the actual status of visual developments, negotiate where we are with the other agent, agree a conclusion, report it to the owner for review. Docs-only session: engine, server, sims, UI untouched.

- **QA-G-003 ACCEPTED by VISUAL — the concurrent-write protocol is now permanent on both sides.** They run the equivalent compare-and-swap (`update_ref`) in their connector; both sides refresh-then-write, append-only, no force-push ever, every entry carries a base-commit hash. First full cycle ran clean this session (their `9bb5ffd` → my `dbe11f8`, zero conflicts). **QA-V-005 formally closed by originator** (transport gate passed; every future file still individually verified pre-import).
- **Their side moved hard (7 commits, `4eee802`→`9bb5ffd`):** four-category card pilot delivered → first-pass register **7 success candidates / 9 failed-deferred / 2 unattempted** of the 18 identities (deflector, flyby, requisition, storm, coolant, rupture, containment + common back are candidates; override, burn, scan, slingshot, boarding, reversal, salvage, ion_surge, hull deferred under the owner-directed bounded-retry rule D013; tractor, wind untouched) · **Release-1 Classic-first scope** defined on their side (owner-directed: complete 18-card set → controlled UI upgrade → package/license → acceptance; cinematic enhancements deferred to Release 2) · joint review register (`CARD_REVIEW_REGISTER.md`) with owner+GAME review columns.
- **Independent verification of their batch — 15/15 SHA-256 MATCH, 0 missing:** all runtime-relevant LO-CARD assets re-fetched from the Drive mount and hashed against their manifest v0.19-card-deferred (7 candidate WebPs + back SVG + 3 masters + 3 thumbs); this closes the "no per-file cloud checksum roundtrip" gap they honestly flagged. Pixel dimensions verified: 7× exactly 1200×900, 3× exactly 600×450 — conforms to the QA-G-002 approved spec. **Honest limit:** no artwork was visually inspected this session (model lacks image input) — visual-quality judgment stays with the owner + the future harness screenshots; my read of *process* quality: high (honest failure register, provenance, bounded retries, no premature approval claims).
- **AI Nexus adopted (their QA-V-NEXUS-001, owner-authorized):** read at HEAD `cdbaf035` (README v0.1.1 — 5 mandatory duties NX-01–05, 128 registry entries); NX-02 duty embedded as **AGENTS.md rule 6 (this commit)**; no conflict found with standing GAME practice. Local clones of the drive-hash script + report kept out of the repo (`/tmp`).
- **QA-G-004 — joint conclusion proposal A–E posted to their mailbox:** (A) VISUAL finishes the 2 unattempted cards, holds the 9 retries until joint review; (B) GAME builds the dev-only visual harness next dev session — env-gated `LO_ASSET_DIR` Drive loader so zero studio assets enter this public repo (D-042 untouched), one harness covering QA-V-011 (cards in real app chrome, 320px floor, hand/log never obscured) + QA-V-007 (GLB pivots/morphs/material/fps); (C) joint review after first-pass coverage (owner visual + GAME technical report, per their D013/QA-V-012); (D) then D-042 per-asset licensing → first import → `import-log.md`; (E) M3 online-hardening proceeds independently in parallel. Plus the QA-V-011 slot answer (UI order + portrait 48/40/28px + backdrop sizes) and the QA-G-002 flexible-expanded-height acceptance. **Confirmation requested from VISUAL; the conclusion goes to Gábor for review and direction.**

**Evidence:** docs-only — verification script + 15/15 report (SHA-256 + sips dimensions, run live); visual repo pushed `9bb5ffd..dbe11f8` after fresh pull; this repo: AGENTS.md rule 6 + this entry, pushed.

**Next:**
1. VISUAL confirms/amends QA-G-004 A–E; **Gábor reviews the joint conclusion → his direction decides the track order.**
2. **Dev-only visual harness** (QA-V-007 GLB + QA-V-011 in-app card placement; env-gated Drive loader) — next dev session, unblocked.
3. Gábor: 10-min screenshot session (QA-V-003 follow-up).
4. Gábor: D-042 licensing call per import — first approved import lands in `docs/visual-studio/import-log.md`.
5. M3 online-hardening essentials (reaction countdown ring, reconnect overlay) → M5 `git tag v1.0.0`.



## Session 10 — QA-V-005 retrieval proof (Drive verified 4/4), give/snag_discard visibility ruling, concurrent-write protocol proposed — 2026-11-25 ✅

**Dev plan step executed:** Gábor's three asks — adapt to the concurrent-visual-production reality, verify his Drive install actually works, and a human-wording status + needs list. Docs-only session: engine, server, sims, UI untouched.

- **QA-V-005 retrieval proof — 4/4 SHA-256 MATCH.** Gábor installed Drive for Desktop and signed in; the warehouse mounts locally at `~/Library/CloudStorage/GoogleDrive-…/My Drive/AI/Last Orbit` (read-only use — no Drive API, no tokens). Fetched the reference PNG + all 3 Mercury GLBs and verified byte sizes + SHA-256 against their manifest v0.14-card-pilot: LO-SYS-QUALITY-REF-001.png `7c79c8fd…a23f0` · LO-MER-SHIP-3D-001.glb `75bc078a…83d2f` · LO-MER-SHIP-3D-002.glb `2e9261c5…df89` · LO-MER-SHIP-3D-003.glb `18642e45…80a1` — all match. Proof posted to their Q&A; closure is VISUAL's to confirm (originator rule). **QA-V-007 (GLB harness) is now unblocked.**
- **give/snag_discard visibility ruling (their QA-G-002 open issue) — source-verified across all three enforcement layers:** `give` = public with `card` in the payload (commands.ts:307, addLog default) and `seatView` passes public entries to every seat unmodified — only `draw` is card-stripped for other seats (views.ts:27–37) · `snag_discard` = public with `cards` (commands.ts:342 — necessarily: the cards land in the public discard pile). The handoff's §5 requisition row and QA-V-009 note wrongly said "card identity private" (the export JSON was correct) — **both corrected as errata in this commit**; ruling + citations posted to their Q&A. Cinematics may show the transferred face or keep it sealed — both privacy-safe; snag-loss identities must be showable.
- **QA-G-003 (new) — concurrent-write coordination protocol proposed** in their mailbox: refresh-then-write (pull + re-read immediately before composing edits, append-commit-push in one short window) · owned zones (VISUAL owns its docs/contracts/memory files; GAME writes only Q_AND_A.md appends + pre-announced pointer fixes) · push-rejected → pull --rebase → keep both sides chronologically → push · no force push ever · every entry carries its base-commit hash. Rejected alternative: freeze flags — they can't be seen without refreshing first, so dynamic refresh-then-write strictly dominates. Their confirmation requested; this session already ran the protocol (pulled to their `6ca0066` before writing).
- **QA-G-002 reply (card pilot review, dimension/privacy gate):** approved against the live build — compact hand 120–160 CSS px matches the current `.card` min-width 128px (styles.css:89) · 4:3 art 1200×900 + 600×450 thumb + 5:7 card 720×1008 reference + captain 512²/600×800 approved · mobile must reflow ≤880px, test to 320px · category signal never color-only (hard accessibility rule) · Classic/Cinematic = same card components, identical rules info · uniform card back approved. D-042 licensing gate unchanged: no import without per-asset owner sign-off + public-distribution license.
- **Their side moved too (their `6ca0066`):** QA-V-001 resolved for the export snapshot (they independently re-checked 18 CARD_INFO entries against cards.ts) · card-production pilot started (Solar Rupture WebP, private manifest LO-CARD-RUPTURE-*) · first event-mapping candidates proposed (harness references only) · their Q&A protocol questions answered above.

**Evidence:** docs-only — typecheck ×3 + 110/110 tests re-run green; SHA-256 proofs above; game repo pushed (errata + this entry); visual-repo mailbox entries committed and pushed after a fresh pull (protocol in action, base @ 6ca0066).

**Next:**
1. VISUAL confirms/amends QA-G-003; both sides then run it permanently.
2. **QA-V-007 GLB renderer harness** (dev-only page: 4 sail pivots, 104-track morph playback, 3-texture material, draw-call/fps report) — now unblocked, next dev session.
3. Gábor's 10-min screenshot session (QA-V-003 follow-up: menu/lobby/faction-pick/match/reaction/game-over/mobile).
4. Gábor's D-042 licensing call per import — first approved import lands in `docs/visual-studio/import-log.md`.
5. M3 online-hardening essentials (reaction countdown ring, reconnect overlay) → M5 `git tag v1.0.0`.


## Session 9 — visual-studio technical handoff shipped (D-042): the full game export for the OpenAI-studio repo — 2026-11-25 ✅

**Dev plan step executed:** Gábor's parallel visual production repo (`last-orbit-visual-studio`, private) reached the point where its whole QA queue (QA-V-001…009) blocked on GAME's authoritative export — delivered as a complete handoff. Docs-only session: engine, server, sims, UI untouched.

- **`docs/visual-studio/` (new, this repo):**
  - `VISUAL_STUDIO_TECHNICAL_HANDOFF.md` — 13 sections answering their queue end-to-end: repo facts + quality gates · render stack (plain three.js 0.187, no R3F — D-041) + budget proposals (60/30 fps floor, ≤ 25 MB first import, lazy-after-first-paint) · game model · the 18-card catalogue · all 8 faction powers (incl. their QA-V-008/009 animation notes: Flare Skip chain semantics, Court Favor reversal) · all 43 authoritative event types with payloads, visibility and source lines · the full privacy map · screens inventory (screenshots impossible from this environment — a 10-min capture session with Gábor proposed) · the event-contract adapter mapping (QA-V-004: `eventId = ${matchId}:${logIndex}`, private events filtered pre-emission, skip-always-safe by architecture) · the asset import protocol (QA-V-005: Drive retrieval + SHA-256 vs manifest + manifest-commit pinning + import-log) · the Classic/Cinematic two-mode presentation (owner requirement) · GAME's 5 ordered next commitments · the 51-row COVERAGE reconciliation (QA-V-001, incl. explicit no-engine rows).
  - `visual-game-export.json` — the machine-readable twin (16 top-level sections: cards, cardFamilies, factions, factionRules, 43 events, privacy, screens, uiConstraints, presentationModes, adapterVisualMap, importProtocol, coverageReconciliation…).
- **Verification caught real defects before shipping:** the first JSON draft carried `requisition` at ×2 copies (the engine's `BASE_DECK` says ×4 — the 46-card sum exposed it) and 4 non-verbatim card blurbs; both fixed in the JSON and the handoff table, then **every card field byte-verified against `cards.ts` `CARD_INFO`** (18/18 clean, 0 diffs) and all 43 event types confirmed unique with source anchors.
- **Cross-repo mailbox (their append-only protocol):** `Q_AND_A.md` got the first real GAME entry — **QA-G-002** (intro, export links, where each QA-V is answered, two asks: propose `adapterVisualMap` entries; card-art dimensions/WebP via `UI_PROPOSALS.md` review with the owner) + a QA-V-001 sync reply (deliverable landed; closure is VISUAL's to confirm) + the QA-O-001 acknowledgment their entry requested ("GAME to acknowledge on first read"). Their README repo pointer corrected (`last-orbit-game` → `last-orbit-game-glm-style`), PROJECT_STATE game-side update appended, committed and pushed there.
- **Governance:** D-042 logged (protocol adopted; **asset-import licensing gate explicitly OPEN** — studio assets are "all rights reserved pending license", this repo is public, an import publishes); PROJECT_CONTEXT hard rule 1 rewritten to match reality (Explorer = upstream-only after the D-041 port; visual assets enter only through the D-042 gate) + stale GitHub-remote line fixed.

**Evidence:** docs-only — **110/110 tests + typecheck ×3 re-run green**; JSON validated + source-verified by script; both repos pushed (game: handoff + D-042 + Session 9; visual: mailbox + README + PROJECT_STATE).

**Next:**
1. **Gábor (one-time setup):** install Drive for Desktop on this Mac → unblocks QA-V-005 closure (fetch the reference PNG + 3 Mercury GLBs, SHA-256 verify vs their manifest) and the QA-V-007 GLB renderer harness (dev-only page: 4 sail pivots, 104-track morph playback, 3-texture material test, draw-call/fps report).
2. **Gábor (D-042 gate):** the licensing call — every visual import needs his explicit sign-off + a license approved for *public* distribution before anything lands in this public repo.
3. 10-min screenshot session with Gábor (QA-V-003 follow-up: menu/lobby/faction-pick/match/reaction/game-over/mobile into their manifest).
4. M3 online-hardening essentials (reaction countdown ring, reconnect overlay) → M5 `git tag v1.0.0`.

## Session 8 — rung-1 polish: the action reads (responsive framing, ship scale, glass panels) — 2026-11-24 ✅

**Dev plan step executed:** Session 7's next-item #2 — Gábor's noted issue "the glass overlays still cover part of the action" — plus the second half found while measuring it: at the old fixed whole-system framing the camera sat ~615 u out, so each starship subtended **about 1 pixel**. Both halves fixed; engine, server, sims untouched.

- **Scene (`BackScene.ts`) — the action became legible:**
  - **Viewport-responsive framing** (`frameFor`): camera distance now derives from the real aspect (a tilted orbital disc needs less vertical reach than a face-on ring — the 0.68 factor), landing at **~302 u on landscape** instead of the fixed 615 u, with a 280 u floor and a phone-safe portrait pull-back; `resize()` re-derives it live. Neptune still fits — the tilt buys the reach.
  - **Starships ~3× bigger** (hull capsule 0.55 × 2.0 + nose, engine glow 0.6, active-captain gold ring 1.5) — symbolic scale, chess pieces on the board; lanes stay inside the belt corridor (144 + 9/seat, still between Mars ~138 u and Jupiter ~186 u).
  - Effects rescaled to match: flare shock ring 7–8.1 u sweeping ×22 (reaches the belt), burst sparks 24–40 u/s from 8 u, comet streak 1.1 u, arrival-flash and shield rings enlarged, fury light spike 8.
- **UI (`styles.css` only — `GameView.tsx` needed zero changes) — nothing solid sits over the orbital plane anymore:** the command section (hand + end-turn) was the last solid panel → 70 % glass + blur(14); log rail 340→264 px @ 78 % + blur(12); HUD/player cards 78 %→60 %; modal scrim 80 %→60 %; and the **reaction-window scrim thinned hard** — it used to darken the whole screen exactly when streaks and flares fire; now it fades from 72 % at the top to clear, with the opaque modal itself carrying the contrast. The logged readability rules all survive: reaction windows never hide the decider's hand (D-023/PT-00), the log rail stays pinned and full-history (D-021), modals still avoid the rail.

**Evidence:** typecheck ×3 · 110/110 tests · production build (CSS 9.77 kB; SolarScene lazy chunk unchanged at 572 kB min / 146 kB gzip) · dev-server live check (HTTP 200s, the edits visible in Vite's transform) · zero `__PART` markers · `d6441bf` confirmed pushed — the working tree held exactly this session's two code files before commit.

**Next:**
1. Gábor smoke test: the dev server is running — refresh `localhost:5173`, start a match, confirm the ships, the Sun and the card actions read through the thinned glass.
2. PC deployment session with Gábor (M0 completion — still awaiting his go-ahead).
3. M3 online-hardening essentials (reaction countdown ring, reconnect overlay) → M5 `git tag v1.0.0`.

## Session 7 — the Explorer becomes the backbone; the 3D shows the races and the action (D-041) — 2026-11-24 ✅

**Dev plan step executed:** M2 rung 1, act 2 — Gábor's feedback on the first slice ("decorative spheres aren't the point — I want to see the races and the card actions in the system") became **D-041**: his own **Solar System Explorer** (github.com/gabortardos/solar-system-glm) is now the game's visual foundation. Its data/sim/render core (18 files: Kepler orbits, planet+moon catalog, the compressed-scale system) was ported near-verbatim into `apps/hotseat/src/solar/` — exactly the use its README anticipated ("a background engine for other 3D games"; the Moon-showcase branch and 4K NASA textures were left out). On top of it, **`BackScene.ts`** composes: catalog planets + moons riding their real orbits for today's date (3 sim-days/real-second), a **starship per captain** racing the Mars–Jupiter belt corridor (race-colored hull and engine glow, play direction honored, active captain ringed gold, eliminated captains = dark tumbling derelicts on faded lanes), the **Sun wearing Fury** (calm gold → furious red; halo, wobble and light climb 0–5), and a **log-driven action director**: `rupture_reveal` = the Sun erupts (shock ring, particle burst, light spike) · targeted `play`/`give` = a comet streak arcing ship-to-ship with an arrival flash · `contained` = a shield pulse around the containing captain · `fury_up` = a halo flash. **`SolarScene.tsx`** was rewritten as a plain-three.js wrapper: react-three-fiber and its dep tree removed (the Explorer is vanilla three.js — one less dependency; deviation from the D-038 tech *candidate*, logged as resolved in D-041; `@types/three` kept but moved to devDependencies because three itself ships no type declarations). The lazy chunk stays separate (572 kB min / 146 kB gzip), prefers-reduced-motion renders a static frame, and no-WebGL devices keep the plain backdrop. Engine, server, sims untouched — **110/110 tests, typecheck ×3, production build, dev-server module check** all green. All prior commits were already on GitHub; this session's work commits and pushes with this entry.

**Next:**
1. Gábor: refresh `localhost:5173` → start any match → watch the captains' ships and the Sun answer the cards.
2. **Rebalance the UI panels over the scene** (Gábor's noted issue: the glass overlays still cover part of the action) — rung-1 polish, next dev session.
3. PC deployment session with Gábor (M0 completion — still waiting on his "let's do the PC setup").
4. M3 online-hardening essentials (reaction countdown ring, reconnect overlay) → M5 `git tag v1.0.0`.

## Session 6 — first visible 3D slice shipped + release green light (D-040); all commits pushed — 2026-10-25 ✅

**Dev plan step executed:** M2 rung 1 opened with real code (not docs): `SolarScene.tsx` (three.js + react-three-fiber, lazy-loaded chunk) — the living solar system now renders **behind the table in hotseat and online alike**. Sun = the Fury state (calm gold → furious red, glow and pulse rise with Fury 0–5); seats = planets on lit orbits (Mercury→Neptune colors by fleet, classic captains slate-grey; Saturn wears its ring; eliminated seats go dark); orbit direction follows play direction; the active captain's world gets a gold halo; starfield twinkle; prefers-reduced-motion → static; devices without WebGL fall back to the plain backdrop via an error boundary. HUD/player/log panels became translucent glass (backdrop-blur) over the scene. Engine, server, sims and the 110 tests untouched. Validated: typecheck ×3, 110/110 tests, production build, dev-server module check (HTTP 200).

**Release green light — D-040 (decision log):** Gábor: "I tested enough, I want to release" → the M1/P5 beta gate is **waived by owner decision**; family feedback moves post-launch. M0's first half done in-session: all 5 local commits **pushed to GitHub** (`958a042` on `main`). Remaining to launch: (1) the PC deployment session — the one part that needs Gábor's hands (~30 min, `docs/19`; walk him through click-by-click), (2) M3 online-hardening essentials (reaction countdown ring, reconnect overlay), (3) M5: `git tag v1.0.0` + the launch share.

**Next:**
1. Gábor refreshes `localhost:5173`, starts any game, and watches the system live behind the cards.
2. PC deployment session with Gábor (M0 completion).
3. Next dev session: M3 hardening + log-event light pulses (the animation director: light streaks between orbits on steal/contain events).

## Session 5 — "where are we now" round: full recap delivered; 3D vision APPROVED (D-038); v1.0 release plan adopted (D-039) — 2026-10-25 ✅

**Dev plan step executed:** planning session, no product code — Gábor asked for (1) a full remaining-work recap, (2) the 8-player call, (3) progression on the 3D vision ("i want to progress with that"), (4) a release plan. All four landed as decisions + docs:

- **D-038 PROPOSED → APPROVED** (Gábor's go-ahead, this session): rung 1 (the living table) opens NOW as the P3 visual lane, running parallel to the P4 beta — UI-only, engine untouched, so sims stay valid and the P5 "good game" gate stays the release arbiter. `docs/20` status + guards updated; roadmap P3 ⬜→🔄.
- **D-039 ADOPTED — v1.0 release plan**, new plan of record `docs/21-release-plan.md`: scope frozen (2–5 players; v0.3 rules; 8 civs active powers; hotseat/solo/online; rung-1 visuals; free, PC-tunnel hosting) · milestones **M0** deploy (blocked on Gábor: push + ~30-min PC session) → **M1** family beta (= P5 gate + rules freeze, carries PT-01/02 + the 8-power test) → **M2** rung-1 visuals (parallel, starts next dev session with 6 code-drawn style frames) → **M3** online UX hardening → **M4** RC → **M5** launch (`git tag v1.0.0`) · post-1.0 parking lot (passives D-035 → rungs 2–3 → Grand Fleet → P6 generator → monetization/title) · open questions Q1–Q4 for Gábor (beta host comfort, 2–5 confirm, audio/PWA, launch blast radius).
- **8-player question closed for v1.0:** deck math (51-card fixed deck → ~11 draw cards with 7 ruptures at 8p) + mission envelope 2–5 → **v1.0 ships 2–5**; "Grand Fleet" deferred to the parking lot with a documented trigger (family demand for 6+).
- **Recap delivered in the session reply** (roadmap leftovers + gathered-ideas inventory + what waits on Gábor). Still open from it: D-035 passives family pick (now post-v1.0) · Reactor Charge option A confirm (final call at the rules freeze, rides the beta).

**Evidence:** docs-only session — code, tests (110/110), typecheck and build untouched from commit `b0762ca` where they were last validated.

**Next:**
1. **M0 needs Gábor:** `git push` go-ahead (the local commits on `main` incl. this one) + the ~30-min PC deployment session per `docs/19`.
2. Next dev session opens **M2 rung 1**: the 6 code-drawn style frames first (browser-reviewable), then the three.js/react-three-fiber scene shell behind the card glass.
3. Awaiting Gábor (non-blocking): Q1–Q4 of `docs/21` · 8-power in-game test · beta scheduling · D-035 family pick · Reactor Charge option A (at freeze).

## Session 4 — online PT feedback round 1: reaction-window hand visibility + full flight log; 3D world vision logged (D-038) — 2026-10-25 ✅

**Dev plan step executed:** P4 online-mode shakedown — Gábor's first online-play feedback list triaged; the two concrete UX blockers fixed same-session; the three strategic items (faction powers status, 8-player question, grand 3D vision) answered/logged.

**Gábor's list → what happened:**
1. **"When deciding to allow/counter, the window covers my cards"** → FIXED, three layers:
   - `styles.css` `.overlay.react`: the reaction modal floats high and the scrim **fades to transparent above the table**, so the decider's hand panel at the bottom stays readable; clicks outside the modal pass through (the layer is inert, the modal isn't).
   - `Overlays.tsx` `ReactionOverlay` (now takes `viewer`): the deciding captain's own cards are mirrored as tooltip chips **inside the modal** ("🃏 Your hand:") — works even on small screens where the floating window still overlaps the table.
   - `App.tsx` viewer logic: in pass-and-play hotseat the view now follows the **first human who still owes a decision** during a reaction window (previously it stayed with the initiator — the bottom hand wasn't even the decider's). Private rail lines follow the same switch, which is *stricter* privacy, not looser.
2. **"I want the full gameplay history, not just what fits the screen"** → FIXED: the flight log's 40-entry cap is gone — the entire (visibility-filtered) history renders and scrolls; autoscroll now only fires when the reader is already near the bottom, so scrolling back is never yanked away by a fresh entry; the header shows the event count + hint.
3. **"How are the encoded race powers coming up?"** → status: **all eight are live** since D-031/D-033 (☿ Flare Skip · ♀ Court Favor · ♂ Salvage Run · ♃ Storm Shout · 🌍 Kit Bash · ♄ Ringwall · ♅ Axial Tilt · ♆ Deep Sight): fleet pickers in Setup **and** the online lobby, ready/spent chips at the table, 📖 Codex stories, bot opponents fly them. The *next* layer — **D-035 passives** — is still a brainstorm awaiting Gábor's family pick (`docs/14` §Passives).
4. **8 players instead of 5?** → analysis only, no code (it's a design decision): the deck is fixed at **51 cards** (46 base + 5 rupture/containment, independent of player count). 8 captains × 5-card hands = 40 dealt → **~11 draw cards left with 7 ruptures among them** — an instant bloodbath, not a game. A "Grand Fleet" 6–8p variant needs a scaled deck recipe (more base cards + more containments), cap lifts in engine (`createGame` 2..5) / server room clamp / Setup UI, and a full sim gate (turn length, reaction-window length with 7 respondents, Fury pacing). **Recommendation: stay 2–5 through the beta** (also the stated mission envelope); draft the variant as a proposal if big tables matter for family testing. Awaiting Gábor.
5. **Grand 3D visuals — "the card game engine sitting on a live, animated 3D solar system"** → captured as **D-038 PROPOSED**: new `docs/20-3d-solar-system-vision.md` + decision-log row + roadmap P3 pointer. Rung ladder: (1) living table = P3 (Sun Fury is the Sun's state, seats are orbiting planets, log events animate as light between orbits), (2) homeworld vignettes, (3) world mode — engine stays renderer-agnostic, readability outranks spectacle, glass UI survives as tactical/fallback mode.

**Evidence:** 110/110 tests green · typecheck ×3 ✓ · build ✓ (all after the UI fixes; engine untouched — sims remain valid).

**Next:**
1. **Gábor re-tests** (solo or online): every reaction window keeps his cards readable; scroll the flight log mid-game and confirm it doesn't jump.
2. Deployment per `docs/19` still pending: `git push` go-ahead for the two earlier commits + this one, then the ~30 min PC session (Node, clone, Cloudflare tunnel, `play.`/`lastorbit.` hostnames, Part A DNS/email-survival decision).
3. Awaiting Gábor: D-035 passives family pick · 8-player "Grand Fleet" go/no-go · D-038 vision confirmation (or edits).

## Session 3 — generator idea logged (D-037) + P4 item 2: client Online mode — 2026-10-25 ✅

**Dev plan step executed:** two things on Gábor's word ("log the new idea and your feedback for now… then the next dev step, the P4 online mode. go"):
1. **Generator idea logged** → `docs/18-generator-platform-vision.md` + decision **D-037** (PROPOSED, post-P5) + roadmap stub **P6**. The reframe is now project memory: the LLM fills a validated schema/menu (characters → power templates + flavor) and never invents mechanics; "generation opens a PR, the sim is CI, human playtest is code review"; nothing starts before the P5 gate.
2. **`docs/13` P4 item 2 — client "Online" mode — DONE** (architecture of record `docs/17`, unchanged plan).

**Shipped (P4 item 2):**
1. **`apps/hotseat/src/online/`** — `net.ts` (typed `@colyseus/sdk` wrapper: join/create by room code, `command`/`start`, `welcome`/`seats`/`state`/`started`/`reject`/`autopilot` routing, non-consented-leave detection, seat-restoring `reconnect()` inside the server's 30 s window) · `types.ts` (`SeatViewMsg`, `ClientGame`, `handSize`/`deckSize` — the UI's hidden-info helpers, kept in sync with `apps/server/src/views.ts` by comment contract) · `OnlineApp.tsx` (form → lobby → match screens; roster with room code + copy, host-only start, human-seats select = server bots online solo; own-draw reveal, reject/autopilot notices, connection-lost screen with reconnect; spectators get a roster screen pending the Derelict UX step).
2. **UI adapted, not forked:** `GameView`/`Overlays` now take `ClientGame` and ask `handSize`/`deckSize` instead of reading sealed hands/deck; `remote` prop relabels other captains 🌐 (chips, "answering on their screen…"); `DrawReveal` gained `nextNote`; `LOG_SFX` moved to `audio.ts` (shared). Hotseat/solo rendering unchanged.
3. **Privacy hardening found during wiring (server):** public `draw` log entries carried the drawn card to every seat — `seatView` now strips `card` from other seats' copies (own draws keep it; feed keeps `deckLeft`). Continuous test audit upgraded + explicit two-seat assertion.
4. **Evidence:** **104/104 green** (99 + 5 new client tests: protocol wiring ×3, hidden-info helpers ×2), typecheck (3 projects) ✓, build ✓, and a **live smoke through the real `@colyseus/sdk` against a booted server**: host create → guest join-by-code → start → sealed hands/deck (`handSizes 5,5,5`, `deckSize 39`) → **draw privacy live (drawer sees `"salvage"`, other seat sees `undefined`)** → spoofed command rejected at the sender. Smoke script deleted after use.
5. **Infra:** `@colyseus/sdk@0.18.9` added to `apps/hotseat` (lockfile updated); no vite proxy needed (Colyseus matchmaker sends CORS headers — direct `ws://localhost:2567` works from the dev server).

**What's left from the latest plan (`docs/13` + previous Next):**
1. ~~P4 client Online mode~~ ✅ → next P4 step: **online UX hardening** (reaction countdown ring, turn-timer display, reconnect overlay polish, Derelict spectator view + Final Transmission entry) → deployment (hosting choice still open for Gábor: self-host ~€5/mo vs Colyseus Cloud) → friends-and-family beta carrying **PT-01 (3p) + PT-02 (4–5p)**.
2. Worth a browser pass with Gábor: online mode on two devices/tabs (`npm run dev:server` + `npm run dev`), including a mid-match reconnect.
3. Waiting on Gábor (unchanged): in-game testing of the four v3 powers · **D-035** passives family pick + open slots (♄ ♅ ♂) · PT-F1 pretests · Reactor Charge option A confirm · generator idea go/no-go is **post-P5** by design.

## Session 2, small hours — P4 opens: authoritative online server (D-036) — 2026-10-25 ✅

**Dev plan step executed:** `docs/13` **P4 item 1 — "Authoritative server (Colyseus/PartyKit spike → choice, logged as decision)" — DONE** (D-036). This was the top developer-actionable item after D-033: every other open item waits on Gábor (power feedback, D-035 family pick, PT rounds) — and D-034 + "continue with the development plan" was the word for the spike.

**Shipped (D-036):**
1. **Decision:** **Colyseus 0.18** chosen. PartyKit eliminated — its hosted platform shut down **2026-10-23**, two days before the spike; plain-ws+Redis rejected (hand-rolled rooms/reconnect/matchmaking for zero product value).
2. **`apps/server` — `LastOrbitRoom`** wrapping game-core server-side: **authority** (commands are requests; `cmd.player` must match the sender's seat; engine validates), **per-seat privacy snapshots** (`seatView`: own hand only, deck→size, seed+rng sealed, log visibility-filtered, spectators handless), **server-flown bots** for unfilled seats (= online solo-vs-AI), **server timers with autopilot** (turn 120 s / reaction 45 s defaults; a stalled or disconnected human never stalls the match), **30 s reconnection** (0.18 `onDrop`/`onLeave` split, seat restored with a fresh snapshot), **spectator seats** (Derelict groundwork).
3. **Tests:** 6 integration tests via `@colyseus/testing` (real ws round-trips): privacy views · authority rejects · **a full online match, 1 human + 3 server bots → game_over, every snapshot privacy-audited** · autopilot timers · spectator · reconnection. **99/99 green** (93 engine + 6), typecheck ✓ (3 projects), build ✓, live boot smoke-tested on :2567. Engine untouched → sim reports remain valid as-is.
4. **Infra:** root scripts `dev:server`/`server`; tests pinned `--pool=threads` (vitest's default forks pool can't host the ws server — `apps/server/README.md`); CI unchanged (`npm ci` covers the new workspace via the lockfile).
5. **Docs:** new `docs/17-online-architecture.md` (architecture of record + ordered remaining-P4 plan) · `docs/07` Phase-4 section decided + changelog · decision log **D-036** (D-035 row briefly overwritten during the edit, restored same-commit) · roadmap P4 expanded to 5 ordered items · `PROJECT_CONTEXT` commands · this file.

**What's left from the latest plan (`docs/13` + previous Next):**
1. ~~P4 spike~~ ✅ D-036 → next P4 step: **client "Online" mode** (`@colyseus/sdk` wiring, lobby/room codes, seat roster, snapshot → existing view components).
2. Then in order: online UX hardening (reaction countdown ring, turn-timer display, autopilot notices, reconnect overlay, Derelict spectator view) → deployment (hosting choice is an open question for Gábor: self-host ~€5/mo vs Colyseus Cloud) → friends-and-family beta carrying **PT-01 (3p) + PT-02 (4–5p)**.
3. Waiting on Gábor: in-game testing of the four v3 powers (solo vs AI) · **D-035** passives family pick + open slots (♄ ♅ ♂) → sim + sign-off before engine · PT-F1 pretests per `docs/08` · Reactor Charge option A confirm.
4. Standing format: from this session on, every NOW entry (and session reply) states the executed dev-plan step and what remains.


## Session 1, late night — faction layer v3: 🌍♄♅♆ ship — all eight civs playable — 2026-10-25 ✅

**Phase:** Gábor signed off all four outer powers ("yes to all powers for now — I'll test them, once they are in the game") and pointed development at the product. Logged: PT-01/02 move to the online version (D-034 — "I'm mostly alone"), title deferred indefinitely, passive specialities brainstorm opened (D-035 — no code until it fits).

**Shipped (D-033):**
1. **Engine — the four outer powers, all opt-in per-seat, once per match, spent publicly (Pillar 4):**
   - 🌍 **Kit Bash** (`KIT_BASH`): one ❄️/🛠️ played as a completed pair — opens a real `pair` reaction window (one 📡 cancels the steal, victim may ↪️); the Component is paid, the power burns at initiation (baitable, like ♂).
   - ♄ **Ringwall** (`RING_WALL`): a theft aimed at ♄ (🪝/🤝/pair) fizzles — resolved instantly mid-window (nothing left to 📡); attacker's card stays spent; ⚡/🧲 destruction passes (the counterplay). `canRingWall` keeps the window waiting even on an empty hand.
   - ♅ **Axial Tilt** (`AXIAL_TILT`): an attack aimed at ♅ is re-aimed at a captain of ♅'s choosing with **no payload growth** (≠ ☿'s +1); shares the once-per-captain-per-chain limit; 2-player: slides straight back at the attacker; growth already on the chain is preserved; a later ↪️ grows normally.
   - ♆ **Deep Sight** (`DEEP_SIGHT`): instant private top-3 peek during your own Command Phase — no window (nothing to 📡); the bot feeds it into the 🔭 knowledge slot and actually dodges a seen ☀️.
   - Three implementation rulings logged in `docs/14` §v3 (♅ picks the re-aim · ♄ instant mid-window · ♆ own Command Phase).
2. **Bots:** greedy + random policies for all four (🌍 bashes early at the biggest hand; ♄ never pays a thief; ♅ refuses to be hit; ♆ sights free then dodges). `ATTACK_REASONS`/`THEFT_REASONS` shared with the engine via `cards.ts`.
3. **App:** Setup fleet pickers for all eight civs + fleetnote lines · ready/spent chips ×4 · 🌍 part→victim chooser + ♆ Look button in the command phase · ♄/♅ buttons in the reaction overlay + ♅ tilt chooser · feed lines for the new events (essential for ♄ — its resolution is silence) · SFX stingers · ScanModal shared with ♆ · Codex flips 🌍♄♅♆ to playable.
4. **Tests:** `engine-faction-v3.test.ts` — 18 new (powers, guards, windows, 2p edge, bot policies); **93/93 green**. Typecheck ✓ · build ✓ · sim ✓ (16,500 games clean, vanilla untouched).
5. **Docs:** `11` D-032→ADOPTED + D-033/D-034/D-035 + pending list refreshed · `13` PT-01/02 re-gated on the online version (P4 promoted as the human-testing vehicle); P2 faction lane checked through v3 · `14` v0.7 (§v3 IMPLEMENTED + §Passives brainstorm) · this file.

**Next:**
1. **Gábor tests the four powers in-game** (solo vs AI, any fleet) — feedback → tuning or veto per power.
2. **D-035 passives brainstorm with Gábor:** pick a family (card resistances vs body modifiers, or mix), fill the open slots (♄ ♅ ♂), then faction-seated sim + sign-off before any engine work.
3. **PT-F1 pretests** (☿♀♂♃ + now 🌍♄♅♆) via solo-vs-AI per `docs/08`.
4. Rising priority per D-034: the **online version** (P4) as the human-testing vehicle — Colyseus/PartyKit spike when Gábor gives the word.

## Session 1, night — bible v0.6: all eight civs deep-designed + Setup tidy — 2026-10-25 ✅

**Phase:** Gábor's story push ("do all of them" — his four next-step options). Gábor feedback logged: race stories interesting but needing development (→ this session); start-screen graphics rough (accepted as placeholder — tidy only, real art is P3).

**Shipped (D-032):**
1. **All eight civilizations deep-designed** — the last four get full Codex sheets (captains: 🌍 Amara "Warranty Void" Okafor · ♄ Vesper Noctis "Floats" · ♅ Titania Umbra "True Level" · ♆ Lumen Trench "Told You"; flagships, ≥6 real-fact hooks each, comedy wells, palettes, rivalries). The four playable sheets deepened with expanded-lore paras (☿ double-birthday scheduling + Caloris far-side claims · ♀ morning/evening-star double-booking + Magellan radar portrait · ♂ blue sunsets + the 37-minute sol · ♃ Shoemaker-Levy 9 "you're welcome" + heard-before-seen 1955).
2. **Four new power designs (PROPOSED — awaiting Gábor's sign-off, the D-028→D-029 pattern):** 🌍 **Kit Bash** (play a single ❄️/🛠️ as a completed pair-siphon) · ♄ **Ringwall** (a theft of their cards fizzles once/match; ⚡/🧲 pass through) · ♅ **Axial Tilt** (when targeted, the attacker must re-aim elsewhere, no payload growth) · ♆ **Deep Sight** (free 🔭 top-3 peek, any time). Framework-compliant (one sentence · base-deck counterplay · once/match · v0.3 vocabulary · sim-expressible); power-axis spread verified non-overlapping; rivalry map added. Codex marks them "designed — not yet playable".
3. **Setup tidy (functional, explicitly not the P3 art pass):** section headers ("The table", "Optional modules"), the faction-power wall of text is now a readable stacked list, checkbox hints align properly, panel widened 480→560px, redundant seat-list ternary removed.
4. **Docs:** `11` D-032 (+ new pending-decision entry: sign-off unlocks engine+app+bots) · `13` bible v1 checked off · `14` v0.6 (§v3 power designs + rivalry map) · this file. (D-031 row was accidentally overwritten mid-session and restored — verified intact.)

**All green:** typecheck · **75/75 tests** · build · sim (16,500 games clean).

**Next:** Gábor: ① **sign off / veto the four power designs** (🌍 Kit Bash · ♄ Ringwall · ♅ Axial Tilt · ♆ Deep Sight) — a yes → engine+app+bots+tests next session ② PT-F1 pretest per faction (☿ ♀ ♂ ♃) ③ round-5 notes + PT-01 (title + PT-01 timing + Reactor Charge confirmation still open, `docs/11` pending list). Then: faction PTs after the vanilla PTs.

## Session 1, late evening — faction layer v2: ♀ ♂ ♃ join ☿ — 2026-10-25 ✅

**Phase:** Gábor's parallel faction lane continues (D-031, ADOPTED); vanilla gates (PT-01/02) untouched and still pending.

**Shipped (D-031):**
1. **Engine (opt-in, vanilla provably unchanged — all 64 pre-existing tests green, untouched):** `COURT_FAVOR` (♀ flips a 🤝 aimed at her: `target→initiator`, `giftTo→courtier`, window reopens — one 📡 voids the exchange, the Favor burns either way) · `RUST_RUN` (♂ takes any discard card for free during his Command Phase through a real reaction window — a 📡 cancels the grab but the run is spent at initiation; no ruptures/containments) · `STORM_SHOUT` (♃ roars a drawn ☄️ at another captain — only the drawer may shout via `drawnBy`, so no chain-shouting). New stats `courtFavors`/`rustRuns`/`stormShouts`; `canCourtFavor()` wired into window logic.
2. **Bots:** greedy + random policies for all three (♀ never pays tribute; ♂ prioritizes the pile via `RUST_WANTED` before anything else; ♃ roars at the biggest rival hand). Sim clean: 16,500 games.
3. **App:** Setup fleet pickers for **all seats incl. AI** (classic = default) · per-seat power chips for all four civs (ready/spent, gold) · ♀ "flip the tribute" button in the reaction overlay · ♂ discard picker in the command phase · ♃ target picker inside the storm modal · SFX stingers (`court_favor`/`rust_run`/`storm_shout`).
4. **Codex rewritten data-driven** (`Sheet[]`/`SheetPara[]`): deep sheets for all four playable civs (form, captain, flagship, power, counterplay, comedy wells, real facts, palette, identity/rivalries) — a new civilization is now one append. Fixed a stray-`]` syntax error from the rewrite.
5. **Docs:** `08` PT-F1 widened to all four powers (receiving-end watch items) · `11` D-031 · `13` P2 v2 line + bible status · `14` v0.5 (engine-truth section for the three powers) · this file.

**All green:** typecheck · **75/75 tests** (11 new in `engine-faction-v2.test.ts`) · sim.

**Next:** Gábor: ① **PT-F1 pretest, once per faction** (☿ ♀ ♂ ♃) — solo vs AI, mix AI factions into the other seats to feel the powers from the receiving end ② round-5 notes + PT-01 whenever ready. Then: deep-draft the next civ (🌍 ♄ ♅ ♆) or faction PTs after the vanilla PTs.

## Session 1, evening — faction pilot ships: ☿ Flare Skip in engine+app + in-game Codex — 2026-10-25 ✅

**Phase:** Gábor's directive — dev proceeds without waiting on his test ("don't lock anything… proceed with the next step"); PT-01/02 remain the validation gates, running in parallel instead of blocking.

**Shipped (D-028 → ADOPTED; D-029/D-030 logged):**
1. **Engine (opt-in, vanilla provably unchanged):** per-seat `config.factions` (absent/null = classic — all 55 pre-existing tests untouched & green) · `FLARE_SKIP` command mirrors ↪️ DEFLECT minus the card (once per match; shares the once-per-chain limit; growth on destruction only; spent state public) · `canFlareSkip()` wired into window logic (waits on flare-capable targets, D-022 bounce covered) · bots use it (greedy: free redirect before spending a ↪️; random 60%) · `flareSkips` stat + report field. **9 new tests → 64/64.**
2. **App:** Setup fleet picker (default classic) · public "☿ Flare Skip ready/spent" chips at every seat · reaction-window "free redirect +1" button with target chooser · **Civilization Codex** (`docs/14` on the game screen: 8 civ cards + Mercury deep sheet) reachable from Setup, HUD, and the always-on corner controls (D-023 pattern). Stale "rules v0.2" tagline fixed → v0.3.
3. **Docs:** `03` §7 faction bullet + E-18 + changelog · `08` PT-F1 pretest section · `11` D-028 ADOPTED + D-029/D-030 · `13` P2 = parallel lane · `14` rule-6 amendment + v0.4 changelog.

**All green:** typecheck · **64/64 tests** · build.

**Next:** Gábor: ① **PT-F1 pretest** — solo vs AI as ☿ Mercury (Setup → fleet), 2–3 matches; note whether the power fires, feels strong-but-baitable or dull (fallback "Slingshot Start" waits) ② round-5 notes + PT-01 whenever ready — the vanilla path is untouched and waiting. Then: next civ deep-draft in `docs/14`; faction PTs after the vanilla PTs.

## Session 1, afternoon — P2 design lane opened: faction framework + Mercury pilot — 2026-10-25 ✅

**Phase:** P1 gates still pending (round-5 notes → freeze v0.3 → PT-01/02); **P2 design lane now open in parallel (D-027, docs-only)** per Gábor's directive.

**Shipped (docs only — engine/app/kit untouched, gates intact):**
1. **Faction-power framework v1** (`docs/14`, D-028 PROPOSED): six ship rules — one-sentence template, base-deck counterplay, once-per-match default, v0.3 vocabulary only (D-026 discipline), sim-expressible in `bots.ts`, gated on PT-01/02. Spent powers are public.
2. **Reactor Charge re-evaluation menu** (`docs/14` §RC; final call stays post-PT-03 per D-003): A drop / B shared currency / C hybrid — lean **A** for the pilot.
3. **Mercury pilot deep design** (`docs/14` §Pilot): The Flareskips — cast-glass sprinters, Captain Cinder Vale "Twice-Dawn", flagship *The Sudden Dawn*, 5 comedy wells, 7 real-fact hooks (88-day year vs 176-day day; −173→+427 °C; the Sun's takeback sunrise; polar ice; shrinking planet; 85% iron core; BepiColombo's imminent arrival), palette/sound/motion, identity & counters. Power draft: **"Flare Skip"** (once/match free ↪️-redirect; fallback "Slingshot Start").
4. Cross-refs updated (`05` verdict, `13` roadmap + stale "freeze v0.2" fix, `15` §D hook).

**Next:** Gábor reviews D-028 (Mercury sheet + framework) alongside his round-5 solo notes; when PT-01/02 pass → solo-vs-AI faction pretest → faction PT.

## Session 1, morning — PT-01 zero-prep kit + D-026 instrument fix — 2026-10-25 ✅

**Phase:** P1 Core validation (v0.3 in; round-5 notes pending — every remaining P1 item is now a human gate).

**Shipped:**
1. **`docs/16-playtest-kit.md` — print & run PT-01/02:** facilitator run sheet (4-min teach-in script using the app's premise copy verbatim, during-match observation checklist, post-match question set + export/archive steps + pass/revise/reject), paper-mode rulings where paper differs (real-time 📡 shouts, ↪️ payload token, private peeks), and a **54-card cut sheet + 2 table aid cards** verified card-for-card against `BASE_DECK` v0.3 (46) + 6 🛡️ + N−1 ☀️.
2. **D-026:** PT-01/02 "vanilla" = v0.3 core deck with modules off (docs/08 said "v0.2" — that deck no longer exists in the app; paper/app/sim now provably measure the same game). docs/08 instrument + deck lines updated.
3. Housekeeping: stale v0.2-era deck-count comments fixed in `cards.ts`/`engine.ts` (46, comment-only); known-issue #9 re-tried (EK official page still 429 — stays open).

**All green:** typecheck · **55/55 tests** · build (comment-only code change).

**Next:** ① Gábor's round-5 solo notes (bounce-backs, anytime-❓, music v3) → **freeze v0.3** · ② run **PT-01** with the kit (`docs/16`) — app or paper, 3 humans, ~30 min total per session incl. questions · then PT-02 (4–5p) → P1 gate.

## Session 1, dawn — P1 chore: CI live + PT-01 export completeness — 2026-10-25 ✅

**Phase:** P1 Core validation (v0.3 in; round-5 notes pending).

**Plan progress (no design changes):**
1. **CI (D-025):** GitHub Actions — `npm ci` → typecheck → tests → build on every push to main and on PRs (Node 22). Closes the last non-human P1 chore; known-issue #11 resolved. Sim stays local per balance gate.
2. **PT-01 export completeness:** the game-over JSON now ships the full end-state inventory — `finalHands` (per captain), `deckRemaining`, `discard`, `exportedAt` — so docs/08's "dead cards" metric is computable offline from a single export (previously only played counts + the winner's hand size).

**All green:** typecheck · **55/55 tests** · build (CI mirrors exactly these).

**Next (both human gates):** ① Gábor's round-5 solo-vs-AI notes (bounce-backs, anytime-❓, music v3 — refresh http://localhost:5173) → **freeze v0.3** · ② schedule **PT-01** (3 humans hotseat; archive metric exports to `docs/balance/raw/`, created on first export per docs/08). Everything else on the P1 checklist is done.

## Session 1, small hours+ — round-5 refinements pass 2 (designer request) — 2026-10-25 ✅

**Phase:** P1 Core validation (v0.3 in, awaiting Gábor's round-5 solo feel test).

**Three designer asks, all shipped:**
1. **Help anywhere (D-023):** a 🔊+❓ cluster floats above every overlay, so the Mission Briefing (full card reference included) opens at any moment — mid-reaction included. The briefing sits above all other modals.
2. **Audio v3 (D-024):** "still a bit empty" → + per-chord bass swells, a slow chord-tone lead through the space echo, a high shimmer 5th, a solar-wind noise bed, pluck fifths. Master level unchanged.
3. **Deflector bounce-back (D-022):** a bounced attacker holding an unused ↪️ is now asked (deflect it on or take the hit) — engine (`canRespond`, new `respondentIds`/`openRespondents`), PASS/resolution, both bot policies, the reaction overlay and the solo driver all aligned; still never Override-your-own-action. This was the real cause of "why can't they deflect the deflection": bots bounce at the biggest hand (usually the human) and the old code silently skipped the attacker.

**All green:** typecheck · **55/55 tests** (52 → 55: bounce-war, initiator-skip, initiator-pass suites) · build · sim (16,500 games; 2p tallest escalation 1→2, everything else within noise — report updated, lengths/seats hold).

**Next:** unchanged — Gábor's round-5 solo-vs-AI notes → freeze v0.3 → **PT-01** (3 humans hotseat, metrics JSON export per docs/08 — the export button is already in the game-over modal). New round-5 watch questions: does the anytime-❓ actually get used? Is the bed fuller without turning busy? Do bounce-backs feel fun rather than gotcha?

## Session 1, small hours — round-5 UX refinements (designer request) — 2026-10-25 ✅

**Phase:** P1 Core validation (v0.3 in, awaiting Gábor's round-5 solo feel test).

**Designer asked for two refinements before round 5 — both shipped:**
1. **No forced "let it happen" clicks (D-020, engine-level):** reaction windows auto-skip captains with no possible response (no 📡 in hand, not the 🎯 target with an unused ↪️, no armed Final Transmission). Nobody able to respond → the action resolves instantly, no overlay. Skipped captains show as "💤 standing down". New `canRespond` export; auto-pass runs whenever a window opens or reopens (PLAY / OVERRIDE / DEFLECT).
2. **Flight log never covered (D-021, UI):** the log is a pinned side rail (z-above overlays, modals centre in the remaining space, reflows inline below 880px) — history stays visible during reaction/override/draw/help/game-over windows.

**All green:** typecheck · **52/52 tests** (47 → 52: new D-020 suite; 3 deflect tests updated for self-resolving windows) · build · sim (report byte-identical — auto-pass is outcome-neutral for bots).

**Next:** unchanged — Gábor's round-5 solo-vs-AI notes (localhost:5173, refresh), then freeze v0.3 → PT-01. New round-5 watch question: does the standing-down line + always-visible log make bot turns easy enough to follow?

## Session 1, late night — v0.3 expansion built — 2026-10-25 ✅

**Phase:** P1 Core validation. **Rules are now v0.3** (expansion pack in). Gábor answered the two open design questions and picked menu **(g) — all candidates** (D-015/016/018 ADOPTED).

**Built this session:**
- **Engine v0.3:** ☄️ Micrometeoroid Storm + 🌟 Solar Wind draw-step events (wind chains pause on storms/contained ruptures, E-13) · 🔧 Scrap (lone Component → private top-card peek, overrideable) · ⚡ Ion Surge (random jettison; scales with Deflectors) · 🧲 Tractor Snag (discard down to 3, victim chooses) · ↪️ **Deflector** — Gábor's Uno-style escalation: target redirects any attack +1 payload (destruction only), once per captain per chain, cap +3, one Override kills the whole chain. New commands `DEFLECT`/`STORM_DISCARD`/`SNAG_DISCARD`; `bonusDraws` draw-chain state; 5 new stats.
- **Bots:** greedy deflects when targeted (biggest rival hand), surges/snags fat hands, scraps lone Components; both policies resolve storm & snag choices.
- **UI:** Deflector button + redirect chooser in the reaction window (target-only, 🎯 markers, payload indicator), Storm & Snag discard modals, Scrap private peek, new-card briefing groups + copy, 5 new stingers (storm/wind/surge/snag/deflect), bot choice-decider fix (snag/storm victims now drive correctly).
- **Sim gate:** 16,500 games × 2 runs. Full menu tripped the doc-15 length warning (2p 15.3 min) → applied the prescribed trim (D-019: −1 🔭 Scan, −1 🌀 Slingshot → 46 action cards, 55 total at 4p). Post-trim: **14.7 / 14.0 / 13.0 / 11.7 min** at 2/3/4/5p — PASS. Deflections ~1/game, tallest chain 2, surges land ~1.2/game, scraps ~4/game, pass-turn 72→68%, comebacks up to 37–43%, seats uniform.

**All green:** typecheck · **47/47 tests** (28 → 47) · build · sim.

### Next actions (in order)

1. **Gábor: solo vs AI round 5** at http://localhost:5173 (refresh; `npm run dev` if stopped). Feel-test the new cards — especially: does the ↪️ Deflector button + payload counter read clearly? Is ⚡/🧲 nastiness fun rather than mean? Notes → `docs/09`.
2. If round 5 is clean → **freeze v0.3 → schedule PT-01** (3 humans, hotseat; export metrics JSON per `docs/08`).
3. Watch-list additions from sim: destruction sometimes burns 🛡️ from hands (contained-count −10% — intended squeeze, confirm with humans); 2p at 14.7 min still weakest.

### Watch-list (do not forget)

Salvage power (unmeasured by bots) · Scan hoarding · Fury pacing at depth 5 · Derelict kingmaking · **2p viability (14.7 min — worst case)** · human pass-turn behaviour (bots 68%, was 72%) · ⚡ destroying containments (late-game squeeze) · bot difficulty: greedy only.

### Where the faction layer lives (Gábor asked, round-4 addendum)

Player specialties/strengths/weaknesses = **P2 "Modules & factions"** in `docs/13-roadmap.md`. Material ready: `docs/14-civilization-bible.md` (8 civs direction table; per-civ checklist incl. captain personality + strength/weakness/play-style identity + faction power draft), `docs/02` opportunity #4, D-011 combo revisit. Gate order per standing rule: PT-01/02 vanilla core first (asymmetry must not mask core problems), then pilot faction **Mercury**; solo-vs-AI can pre-test faction balance cheaply once drafted. Escalation (↪️ Deflector) is a natural faction lever later — noted in `docs/15` D.

## Session 1, night continuation — 2026-10-25 ✅

**Phase:** P1 Core validation. PT-00 round 4 (solo vs AI) feedback triaged and fixed in one pass (D-017).

**Built this session:** reaction-window clarity (live ✅/🚫 Override-parity state, attack target named, effect-labeled buttons) · theft visibility (who-robbed-whom public, loot identity private — new `steal_card` line) · solo mode de-gated (no more "pass the device" vs AI anywhere; DrawReveal + Requisition copy solo-aware) · audio v2 (bed 0.16→0.10, Am–F–C–G pad cycle, sub heartbeat, 11 log-driven stingers) · Fury explained (HUD button → briefing, richer Setup hint, log lines state the reinsertion limit) · doc 15 Candidate B corrected: deck already has 4+4 Components — the fix is a lone-Component floor use (**🔧 Scrap**: discard 1 Component to peek at the top deck card), not density.

**All green:** typecheck · 28/28 tests · build.

### Next actions (in order)

1. **Gábor:** refresh http://localhost:5173 → 🤖 Solo vs AI → check the six fixes feel right (especially the reaction window: does the live ✅/🚫 state + "flip" copy make override parity obvious?). Round 5 notes → `docs/09`.
2. **Gábor decision D-015/D-016/D-018** (`docs/15` menu): **(a)** Storm+Wind · **(b)** +Scrap · **(c)** +Ion Surge & Tractor Snag · **(d)** a+b+c · **(f)** a+c+**Deflectors** (Uno-style redirect+escalate — Gábor's proposal, drafted as Candidate D) · **(g)** all · **(e)** veto. **D requires C.**
3. Implement chosen cards → extend tests beyond 28 → sim gate vs v0.2 baseline → solo-vs-AI feel test → freeze rules v0.3 → schedule PT-01.

### PT-00 status

Rounds 1–4 closed (onboarding → fixed; music/reveal/tooltips → done; solo instrument limit → solo vs AI built; round 4 clarity/privacy/audio fixes → D-017). Round 5 = next solo pass, then v0.3 candidates.

### Watch-list (do not forget)

Salvage power (unmeasured by bots) · Scan hoarding · Fury pacing at depth 5 (Fury≥4 in 85–99% of games) · Derelict kingmaking · 2p viability (13 min, comeback needs 2p proxy) · human pass-turn behaviour (bots turtle 72%) · bot difficulty: greedy only — more policies are cheap if solo feels too easy/hard.

### Where the faction layer lives (Gábor asked, round-4 addendum)

Player specialties/strengths/weaknesses = **P2 "Modules & factions"** in `docs/13-roadmap.md`. Material ready: `docs/14-civilization-bible.md` (8 civs direction table; per-civ checklist incl. captain personality + strength/weakness/play-style identity + faction power draft), `docs/02` opportunity #4, D-011 combo revisit. Gate order per standing rule: PT-01/02 vanilla core first (asymmetry must not mask core problems), then pilot faction **Mercury**; solo-vs-AI can pre-test faction balance cheaply once drafted. Escalation (Candidate D) is a natural faction lever later — noted in `docs/15` D.

## Session 1, evening continuation — 2026-10-25 ✅

**Phase:** P1 Core validation (pre-PT-01). Solo vs AI is now the primary designer instrument.

**Built since last entry:** ambient soundtrack (procedural Web Audio) · draw reveal overlay (engine logs the drawn card; feed stays blind) · card blurbs on every surface · **Solo vs AI mode** (D-014: `botCommandFor` in game-core, greedy bots, paced ~1 s, privacy preserved — bot scans/reinserts/gives stay hidden) · lone-component "find its twin" hint · expansion sketch `docs/15-expansion-v0.3-sketch.md`.

### Next actions (in order)

1. **Gábor:** refresh http://localhost:5173 → Setup → **🤖 Solo vs AI** (3–5 captains recommended) → play full matches vs the bots. Note: anything that feels unfair, unclear, or boring — that's PT data now.
2. **Gábor decision D-015/D-016** (menu in `docs/15`): (a) Storm+Wind · (b) +Components 3+3 · (c) +Ion Surge & Tractor Snag · (d) all · (e) veto.
3. Implement chosen v0.3 cards → extend tests → sim gate vs baseline (`docs/10`).
4. Schedule **PT-01** (3 humans, in person, hotseat mode — it's ready today; remote friends = P4 online).

### PT-00 status

Rounds 1–3 closed (onboarding gap → fixed; music/draw reveal/tooltips → done; solo instrument limit → solo vs AI built). Round 4 = designer vs bots under v0.2, then v0.3 candidates.

### Open decisions for Gábor (docs/11)

Final title · PT-01 timing · D-015 expansion pick.

### Watch-list (do not forget)

Salvage power (unmeasured by bots) · Scan hoarding · Fury pacing at depth 5 (Fury≥4 in 85–99% of games — PT-03 fairness read) · Derelict kingmaking · 2p viability (13 min, comeback metric needs 2p proxy) · human pass-turn behaviour (bots turtle 72%; if humans do too, discuss incentives) · bot difficulty: greedy only — if solo feels too easy/hard, next policies are cheap.

## Session 1 — 2026-10-25 ✅

**Phase:** P0 Foundation → complete (all gates). **Next phase:** P1 Core validation (human playtests).

**Built today:** full design doc set (00–14) · git repo + continuity system (PROJECT_CONTEXT/CLAUDE/AGENTS + this file) · `packages/game-core` deterministic engine (rules v0.2, Sun Fury & Derelict modules, bots, metrics, 28 unit tests — all green) · `apps/hotseat` pass-and-play prototype with privacy gates and metrics export · `sim/` Monte Carlo (16,500 games, ~3 s) · baseline report + findings (`docs/balance/sim-report-v0.2.md`, `docs/10-balance-findings.md`).

**Baseline headline (sim):** matches 10–13 min at all player counts · seats balanced within ~1pp · comebacks 34–41% · Sun Fury shortens & heats endings without dragging · Derelicts cost nothing and get used · Salvage usage unmeasured (bots ignore it) — open for PT-01.

### Next actions (in order)

1. ✅ ~~GitHub remote~~ — pushed to `gabortardos/last-orbit-game-glm-style` (2026-10-25).
2. **Gábor:** refresh http://localhost:5173 (`npm run dev` if stopped) → the **Mission Briefing** now opens automatically; re-run the solo smoke test with the onboarding in place. PT-00 round 2.
3. Schedule **PT-01** (3 humans, vanilla core) per `docs/08-playtest-plan.md`; log in `09`, export metrics JSON to `docs/balance/raw/`.
4. Iterate rules from findings; keep decision log current.
5. Chore: GitHub Actions CI (`npm test` + `npm run typecheck`).

### PT-00 finding (2026-10-25, logged in `docs/09` + D-013)

Solo smoke test aborted: **critical onboarding gap** — new player gets no premise/goal/mechanics context. Fixed same day: Mission Briefing overlay (auto-opens once, reusable via "How to play" + in-game ❓ Help), per-card `blurb` tooltips in `CARD_INFO`, goal reminders on Setup + handoff gate. Re-test pending.

### Open decisions for Gábor (docs/11)

Final title · GitHub URL · PT-01 timing.

### Watch-list (do not forget)

Salvage power (unmeasured by bots) · Scan hoarding · Fury pacing at depth 5 (Fury≥4 in 85–99% of games — PT-03 fairness read) · Derelict kingmaking · 2p viability (13 min, comeback metric needs 2p proxy) · human pass-turn behaviour (bots turtle 72%; if humans do too, discuss incentives).

