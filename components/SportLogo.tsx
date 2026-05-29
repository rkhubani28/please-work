type Props = { size?: number };

const GLOW = (color: string) => ({ filter: `drop-shadow(0 0 6px ${color}80)` });

/* SportsHQ — geometric hexagon mark with upward edge chevron (cyan) */
export function SportsHQLogo({ size = 44 }: Props) {
  const c = "#00F0FF";
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" style={GLOW(c)} xmlns="http://www.w3.org/2000/svg">
      <path d="M24 3L42 13.5V34.5L24 45L6 34.5V13.5L24 3Z" stroke={c} strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M15 29L24 19L33 29" stroke={c} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* Gridiron — American football glyph (red) */
export function GridironLogo({ size = 56 }: Props) {
  const c = "#FF3B3B";
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" style={GLOW(c)} xmlns="http://www.w3.org/2000/svg">
      <g transform="rotate(-45 24 24)">
        <path d="M24 12C32 12 38 17 38 24C38 31 32 36 24 36C16 36 10 31 10 24C10 17 16 12 24 12Z" stroke={c} strokeWidth="2.5" />
        <line x1="16" y1="24" x2="32" y2="24" stroke={c} strokeWidth="2" strokeLinecap="round" />
        <line x1="20" y1="21" x2="20" y2="27" stroke={c} strokeWidth="2" strokeLinecap="round" />
        <line x1="24" y1="20" x2="24" y2="28" stroke={c} strokeWidth="2" strokeLinecap="round" />
        <line x1="28" y1="21" x2="28" y2="27" stroke={c} strokeWidth="2" strokeLinecap="round" />
      </g>
    </svg>
  );
}

/* Rink — crossed hockey sticks + puck (cyan) */
export function RinkLogo({ size = 56 }: Props) {
  const c = "#00F0FF";
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" style={GLOW(c)} xmlns="http://www.w3.org/2000/svg">
      <path d="M14 8L30 32L34 36" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M34 8L18 32L14 36" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <ellipse cx="24" cy="39" rx="8" ry="3" stroke={c} strokeWidth="2.5" />
    </svg>
  );
}

/* Hoops — basketball with seams (orange) */
export function HoopsLogo({ size = 56 }: Props) {
  const c = "#FF8A00";
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" style={GLOW(c)} xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="16" stroke={c} strokeWidth="2.5" />
      <line x1="24" y1="8" x2="24" y2="40" stroke={c} strokeWidth="2" />
      <line x1="8" y1="24" x2="40" y2="24" stroke={c} strokeWidth="2" />
      <path d="M12 13C18 18 18 30 12 35" stroke={c} strokeWidth="2" fill="none" />
      <path d="M36 13C30 18 30 30 36 35" stroke={c} strokeWidth="2" fill="none" />
    </svg>
  );
}

/* Dugout — baseball with stitching (green) */
export function DugoutLogo({ size = 56 }: Props) {
  const c = "#00FF66";
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" style={GLOW(c)} xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="16" stroke={c} strokeWidth="2.5" />
      <path d="M14 11C19 16 19 32 14 37" stroke={c} strokeWidth="2" fill="none" />
      <path d="M34 11C29 16 29 32 34 37" stroke={c} strokeWidth="2" fill="none" />
      <g stroke={c} strokeWidth="1.6" strokeLinecap="round">
        <line x1="15" y1="16" x2="18" y2="15" />
        <line x1="15.5" y1="20" x2="18.5" y2="19" />
        <line x1="15.5" y1="28" x2="18.5" y2="29" />
        <line x1="15" y1="32" x2="18" y2="33" />
        <line x1="33" y1="16" x2="30" y2="15" />
        <line x1="32.5" y1="20" x2="29.5" y2="19" />
        <line x1="32.5" y1="28" x2="29.5" y2="29" />
        <line x1="33" y1="32" x2="30" y2="33" />
      </g>
    </svg>
  );
}
