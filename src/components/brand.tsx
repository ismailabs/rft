import Link from "next/link";
export function LeafMark() {
  return (
    <svg
      className="leaf-mark"
      width="35"
      height="47"
      viewBox="0 0 35 47"
      aria-hidden="true"
    >
      <path
        fill="#008565"
        d="M29 1 7 11C3 13 2 17 2 21v20c0 5 2 6 6 4l21-10c3-2 4-5 4-9V6c0-5-1-6-4-5Z"
      />
      <path
        d="M4 31c8-10 18-6 27-17"
        fill="none"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
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
