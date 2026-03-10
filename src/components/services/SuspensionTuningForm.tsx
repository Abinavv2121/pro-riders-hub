
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
import { Mountain, Settings, TreePine } from "lucide-react";
import { useState } from "react";

interface SuspensionTuningFormProps {
  onSubmit?: (data: SuspensionTuningData) => void;
}

export interface SuspensionTuningData {
  forkBrand: string;
  forkModel: string;
  shockBrand: string;
  shockModel: string;
  terrainType: string;
  ridingStyle: string;
  riderWeight: string;
  currentIssues: string;
  desiredFeel: string;
}

const forkBrands = [
  { value: "rockshox", label: "RockShox" },
  { value: "fox", label: "Fox" },
  { value: "marzocchi", label: "Marzocchi" },
  { value: "ohlins", label: "Öhlins" },
  { value: "cane", label: "Cane" },
  { value: "other", label: "Other" },
];

const shockBrands = [
  { value: "rockshox", label: "RockShox" },
  { value: "fox", label: "Fox" },
  { value: "dvo", label: "DVO" },
  { value: "ohlins", label: "Öhlins" },
  { value: "other", label: "Other" },
];

const terrainTypes = [
  { value: "xc", label: "Cross Country (XC)" },
  { value: "trail", label: "Trail" },
  { value: "all-mountain", label: "All Mountain" },
  { value: "enduro", label: "Enduro" },
  { value: "dh", label: "Downhill" },
  { value: "gravel", label: "Gravel/Fire Roads" },
];

const ridingStyles = [
  { value: "smooth", label: "Smooth & Controlled" },
  { value: "aggressive", label: "Aggressive/Fast" },
  { value: "technical", label: "Technical" },
  { value: "flow", label: "Flow Trail" },
  { value: "climbing", label: "Climbing Focus" },
];

const desiredFeels = [
  { value: "plush", label: "Plush/Soft" },
  { value: "supportive", label: "Supportive" },
  { value: "firm", label: "Firm/Responsive" },
  { value: "balanced", label: "Balanced" },
  { value: "bottom-out", label: "More Bottom-Out Resistance" },
  { value: "traction", label: "More Traction" },
];

const SuspensionTuningForm = ({ onSubmit }: SuspensionTuningFormProps) => {
  const [formData, setFormData] = useState<SuspensionTuningData>({
    forkBrand: "",
    forkModel: "",
    shockBrand: "",
    shockModel: "",
    terrainType: "",
    ridingStyle: "",
    riderWeight: "",
    currentIssues: "",
    desiredFeel: "",
  });

  const handleSubmit = () => {
    onSubmit?.(formData);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Suspension Setup Form
        </CardTitle>
        <CardDescription>
          Tell us about your suspension setup and riding preferences
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Fork Information */}
        <div className="space-y-4">
          <h4 className="font-medium flex items-center gap-2">
            <Mountain className="w-4 h-4" />
            Fork Details
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Fork Brand</Label>
              <Select
                value={formData.forkBrand}
                onValueChange={(value) => setFormData({ ...formData, forkBrand: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select fork brand" />
                </SelectTrigger>
                <SelectContent>
                  {forkBrands.map((brand) => (
                    <SelectItem key={brand.value} value={brand.value}>
                      {brand.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Fork Model</Label>
              <Input
                placeholder="e.g., Pike, Revelation, 34..."
                value={formData.forkModel}
                onChange={(e) => setFormData({ ...formData, forkModel: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Shock Information */}
        <div className="space-y-4">
          <h4 className="font-medium flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Rear Shock Details
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Shock Brand</Label>
              <Select
                value={formData.shockBrand}
                onValueChange={(value) => setFormData({ ...formData, shockBrand: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select shock brand" />
                </SelectTrigger>
                <SelectContent>
                  {shockBrands.map((brand) => (
                    <SelectItem key={brand.value} value={brand.value}>
                      {brand.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Shock Model</Label>
              <Input
                placeholder="e.g., Deluxe, Super Deluxe, Float..."
                value={formData.shockModel}
                onChange={(e) => setFormData({ ...formData, shockModel: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Terrain and Riding Style */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <TreePine className="w-4 h-4" />
              Primary Terrain
            </Label>
            <Select
              value={formData.terrainType}
              onValueChange={(value) => setFormData({ ...formData, terrainType: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select terrain type" />
              </SelectTrigger>
              <SelectContent>
                {terrainTypes.map((terrain) => (
                  <SelectItem key={terrain.value} value={terrain.value}>
                    {terrain.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Riding Style</Label>
            <Select
              value={formData.ridingStyle}
              onValueChange={(value) => setFormData({ ...formData, ridingStyle: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select riding style" />
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
        </div>

        {/* Rider Weight */}
        <div className="space-y-2">
          <Label>Rider Weight (with gear)</Label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              placeholder="Enter weight"
              value={formData.riderWeight}
              onChange={(e) => setFormData({ ...formData, riderWeight: e.target.value })}
              className="flex-1"
            />
            <span className="text-muted-foreground">kg</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Required for proper suspension tuning
          </p>
        </div>

        {/* Current Issues */}
        <div className="space-y-2">
          <Label>Current Issues (if any)</Label>
          <Textarea
            placeholder="e.g., harsh bottom-out, too bouncy, poor traction, suspension bottoming easily..."
            value={formData.currentIssues}
            onChange={(e) => setFormData({ ...formData, currentIssues: e.target.value })}
            rows={2}
          />
        </div>

        {/* Desired Feel */}
        <div className="space-y-2">
          <Label>Desired Feel</Label>
          <Select
            value={formData.desiredFeel}
            onValueChange={(value) => setFormData({ ...formData, desiredFeel: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select desired feel" />
            </SelectTrigger>
            <SelectContent>
              {desiredFeels.map((feel) => (
                <SelectItem key={feel.value} value={feel.value}>
                  {feel.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Submit Button */}
        <Button onClick={handleSubmit} className="w-full">
          <Settings className="w-4 h-4 mr-2" />
          Submit Suspension Details
        </Button>
      </CardContent>
    </Card>
  );
};

export default SuspensionTuningForm;

