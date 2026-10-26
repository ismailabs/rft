import Image from "next/image";
export function GoogleAction({
  label,
  className = "",
}: {
  label: string;
  className?: string;
}) {
  return (
    <form
      method="post"
      action="/auth/sign-in"
      className={`google-action ${className}`}
    >
      <button className="button" type="submit">
        <Image
          src="/brand/google-g.png"
          width={20}
          height={20}
          alt=""
          unoptimized
        />
        {label}
      </button>
    </form>
  );
}
