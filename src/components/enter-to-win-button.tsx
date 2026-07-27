import Image from "next/image";
import { EXTERNAL } from "@/lib/site";

// "Enter to Win" CTA with the Party Animal mascot popping over the corner.
// Links to the toys store (where the contest lives) in a new tab.
export function EnterToWinButton({
  fullWidth = false,
  className = "",
  onClick,
}: {
  fullWidth?: boolean;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <a
      href={EXTERNAL.enterToWin}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
      className={[
        "group label-athletic relative inline-flex items-center justify-center rounded-full bg-brand-red text-sm text-white shadow-lg shadow-brand-red/30 transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-red-dark",
        fullWidth ? "w-full px-6 py-3" : "pl-5 pr-6 py-2.5",
        className,
      ].join(" ")}
    >
      {/* Mascot peeking over the top-right corner */}
      <span className="pointer-events-none absolute -right-3 -top-5 h-11 w-11 rotate-[14deg] drop-shadow-[0_3px_5px_rgba(0,0,0,0.55)] transition-transform duration-200 group-hover:-translate-y-1 group-hover:rotate-[22deg]">
        <Image
          src="/brand/pa-mascot.png"
          alt=""
          fill
          sizes="44px"
          className="object-contain"
        />
      </span>
      Enter to Win
    </a>
  );
}
