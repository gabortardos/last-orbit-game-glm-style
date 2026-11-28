/** Shared V6 card-face renderer (QA-G-021 imports; sizes via .face.xs/.sm/.md/.lg). */
import type { CardKind } from '@last-orbit/game-core';
import { CARD_FACE } from './visualAssets';

export default function CardFace({ kind, size = 'md', className = '' }: {
  kind: CardKind;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}) {
  return <img className={`face ${size} ${className}`} src={CARD_FACE[kind]} alt="" loading="lazy" draggable={false} />;
}
