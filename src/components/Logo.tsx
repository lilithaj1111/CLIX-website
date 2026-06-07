import Link from "next/link";
import { LogoMark } from "./LogoMark";

export function Logo({
  className = "",
  size = 24,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <Link
      href="/"
      aria-label="Clix home"
      className={`inline-flex items-center group ${className}`}
    >
      <LogoMark size={size} lockup />
    </Link>
  );
}
