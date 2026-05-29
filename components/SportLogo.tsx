import Image from "next/image";

type Props = { size?: number };

export function SportsHQLogo({ size = 44 }: Props) {
  return (
    <Image
      src="/logos/sportshq-logo.png"
      alt="SportsHQ"
      width={size}
      height={size}
      className="object-contain"
    />
  );
}

export function GridironLogo({ size = 56 }: Props) {
  return (
    <Image
      src="/logos/gridiron-logo.png"
      alt="Gridiron"
      width={size}
      height={size}
      className="object-contain"
    />
  );
}

export function RinkLogo({ size = 56 }: Props) {
  return (
    <Image
      src="/logos/rink-logo.png"
      alt="Rink"
      width={size}
      height={size}
      className="object-contain"
    />
  );
}

export function HoopsLogo({ size = 56 }: Props) {
  return (
    <Image
      src="/logos/hoops-logo.png"
      alt="Hoops"
      width={size}
      height={size}
      className="object-contain"
    />
  );
}

export function DugoutLogo({ size = 56 }: Props) {
  return (
    <Image
      src="/logos/dugout-logo.png"
      alt="Dugout"
      width={size}
      height={size}
      className="object-contain"
    />
  );
}
