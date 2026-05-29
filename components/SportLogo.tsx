import Image from "next/image";

type Props = { size?: number };

const glowStyle = {
  filter: "drop-shadow(0 0 12px rgba(0, 240, 255, 0.6)) drop-shadow(0 0 24px rgba(0, 240, 255, 0.3))",
};

export function SportsHQLogo({ size = 48 }: Props) {
  return (
    <span style={glowStyle} className="inline-flex">
      <Image
        src="/logos/sportshq-logo.png"
        alt="SportsHQ"
        width={size}
        height={size}
        className="object-contain"
      />
    </span>
  );
}

export function GridironLogo({ size = 72 }: Props) {
  return (
    <span style={glowStyle} className="inline-flex">
      <Image
        src="/logos/gridiron-logo.png"
        alt="Gridiron"
        width={size}
        height={size}
        className="object-contain"
      />
    </span>
  );
}

export function RinkLogo({ size = 72 }: Props) {
  return (
    <span style={glowStyle} className="inline-flex">
      <Image
        src="/logos/rink-logo.png"
        alt="Rink"
        width={size}
        height={size}
        className="object-contain"
      />
    </span>
  );
}

export function HoopsLogo({ size = 72 }: Props) {
  return (
    <span style={glowStyle} className="inline-flex">
      <Image
        src="/logos/hoops-logo.png"
        alt="Hoops"
        width={size}
        height={size}
        className="object-contain"
      />
    </span>
  );
}

export function DugoutLogo({ size = 72 }: Props) {
  return (
    <span style={glowStyle} className="inline-flex">
      <Image
        src="/logos/dugout-logo.png"
        alt="Dugout"
        width={size}
        height={size}
        className="object-contain"
      />
    </span>
  );
}
