import Link from "next/link";
export function Brand() {
  return (
    <Link href="/" className="brand">
      <span className="brand-word">RFT</span>
      <span className="brand-name">
        Ringgit
        <br />
        Finance Tracker
      </span>
    </Link>
  );
}
