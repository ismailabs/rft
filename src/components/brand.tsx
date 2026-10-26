import Link from "next/link";
import Image from "next/image";
export function LeafMark() {
  return (
    <Image
      className="leaf-mark"
      src="/institutions/rft-leaf.png"
      width={35}
      height={47}
      alt=""
      unoptimized
      aria-hidden="true"
    />
  );
}
export function Brand() {
  return (
    <Link href="/" className="brand">
      <LeafMark />
      <span className="brand-lockup">
        <span className="brand-word">RFT</span>
        <span className="brand-name">Ringgit Finance Tracker</span>
      </span>
    </Link>
  );
}
