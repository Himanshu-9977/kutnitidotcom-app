import { cn } from "@/lib/utils";

interface AdBannerProps {
  className?: string;
  type?: "horizontal" | "vertical" | "square";
  label?: string;
}

export function AdBanner({ className, type = "horizontal", label = "Advertisement" }: AdBannerProps) {
  const dimensions = {
    horizontal: "h-24 w-full md:h-32",
    vertical: "h-[600px] w-full max-w-[300px]",
    square: "h-[250px] w-[250px]",
  };

  return (
    <div className={cn("flex flex-col items-center gap-2 py-8", className)}>
      <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground/60">
        {label}
      </span>
      <div
        className={cn(
          "flex items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 text-muted-foreground/40 transition-colors hover:bg-muted/50",
          dimensions[type]
        )}
      >
        <div className="flex flex-col items-center gap-1">
          <span className="text-xs font-semibold uppercase tracking-tighter opacity-50">Sponsor</span>
          <span className="text-sm font-medium">Space Available</span>
        </div>
      </div>
    </div>
  );
}
