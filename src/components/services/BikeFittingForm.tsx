
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
import { Bike, Ruler, Scale, User } from "lucide-react";
import { useState } from "react";

interface BikeFittingFormProps {
  onSubmit?: (data: BikeFittingData) => void;
}

export interface BikeFittingData {
  height: string;
  heightUnit: "cm" | "ft";
  weight: string;
  weightUnit: "kg" | "lbs";
  ridingStyle: string;
  discomfortAreas: string;
  experienceLevel: string;
  primaryUse: string;
  injuries: string;
}

const ridingStyles = [
  { value: "road", label: "Road Cycling" },
  { value: "mtb", label: "Mountain Biking" },
  { value: "gravel", label: "Gravel Riding" },
  { value: "commuting", label: "Commuting" },
  { value: "fitness", label: "Fitness" },
  { value: "triathlon", label: "Triathlon" },
  { value: "recreational", label: "Recreational" },
];

const experienceLevels = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
  { value: "professional", label: "Professional" },
];

const primaryUses = [
  { value: "racing", label: "Racing" },
  { value: "endurance", label: "Endurance" },
  { value: "touring", label: "Touring" },
  { value: "commuting", label: "Daily Commuting" },
  { value: "weekend", label: "Weekend Rides" },
  { value: "fitness", label: "Fitness" },
];

const BikeFittingForm = ({ onSubmit }: BikeFittingFormProps) => {
  const [formData, setFormData] = useState<BikeFittingData>({
    height: "",
    heightUnit: "cm",
    weight: "",
    weightUnit: "kg",
    ridingStyle: "",
    discomfortAreas: "",
    experienceLevel: "",
    primaryUse: "",
    injuries: "",
  });

  const handleSubmit = () => {
    onSubmit?.(formData);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          Rider Details for Bike Fitting
        </CardTitle>
        <CardDescription>
          Please provide your measurements and riding preferences for a personalized fitting
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Height and Weight */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Ruler className="w-4 h-4" />
              Height
            </Label>
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Enter height"
                value={formData.height}
                onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                className="flex-1"
              />
              <Select
                value={formData.heightUnit}
                onValueChange={(value: "cm" | "ft") =>
                  setFormData({ ...formData, heightUnit: value })
                }
              >
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cm">cm</SelectItem>
                  <SelectItem value="ft">ft</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Scale className="w-4 h-4" />
              Weight
            </Label>
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Enter weight"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                className="flex-1"
              />
              <Select
                value={formData.weightUnit}
                onValueChange={(value: "kg" | "lbs") =>
                  setFormData({ ...formData, weightUnit: value })
                }
              >
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kg">kg</SelectItem>
                  <SelectItem value="lbs">lbs</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Riding Style */}
        <div className="space-y-2">
          <Label>Riding Style</Label>
          <Select
            value={formData.ridingStyle}
            onValueChange={(value) => setFormData({ ...formData, ridingStyle: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select your riding style" />
            </SelectTrigger>
            <SelectContent>
              {ridingStyles.map((style) => (
                <SelectItem key={style.value} value={style.value}>
                  {style.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Experience Level */}
        <div className="space-y-2">
          <Label>Experience Level</Label>
          <Select
            value={formData.experienceLevel}
            onValueChange={(value) => setFormData({ ...formData, experienceLevel: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select your experience level" />
            </SelectTrigger>
            <SelectContent>
              {experienceLevels.map((level) => (
                <SelectItem key={level.value} value={level.value}>
                  {level.label}
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

        {/* Discomfort Areas */}
        <div className="space-y-2">
          <Label>Any Discomfort Areas or Pain Points</Label>
          <Textarea
            placeholder="e.g., back pain, wrist numbness, knee pain, saddle sores..."
            value={formData.discomfortAreas}
            onChange={(e) => setFormData({ ...formData, discomfortAreas: e.target.value })}
            rows={3}
          />
        </div>

        {/* Previous Injuries */}
        <div className="space-y-2">
          <Label>Previous Injuries (if any)</Label>
          <Textarea
            placeholder="Any previous injuries that might affect your riding position..."
            value={formData.injuries}
            onChange={(e) => setFormData({ ...formData, injuries: e.target.value })}
            rows={2}
          />
        </div>

        {/* Submit Button */}
        <Button onClick={handleSubmit} className="w-full">
          <Bike className="w-4 h-4 mr-2" />
          Submit Rider Details
        </Button>
      </CardContent>
    </Card>
  );
};

export default BikeFittingForm;

