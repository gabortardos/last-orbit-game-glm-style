/* V1 deck render smoke test — mounts the real components with real engine state (SSR, no DOM).
   Guards the QA-V-041/QA-V-044 port against runtime exceptions in every table phase. */
import { describe, expect, it, vi } from 'vitest';
import { renderToString } from 'react-dom/server';
import { applyCommand, createGame } from '@last-orbit/game-core';
import type { FactionId } from '@last-orbit/game-core';

vi.mock('../SolarScene', () => ({ default: () => null }));
vi.mock('../../audio', () => ({ isMuted: () => true, startAudio: () => {}, toggleMuted: () => true, sfx: () => {}, LOG_SFX: {} }));

import GameView from '../GameView';
import Setup from '../Setup';
import { Modals } from '../Overlays';

const FACTIONS: (FactionId | null)[] = ['kitbash', 'rustborn', 'ringwall', null];
const noop = () => {};

function gameWithAttack() {
  for (let seed = 1; seed < 400; seed++) {
    const g = createGame({ playerCount: 4, playerNames: ['Amara', 'Bram', 'Vesper', 'Cinder'], modules: { sunFury: true, derelicts: true }, seed, factions: FACTIONS });
    const hand = g.players[g.activePlayer].hand;
    const atk = (['ion_surge', 'boarding', 'tractor', 'requisition'] as const).find((c) => hand.includes(c));
    if (atk) return { g, atk };
  }
  throw new Error('no attack seed found');
}

describe('V1 deck (approved design port)', () => {
  it('renders the command deck for the active captain', () => {
    const { g } = gameWithAttack();
    const html = renderToString(
      <GameView game={g} viewer={g.activePlayer} humans={[0, 1, 2, 3]} dispatch={noop} error={null} report={null} onNewGame={noop} />,
    );
    for (const s of ['table v1', 'YOUR HAND', 'handcard', 'handart', 'End turn · draw', 'FLIGHT LOG', 'CAPTAINS', 'SYSTEMS', 'SUN FURY', 'Your command']) {
      expect(html).toContain(s);
    }
    expect(html).toContain('LO-CAPT-EARTH-AVATAR-V1.webp'); // fleet captain avatar in the rail
    expect(html).toContain('<svg'); // approved glyphs inline
  });

  it('renders the scenario panel for a waiting captain', () => {
    const { g } = gameWithAttack();
    const other = (g.activePlayer + 1) % g.players.length;
    const html = renderToString(
      <GameView game={g} viewer={other} humans={[0, 1, 2, 3]} dispatch={noop} error={null} report={null} onNewGame={noop} />,
    );
    expect(html).toContain('SCENARIO');
    expect(html).toContain('is plotting a course');
    expect(html).not.toContain('YOUR HAND');
  });

  it('renders the reaction window in the approved frame', () => {
    const { g, atk } = gameWithAttack();
    const target = (g.activePlayer + 1) % g.players.length;
    const res = applyCommand(g, { type: 'PLAY', player: g.activePlayer, cards: [atk], target });
    expect(res.ok).toBe(true);
    if (!res.ok) return;
    const s = res.state;
    expect(s.phase).toBe('reaction');
    const html = renderToString(
      <Modals game={s} dispatch={noop} report={null} onNewGame={noop} viewer={target} humans={[0, 1, 2, 3]} />,
    );
    for (const c of ['overlay react', 'modal reaction', 'reactcopy', 'outcome', 'Override', 'Let it happen']) {
      expect(html).toContain(c);
    }
  });

  it('renders the hero menu and the table setup', () => {
    const hero = renderToString(<Setup onStart={noop} onOnline={noop} />);
    for (const s of ['screen hero v1', 'LO-UI-MENU-BG-002.webp', 'mode primary', 'Solo vs AI', 'Pass-and-play', 'Online', 'PREMIUM CLASSIC / RELEASE 1']) {
      expect(hero).toContain(s);
    }
  });
});
