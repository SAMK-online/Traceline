import { Waypoints } from "lucide-react";

export function TracelineBrand({
  inverse = false,
  compact = false,
}: {
  inverse?: boolean;
  compact?: boolean;
}) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <span
        className={`grid size-8 place-items-center rounded-[6px] ${
          inverse
            ? "bg-[#d8f3df] text-[#173d2a]"
            : "bg-[#1f5c3f] text-white"
        }`}
      >
        <Waypoints aria-hidden="true" className="size-[18px]" strokeWidth={2} />
      </span>
      <span
        className={`font-semibold leading-none ${compact ? "text-base" : "text-[1.08rem]"}`}
      >
        Traceline
      </span>
    </span>
  );
}
