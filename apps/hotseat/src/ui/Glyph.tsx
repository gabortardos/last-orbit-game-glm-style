/** Approved pictogram glyph (LO-PICTOGRAM-PACK-001, QA-G-012) — inline SVG, colored by CSS `color`.
 *  Bindings mirror prototypes/v1-remaining/asset-bindings.json surfaces (menu/hud/reaction/card/faction). */
import { GLYPH } from './glyphs';

export default function Glyph({ id, className = '', label }: { id: string; className?: string; label?: string }) {
  const svg = GLYPH[id as keyof typeof GLYPH];
  if (!svg) return null;
  return (
    <span
      className={`icon glyph ${className}`}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
