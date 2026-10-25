# AGENTS.md

Guidance for any AI coding agent working in this repository.

1. Start with `PROJECT_CONTEXT.md` → `docs/NOW.md` → `docs/13-roadmap.md` → `docs/11-decision-log.md`.
2. Respect the hard rules in PROJECT_CONTEXT.md (Explorer separation, no EK IP, engine purity, decision logging).
3. Verify with: `npm test`, `npm run typecheck`, `npm run sim` after touching `game-core` or rules docs.
4. Keep commits conventional and small; update the matching `docs/` record in the same commit.
5. Never delete or rewrite history of decision/playtest/balance records — append instead.
