# Reference Notes — Exploding Kittens base game (research 2026-10-25)

Purpose: understand the reference mechanics so we can build an original game. **No rules text, names, art, or branding is copied.** Everything below is summarized in our own words.

## Sources consulted

1. Official how-to-play page, explodingkittens.com — attempted; returned HTTP 429 (rate-limited) during the session. To be re-verified at next doc pass; treat as pending citation.
2. UltraBoardGames rules mirror of the official base game: https://www.ultraboardgames.com/exploding-kittens/game-rules.php and /special-combos.php (retrieved 2026-10-25). Full base rules + combos.
3. Wikipedia: *Exploding Kittens* (retrieved 2026-10-25) — confirms designer/publisher facts (Elan Lee, Shane Small, Matthew Inman, 2015), 2–5 players, ~15 min, and core setup/loop.

## Setup (base game, summarized)

- Remove all fatal cards ("Exploding Kittens", 4 in box) and survival cards ("Defuse", 6 in box).
- Deal 4 random cards to each player plus 1 survival card each (hand of 5).
- Insert fatal cards equal to **players − 1**; remove extras. Insert leftover survival cards. Shuffle. Draw pile in the middle.
- Hands secret; discards public face-up.

## Turn structure

- Play any number of cards (or none), then **end the turn by drawing** one card.
- No hand-size limits; empty hands just keep playing; the draw pile is counted publicly and never reshuffles by necessity (fatal cards resolve before it can empty).

## Key mechanics (summarized, own words)

- **Fatal draw:** drawing a fatal card requires immediate reveal. Without a survival card the player is eliminated (hand discarded, fatal card leaves play).
- **Survival + secret reinsertion:** playing the survival card instead; the survivor then secretly places the fatal card anywhere in the draw pile (under the table allowed).
- **Cancellation:** a "no" card cancels any action card/combo before it resolves, playable off-turn and in real time; a "no" can cancel a "no"; cannot cancel a fatal card reveal or a survival card play.
- **Turn-debt attack:** ends the attacker's turn without drawing and forces the next player to take **2 consecutive turns**. If the victim answers with their own attack, their turns end and the debt (2 turns) passes to the following player (official base wording: next player takes 2 turns — notable because many groups mis-play this as accumulating debt; see ledger row 5).
- **Skip:** ends one turn without drawing; vs. a 2-turn debt it only skips one of the two.
- **Forced gift:** force a chosen player to give you 1 card of *their* choice.
- **Deck peek:** privately view top 3 cards, replace in order.
- **Shuffle:** shuffle the draw pile.
- **Combo layer:** identical pairs of "blank" cat cards steal a random card; three of a kind names a card and takes it if held; any five differently-named cards retrieve any card from the discard pile.
- **Victory:** last player alive wins.

## Edge cases worth stealing as *lessons* (not rules)

- Cancellation timing ("before the action begins") causes most rules arguments → our digital version needs an explicit reaction window.
- Attack-debt arithmetic is the second-most-argued rule → ours must be one sentence.
- Deck counting is legal and expected.
- The deck can't meaningfully run out; ours still defines an explicit reshuffle rule for safety.

## IP boundary

Mechanics and their function are not copied text; our implementations differ (names, effects, wording, additions). We do not use: their title, characters, illustrations, card names, flavour voice, or visual identity. Our fiction (a furious Sun, planetary civilizations, the Grand Solar Rally) is unrelated to theirs.
