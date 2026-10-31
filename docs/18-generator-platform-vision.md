# 18 — Card-Game Generator Platform (vision — D-037)

Status: **PROPOSED — design note only, no code.** Gábor pitched the idea on 2026-10-25; this
document logs the idea and the analysis so it survives sessions. It is a **post-P5 direction**:
nothing here starts before the P5 gate, because the platform's value is bounded by the core
game's quality — the sequencing rule Gábor himself set: *"once it is a good game."*

## The idea (Gábor's pitch)

A one-click card game generator: a player describes a theme/vibe, and out comes a playable,
balanced card game built on the Last Orbit engine — effectively "generate your own Last Orbit."

## The reframe (the analysis that makes it buildable)

**The LLM never invents mechanics.** Generation = filling a schema/menu, not freeform design:

- Theme → characters → **validated power templates** (archetypes that already exist and pass
  sim gates) with **re-tuned numbers** and **re-written flavor**.
- Everything mechanical lives in a constrained space the repo already governs: the engine, the
  power-template catalogue, the simulator's balance gates.
- The core insight: **generation opens a PR, the sim is CI, human playtest is code review.**

## Why this repo is the moat

Any model can generate card text. Almost nobody has: a deterministic engine, a Monte-Carlo
simulator that runs thousands of games and gates balance automatically, and (since D-036) an
authoritative server. That stack turns "AI-generated game" from a gimmick into a **validation
pipeline**: generated content that fails sim gates gets auto-rejected (or auto-tuned and
repaired) before a human ever sees it.

## Build order (when P6 opens)

1. **Last Orbit itself validated** (P1–P5): the generator is only as good as its substrate.
2. **Manual Theme Pack JSON prototype** — hand-write 2 theme packs as data; prove the engine
   renders them with zero code changes.
3. **Power templates + auto-tune** — extract archetype templates; sim becomes auto-acceptance
   with a repair loop (numbers get nudged until gates pass).
4. **LLM front-end** — the model fills the schema/menu (characters → templates + flavor);
   never touches mechanics.
5. **Maybe a second core engine** — only if the first proves the platform thesis.

## Hard parts (known risks)

- **Validation is the product** — the generator UI is the easy half.
- Map/scenario parameterization is a bigger lift than card swaps.
- Sim-balanced ≠ fun: the sim gates stats, not experience; human playtests stay in the loop.
- Sameness ceiling — re-skinned archetypes converge; templates must be broad enough to surprise.
- IP filters on generated themes (no borrowed worlds/characters).

## Relationship to the roadmap

Logged as **D-037**; roadmap carries a stub P6 section pointing here. No engineering,
no repo structure, no prototypes until the P5 gate — and a Gábor go-ahead.
