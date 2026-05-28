type Props = { size?: number };

export function GridironLogo({ size = 80 }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M40 4L68 16V38C68 54 56 66 40 74C24 66 12 54 12 38V16L40 4Z" fill="#1a0a0a" stroke="#ef4444" strokeWidth="2.5"/>
      <path d="M40 12L62 22V38C62 51 52 61 40 68C28 61 18 51 18 38V22L40 12Z" fill="#DC2626" opacity="0.15"/>
      {/* Football */}
      <ellipse cx="40" cy="40" rx="13" ry="9" fill="#b45309" stroke="#f59e0b" strokeWidth="1.5"/>
      <line x1="27" y1="40" x2="53" y2="40" stroke="#f59e0b" strokeWidth="1.2"/>
      <line x1="36" y1="33" x2="36" y2="47" stroke="#f59e0b" strokeWidth="1"/>
      <line x1="40" y1="31" x2="40" y2="49" stroke="#f59e0b" strokeWidth="1"/>
      <line x1="44" y1="33" x2="44" y2="47" stroke="#f59e0b" strokeWidth="1"/>
      {/* Lightning bolt */}
      <path d="M34 26L28 40H38L34 54" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.9"/>
    </svg>
  );
}

export function RinkLogo({ size = 80 }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M40 4L68 16V38C68 54 56 66 40 74C24 66 12 54 12 38V16L40 4Z" fill="#0a0d1a" stroke="#3b82f6" strokeWidth="2.5"/>
      <path d="M40 12L62 22V38C62 51 52 61 40 68C28 61 18 51 18 38V22L40 12Z" fill="#3b82f6" opacity="0.15"/>
      {/* R letter */}
      <text x="28" y="52" fontFamily="Arial Black, sans-serif" fontWeight="900" fontSize="32" fill="#60a5fa">R</text>
      {/* Puck */}
      <ellipse cx="52" cy="56" rx="9" ry="5" fill="#1e293b" stroke="#3b82f6" strokeWidth="1.5"/>
      <ellipse cx="52" cy="54" rx="9" ry="5" fill="#334155" stroke="#3b82f6" strokeWidth="1.5"/>
    </svg>
  );
}

export function HoopsLogo({ size = 80 }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M40 4L68 16V38C68 54 56 66 40 74C24 66 12 54 12 38V16L40 4Z" fill="#1a0d00" stroke="#f97316" strokeWidth="2.5"/>
      <path d="M40 12L62 22V38C62 51 52 61 40 68C28 61 18 51 18 38V22L40 12Z" fill="#f97316" opacity="0.15"/>
      {/* Basketball */}
      <circle cx="40" cy="40" r="14" fill="#ea580c" stroke="#f97316" strokeWidth="1.5"/>
      <path d="M26 40 Q40 30 54 40" stroke="#7c2d12" strokeWidth="1.5" fill="none"/>
      <path d="M26 40 Q40 50 54 40" stroke="#7c2d12" strokeWidth="1.5" fill="none"/>
      <line x1="40" y1="26" x2="40" y2="54" stroke="#7c2d12" strokeWidth="1.5"/>
    </svg>
  );
}

export function DugoutLogo({ size = 80 }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M40 4L68 16V38C68 54 56 66 40 74C24 66 12 54 12 38V16L40 4Z" fill="#001a0a" stroke="#22c55e" strokeWidth="2.5"/>
      <path d="M40 12L62 22V38C62 51 52 61 40 68C28 61 18 51 18 38V22L40 12Z" fill="#22c55e" opacity="0.15"/>
      {/* D letter */}
      <text x="26" y="53" fontFamily="Arial Black, sans-serif" fontWeight="900" fontSize="34" fill="#4ade80">D</text>
      {/* Baseball */}
      <circle cx="54" cy="54" r="9" fill="white" stroke="#e5e7eb" strokeWidth="1"/>
      <path d="M46 51 Q54 48 62 51" stroke="#dc2626" strokeWidth="1" fill="none"/>
      <path d="M46 57 Q54 60 62 57" stroke="#dc2626" strokeWidth="1" fill="none"/>
    </svg>
  );
}

export function SportsHQLogo({ size = 44 }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22 2L40 10V22C40 32 33 39 22 44C11 39 4 32 4 22V10L22 2Z" fill="#0f1923" stroke="#22d3ee" strokeWidth="2"/>
      <text x="10" y="30" fontFamily="Arial Black, sans-serif" fontWeight="900" fontSize="17" fill="#22d3ee">SH</text>
    </svg>
  );
}
