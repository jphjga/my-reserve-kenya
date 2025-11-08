import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { interests, Interest } from "@/mocks/interests";

interface InterestSelectorProps {
  selectedInterests: string[];
  onInterestsChange: (interests: string[]) => void;
  className?: string;
}

export const InterestSelector = ({ 
  selectedInterests, 
  onInterestsChange,
  className 
}: InterestSelectorProps) => {
  const toggleInterest = (interestId: string) => {
    if (selectedInterests.includes(interestId)) {
      onInterestsChange(selectedInterests.filter(id => id !== interestId));
    } else {
      onInterestsChange([...selectedInterests, interestId]);
    }
  };

  const categories = {
    dining: interests.filter(i => i.category === 'dining'),
    nightlife: interests.filter(i => i.category === 'nightlife'),
    accommodation: interests.filter(i => i.category === 'accommodation'),
    events: interests.filter(i => i.category === 'events'),
    activities: interests.filter(i => i.category === 'activities'),
  };

  return (
    <div className={cn("space-y-6", className)}>
      {Object.entries(categories).map(([category, items]) => (
        <div key={category}>
          <h3 className="text-sm font-semibold mb-3 capitalize text-foreground">
            {category}
          </h3>
          <div className="flex flex-wrap gap-2">
            {items.map((interest) => (
              <Badge
                key={interest.id}
                variant={selectedInterests.includes(interest.id) ? "default" : "outline"}
                className={cn(
                  "cursor-pointer transition-all hover:scale-105",
                  selectedInterests.includes(interest.id) && "glow-primary"
                )}
                onClick={() => toggleInterest(interest.id)}
              >
                <span className="mr-1">{interest.icon}</span>
                {interest.name}
              </Badge>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
