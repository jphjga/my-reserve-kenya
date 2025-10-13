import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface BusinessProfileCompletionProps {
  businessId: string;
  onComplete: () => void;
}

const BusinessProfileCompletion = ({ businessId, onComplete }: BusinessProfileCompletionProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [amenities, setAmenities] = useState("");

  const handleComplete = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const amenitiesArray = amenities.split(",").map(a => a.trim()).filter(a => a);
      
      const { error } = await supabase
        .from("businesses")
        .update({
          description,
          image_url: imageUrl || null,
          price_range: priceRange || null,
          amenities: amenitiesArray.length > 0 ? amenitiesArray : null,
          profile_completed: true,
        })
        .eq("id", businessId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile completed successfully!",
      });

      onComplete();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Complete Your Business Profile</CardTitle>
        <CardDescription>
          Add more details to make your business stand out
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleComplete} className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Business Description *
            </label>
            <Textarea
              placeholder="Tell customers about your business..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={4}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Image URL (optional)
            </label>
            <Input
              type="url"
              placeholder="https://example.com/image.jpg"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Price Range (optional)
            </label>
            <Input
              type="text"
              placeholder="e.g., $$ or KSh 500-2000"
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Amenities (optional, comma-separated)
            </label>
            <Input
              type="text"
              placeholder="e.g., WiFi, Parking, Pool"
              value={amenities}
              onChange={(e) => setAmenities(e.target.value)}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Saving..." : "Complete Profile"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default BusinessProfileCompletion;
