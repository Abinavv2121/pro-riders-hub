
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Bike, DollarSign, List, Sparkles } from "lucide-react";
import { useState } from "react";

interface CustomBuildFormProps {
  onSubmit?: (data: CustomBuildData) => void;
}

export interface CustomBuildData {
  bikeType: string;
  budgetRange: string;
  primaryUse: string;
  frameMaterial: string;
  componentPreferences: string;
  mustHaveComponents: string;
  colorPreference: string;
  additionalNotes: string;
}

const bikeTypes = [
  { value: "road", label: "Road Bike" },
  { value: "gravel", label: "Gravel Bike" },
  { value: "mtb", label: "Mountain Bike" },
  { value: "hybrid", label: "Hybrid Bike" },
  { value: "city", label: "City Bike" },
  { value: "fixie", label: "Fixie/Single Speed" },
  { value: "triathlon", label: "Triathlon Bike" },
  { value: "other", label: "Other" },
];

const budgetRanges = [
  { value: "50000-100000", label: "₹50,000 - ₹1,00,000" },
  { value: "100000-150000", label: "₹1,00,000 - ₹1,50,000" },
  { value: "150000-200000", label: "₹1,50,000 - ₹2,00,000" },
  { value: "200000-300000", label: "₹2,00,000 - ₹3,00,000" },
  { value: "300000+", label: "₹3,00,000+" },
];

const primaryUses = [
  { value: "racing", label: "Racing" },
  { value: "commuting", label: "Daily Commuting" },
  { value: "fitness", label: "Fitness" },
  { value: "touring", label: "Touring" },
  { value: "adventure", label: "Adventure/Bikepacking" },
  { value: "recreational", label: "Recreational" },
];

const frameMaterials = [
  { value: "carbon", label: "Carbon Fiber" },
  { value: "aluminum", label: "Aluminum" },
  { value: "steel", label: "Steel" },
  { value: "titanium", label: "Titanium" },
  { value: "no-preference", label: "No Preference" },
];

const CustomBuildForm = ({ onSubmit }: CustomBuildFormProps) => {
  const [formData, setFormData] = useState<CustomBuildData>({
    bikeType: "",
    budgetRange: "",
    primaryUse: "",
    frameMaterial: "",
    componentPreferences: "",
    mustHaveComponents: "",
    colorPreference: "",
    additionalNotes: "",
  });

  const handleSubmit = () => {
    onSubmit?.(formData);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          Dream Build Request
        </CardTitle>
        <CardDescription>
          Tell us about your dream bike and we'll build it for you
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Bike Type */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Bike className="w-4 h-4" />
            Bike Type
          </Label>
          <Select
            value={formData.bikeType}
            onValueChange={(value) => setFormData({ ...formData, bikeType: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select bike type" />
            </SelectTrigger>
            <SelectContent>
              {bikeTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Budget Range */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            Budget Range
          </Label>
          <Select
            value={formData.budgetRange}
            onValueChange={(value) => setFormData({ ...formData, budgetRange: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select budget range" />
            </SelectTrigger>
            <SelectContent>
              {budgetRanges.map((range) => (
                <SelectItem key={range.value} value={range.value}>
                  {range.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Primary Use */}
        <div className="space-y-2">
          <Label>Primary Use</Label>
          <Select
            value={formData.primaryUse}
            onValueChange={(value) => setFormData({ ...formData, primaryUse: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select primary use" />
            </SelectTrigger>
            <SelectContent>
              {primaryUses.map((use) => (
                <SelectItem key={use.value} value={use.value}>
                  {use.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Frame Material */}
        <div className="space-y-2">
          <Label>Preferred Frame Material</Label>
          <Select
            value={formData.frameMaterial}
            onValueChange={(value) => setFormData({ ...formData, frameMaterial: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select frame material" />
            </SelectTrigger>
            <SelectContent>
              {frameMaterials.map((material) => (
                <SelectItem key={material.value} value={material.value}>
                  {material.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Component Preferences */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <List className="w-4 h-4" />
            Component Preferences
          </Label>
          <Textarea
            placeholder="e.g., Prefer Shimano over SRAM, want hydraulic disc brakes, carbon wheels..."
            value={formData.componentPreferences}
            onChange={(e) => setFormData({ ...formData, componentPreferences: e.target.value })}
            rows={3}
          />
        </div>

        {/* Must Have Components */}
        <div className="space-y-2">
          <Label>Must-Have Components</Label>
          <Textarea
            placeholder="List components that are must-haves for your build..."
            value={formData.mustHaveComponents}
            onChange={(e) => setFormData({ ...formData, mustHaveComponents: e.target.value })}
            rows={2}
          />
        </div>

        {/* Color Preference */}
        <div className="space-y-2">
          <Label>Color Preference</Label>
          <Input
            placeholder="e.g., Matte Black, Racing Red, Custom Paint..."
            value={formData.colorPreference}
            onChange={(e) => setFormData({ ...formData, colorPreference: e.target.value })}
          />
        </div>

        {/* Additional Notes */}
        <div className="space-y-2">
          <Label>Additional Notes</Label>
          <Textarea
            placeholder="Any other requirements or questions..."
            value={formData.additionalNotes}
            onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
            rows={3}
          />
        </div>

        {/* Submit Button */}
        <Button onClick={handleSubmit} className="w-full">
          <Sparkles className="w-4 h-4 mr-2" />
          Submit Dream Build Request
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          Our team will contact you within 24 hours to discuss your custom build in detail.
        </p>
      </CardContent>
    </Card>
  );
};

export default CustomBuildForm;

