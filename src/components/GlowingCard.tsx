import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface GlowingCardProps {
  children: React.ReactNode;
  glowColor?: string;
  className?: string;
  onClick?: () => void;
}

export const GlowingCard = ({ 
  children, 
  glowColor = 'rgba(255, 100, 50, 0.3)', 
  className,
  onClick 
}: GlowingCardProps) => {
  return (
    <Card
      className={cn(
        "glass-card transition-all duration-300 hover:scale-[1.02] cursor-pointer",
        className
      )}
      style={{
        boxShadow: `0 0 40px ${glowColor}, 0 4px 12px rgba(0, 0, 0, 0.1)`
      }}
      onClick={onClick}
    >
      {children}
    </Card>
  );
};
