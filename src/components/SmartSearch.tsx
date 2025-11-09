import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface SmartSearchProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
}

export const SmartSearch = ({ 
  onSearch, 
  placeholder = "Search for restaurants, hotels, clubs...",
  className 
}: SmartSearchProps) => {
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    if (query.trim()) {
      onSearch(query);
    }
  };

  return (
    <div className={cn("flex gap-2", className)}>
      <div className="flex-1 relative">
        <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          className="pl-10 h-12 text-base glass-card"
        />
      </div>
      <Button 
        size="lg" 
        onClick={handleSearch}
        className="h-12 glow-secondary"
      >
        <Search className="mr-2 h-5 w-5" />
        Smart Search
      </Button>
    </div>
  );
};
