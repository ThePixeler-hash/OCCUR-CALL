import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export function GlassCard({ children, className, hover = false }: GlassCardProps) {
  return (
    <div
      className={cn(
        "backdrop-blur-xl bg-white/10 dark:bg-black/30 border border-white/20 dark:border-white/10 rounded-2xl",
        "transition-all duration-300 ease-out",
        hover && "hover:translate-y-[-2px] hover:shadow-xl hover:shadow-black/15 dark:hover:shadow-white/10",
        className
      )}
    >
      {children}
    </div>
  );
}
