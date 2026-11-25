# AGENTS.md

Guidance for any AI coding agent working in this repository.

1. Start with `PROJECT_CONTEXT.md` → `docs/NOW.md` → `docs/13-roadmap.md` → `docs/11-decision-log.md`.
2. Respect the hard rules in PROJECT_CONTEXT.md (Explorer separation, no EK IP, engine purity, decision logging).
3. Verify with: `npm test`, `npm run typecheck`, `npm run sim` after touching `game-core` or rules docs.
4. Keep commits conventional and small; update the matching `docs/` record in the same commit.
5. Never delete or rewrite history of decision/playtest/balance records — append instead.
6. Cross-repo / AI Nexus (owner-mandated, NX-01–05): at the start of each substantial session, read the AI Nexus (github.com/gabortardos/ai-nexus — AGENTS.md + relevant registry/modules/Q&A) and record the revision; if unavailable, use the last verified local copy. Contribute generalizable owner preferences/lessons (sanitized, deduplicated, unique IDs) without asking for routine permission; answer shared cross-agent Q&A; verify actual remote commits — never force-push and never claim unverified sync. Keep local technical specifics in this repo; never promote local decisions to global rules or export private data. Writes to the visual-studio repo: Q_AND_A.md appends + pre-announced pointer fixes only (QA-G-003 protocol).
