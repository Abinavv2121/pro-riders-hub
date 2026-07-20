import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Check, Wrench, Settings, Star } from "lucide-react";
import serviceCheckup from "@/assets/service-checkup.png";
import serviceFull from "@/assets/service-full.png";

export interface ServicePackage {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
  icon: "basic" | "standard" | "premium" | "safety" | "overhaul-alloy" | "overhaul-carbon";
  popular?: boolean;
  category?: "hybrid-mtb" | "road";
}

interface ServicePackagesProps {
  packages: ServicePackage[];
  onSelectPackage: (pkg: ServicePackage) => void;
  selectedPackageId?: string;
}

const iconMap = {
  basic: Settings,
  standard: Settings,
  premium: Star,
  safety: Wrench,
  "overhaul-alloy": Star,
  "overhaul-carbon": Star,
};

const getPackageImage = (pkg: ServicePackage) => {
  const lowerId = pkg.id.toLowerCase();
  const lowerIcon = pkg.icon.toLowerCase();
  
  if (lowerId.includes("safety") || lowerIcon === "safety") {
    return serviceCheckup;
  }
  if (
    lowerId.includes("overhaul") || 
    lowerId.includes("complete") || 
    lowerIcon === "premium" || 
    lowerIcon === "overhaul-alloy" || 
    lowerIcon === "overhaul-carbon"
  ) {
    return serviceFull;
  }
  // Performance tune / General service drivetrain image
  return "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=600&q=80";
};

const getButtonText = (pkgName: string) => {
  const lower = pkgName.toLowerCase();
  if (lower.includes("safety")) return "SELECT CHECK UP";
  if (lower.includes("performance") || lower.includes("tune")) return "SELECT GENERAL SERVICE";
  if (lower.includes("overhaul")) return "SELECT FULL SERVICE";
  return "SELECT PACKAGE";
};

const ServicePackages = ({ packages, onSelectPackage, selectedPackageId }: ServicePackagesProps) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch w-full">
        {packages.map((pkg, index) => {
          const Icon = iconMap[pkg.icon] || Settings;
          const isSelected = selectedPackageId === pkg.id;
          const imgUrl = getPackageImage(pkg);
          const buttonText = getButtonText(pkg.name);

          return (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className="h-full"
            >
              <Card
                className={`group overflow-hidden transition-all duration-300 cursor-pointer flex flex-col h-[480px] ${
                  isSelected 
                    ? "border-sky-500 ring-2 ring-sky-500/20 shadow-xl" 
                    : "border-border hover:shadow-xl hover:border-sky-500/30"
                }`}
                onClick={() => onSelectPackage(pkg)}
              >
                {/* Upper part split horizontally */}
                <div className="flex flex-row flex-grow h-[calc(100%-52px)] overflow-hidden">
                  {/* Left Image */}
                  <div className="w-[42%] h-full relative overflow-hidden flex-shrink-0">
                    <img
                      src={imgUrl}
                      alt={pkg.name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  
                  {/* Right Content */}
                  <div className={`w-[58%] h-full flex flex-col p-4 relative justify-between pt-10 transition-colors duration-300 ${
                    isSelected ? "bg-[#0b0f19]" : "bg-white group-hover:bg-[#0b0f19]"
                  }`}>
                    {pkg.popular && (
                      <div className="absolute top-0 left-0 right-0 bg-[#0ea5e9] text-white text-center py-1 text-[9px] font-black uppercase tracking-widest">
                        Most Popular
                      </div>
                    )}
                    
                    <div className="flex flex-col h-full justify-between">
                      <div>
                        {/* Circle Icon */}
                        <div className={`mx-auto w-9 h-9 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${
                          isSelected 
                            ? "bg-sky-500/10 text-sky-400 border border-sky-500/20" 
                            : "bg-white text-gray-700 border border-gray-200 group-hover:bg-sky-500/10 group-hover:text-sky-400 group-hover:border-sky-500/20 shadow-sm"
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        
                        <h3 className={`font-heading text-sm font-extrabold text-center tracking-tight mb-1 uppercase transition-colors duration-300 ${
                          isSelected ? "text-white" : "text-[#111111] group-hover:text-white"
                        }`}>
                          {pkg.name}
                        </h3>
                        
                        <p className={`text-[10px] text-center mb-2 leading-tight max-w-[130px] mx-auto transition-colors duration-300 ${
                          isSelected ? "text-gray-400" : "text-gray-500 group-hover:text-gray-400"
                        }`}>
                          {pkg.description}
                        </p>
                        
                        <div className="text-center mb-3">
                          <span className={`font-heading text-lg font-black transition-colors duration-300 ${
                            isSelected ? "text-sky-400" : "text-sky-500 group-hover:text-sky-400"
                          }`}>₹{pkg.price}</span>
                          <span className={`text-[9px] transition-colors duration-300 ${
                            isSelected ? "text-gray-400" : "text-gray-500 group-hover:text-gray-400"
                          }`}> / service</span>
                        </div>
                      </div>
                      
                      <ul className="space-y-1.5 px-1 flex-grow overflow-y-auto mb-2">
                        {pkg.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-1 text-[10px] transition-colors duration-300">
                            <Check className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 transition-colors duration-300 ${
                              isSelected ? "text-sky-400" : "text-sky-500 group-hover:text-sky-400"
                            }`} />
                            <span className={`leading-tight transition-colors duration-300 ${
                              isSelected ? "text-gray-300" : "text-gray-700 group-hover:text-gray-300"
                            }`}>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
                
                {/* Full-width Button at the bottom */}
                <Button
                  className={`w-full transition-all duration-300 uppercase text-[10px] font-black tracking-wider py-4 rounded-none flex items-center justify-center gap-1 cursor-pointer h-[52px] ${
                    isSelected
                      ? "bg-[#0ea5e9] text-white hover:bg-[#0284c7]"
                      : "bg-white border-t border-gray-200 text-[#111111] hover:bg-[#0ea5e9] hover:text-white hover:border-none group-hover:bg-[#0ea5e9] group-hover:text-white group-hover:border-none"
                  }`}
                >
                  {isSelected ? "SELECTED" : buttonText}
                  <span className="text-[10px] font-black">&nbsp;&gt;</span>
                </Button>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default ServicePackages;
