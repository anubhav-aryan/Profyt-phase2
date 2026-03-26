import Link from "next/link";

type Props = {
  href?: string;
  className?: string;
};

/** Matches phase 1 nav: serif PROFYT + italic tagline. */
export function ProfytWordmark({ href = "/", className = "" }: Props) {
  const inner = (
    <>
      <span className="font-serif text-2xl font-normal tracking-[-0.02em] text-black leading-none">
        PROFYT
      </span>
      <span className="mt-1 font-serif text-xs italic text-dark leading-none md:text-[13px]">
        Profit Scale, Engineered.
      </span>
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className={`flex flex-col items-start gap-0 no-underline transition-opacity duration-200 hover:opacity-80 ${className}`}
      >
        {inner}
      </Link>
    );
  }

  return <div className={`flex flex-col items-start gap-0 ${className}`}>{inner}</div>;
}
