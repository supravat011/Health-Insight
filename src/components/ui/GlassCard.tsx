import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  variant?: "light" | "dark" | "default";
  hoverEffect?: boolean;
}

const GlassCard = ({
  children,
  className,
  variant = "default",
  hoverEffect = false,
  ...props
}: GlassCardProps) => {
  return (
    <div
      className={cn(
        "grid-panel rounded-none p-6 transition-all duration-200 border border-border bg-card",
        hoverEffect && "hover:shadow-hover hover:-translate-y-1 hover:translate-x-1",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default GlassCard;
