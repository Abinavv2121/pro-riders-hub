import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Check, Sparkles, Star, Zap } from "lucide-react";

export interface ServicePackage {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
  icon: "basic" | "standard" | "premium";
  popular?: boolean;
}

interface ServicePackagesProps {
  packages: ServicePackage[];
  onSelectPackage: (pkg: ServicePackage) => void;
  selectedPackageId?: string;
}

const iconMap = {
  basic: Zap,
  standard: Star,
  premium: Sparkles,
};

const colorMap = {
  basic: "text-yellow-500",
  standard: "text-blue-500",
  premium: "text-purple-500",
};

const ServicePackages = ({ packages, onSelectPackage, selectedPackageId }: ServicePackagesProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="font-heading text-h3 font-bold text-foreground mb-2">Choose Your Service Package</h3>
        <p className="text-muted-foreground text-sm">Select the package that best fits your needs</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {packages.map((pkg, index) => {
          const Icon = iconMap[pkg.icon];
          const isSelected = selectedPackageId === pkg.id;

          return (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
            >
              <Card
                className={`h-full relative overflow-hidden transition-all duration-300 cursor-pointer ${
                  isSelected
                    ? "border-primary ring-2 ring-primary/20"
                    : "border-border hover:border-primary/50"
                } ${pkg.popular ? "md:-mt-4 md:mb-4" : ""}`}
                onClick={() => onSelectPackage(pkg)}
                style={{ backgroundColor: "#FFFFFF", color: "#000000" }}
              >
                {pkg.popular && (
                  <div className="absolute top-0 right-0">
                    <Badge className="bg-primary text-primary-foreground rounded-tl-lg rounded-br-lg rounded-tr-none rounded-bl-none">
                      Most Popular
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-4">
                  <div className={`mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4 ${colorMap[pkg.icon]}`}>
                    <Icon className="w-8 h-8" />
                  </div>
                  <CardTitle className="font-heading text-xl text-[#000000]">{pkg.name}</CardTitle>
                  <CardDescription className="text-xs mt-1 text-[#000000]">{pkg.description}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="text-center">
                    <span className="font-heading text-3xl font-bold text-primary">₹{pkg.price}</span>
                    <span className="text-[#000000] text-sm">/service</span>
                  </div>

                  <ul className="space-y-2">
                    {pkg.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-[#000000]">
                        <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-[#000000]">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter>
                  <Button
                    className={`w-full bg-primary text-white hover:bg-primary/80 hover:scale-[1.03] hover:shadow-lg transition-all duration-300 ease-out cursor-pointer ${isSelected ? "ring-2 ring-primary/40" : ""}`}
                  >
                    {isSelected ? "Selected" : "Select Package"}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default ServicePackages;

