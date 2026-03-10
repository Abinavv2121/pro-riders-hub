
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Check, CheckCircle2, Clock, Package, Truck, Wrench, Settings } from "lucide-react";

export type ServiceStage =
  | "received"
  | "diagnosing"
  | "awaiting-approval"
  | "in-service"
  | "ready"
  | "delivered";

interface ServiceStatusTrackerProps {
  currentStage: ServiceStage;
  showLabels?: boolean;
}

interface StageInfo {
  id: ServiceStage;
  label: string;
  description: string;
  icon: React.ElementType;
}

const stages: StageInfo[] = [
  { id: "received", label: "Received", description: "Bike received at workshop", icon: Package },
  { id: "diagnosing", label: "Diagnosing", description: "Technicians assessing the issues", icon: Clock },
  { id: "awaiting-approval", label: "Awaiting Approval", description: "Estimate sent for approval", icon: CheckCircle2 },
  { id: "in-service", label: "In Service", description: "Service work in progress", icon: Wrench },
  { id: "ready", label: "Ready", description: "Service completed, ready for pickup", icon: Settings },
  { id: "delivered", label: "Delivered", description: "Bike delivered to customer", icon: Truck },
];

const ServiceStatusTracker = ({ currentStage, showLabels = true }: ServiceStatusTrackerProps) => {
  const currentStageIndex = stages.findIndex((s) => s.id === currentStage);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Service Status</CardTitle>
        <CardDescription>Track the progress of your bike service</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Desktop View - Horizontal */}
        <div className="hidden md:block">
          <div className="flex items-center justify-between relative">
            {/* Progress Line */}
            <div className="absolute top-6 left-0 right-0 h-1 bg-muted rounded-full">
              <motion.div
                className="h-full bg-primary rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(currentStageIndex / (stages.length - 1)) * 100}%` }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              />
            </div>

            {/* Stages */}
            {stages.map((stage, index) => {
              const isCompleted = index <= currentStageIndex;
              const isCurrent = index === currentStageIndex;
              const Icon = stage.icon;

              return (
                <div key={stage.id} className="relative z-10 flex flex-col items-center">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isCompleted
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                      } ${isCurrent ? "ring-4 ring-primary/20" : ""}`}
                  >
                    {isCompleted ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </motion.div>
                  {showLabels && (
                    <div className="mt-3 text-center">
                      <p className={`text-sm font-medium ${isCurrent ? "text-primary" : ""}`}>
                        {stage.label}
                      </p>
                      <p className="text-xs text-muted-foreground hidden lg:block">
                        {stage.description}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile View - Vertical */}
        <div className="md:hidden space-y-4">
          {stages.map((stage, index) => {
            const isCompleted = index <= currentStageIndex;
            const isCurrent = index === currentStageIndex;
            const Icon = stage.icon;

            return (
              <motion.div
                key={stage.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-center gap-4 p-3 rounded-lg ${isCurrent ? "bg-primary/10 border border-primary/20" : ""
                  }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${isCompleted
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                    }`}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Icon className="w-4 h-4" />
                  )}
                </div>
                <div>
                  <p className={`font-medium ${isCurrent ? "text-primary" : ""}`}>
                    {stage.label}
                  </p>
                  <p className="text-xs text-muted-foreground">{stage.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Current Status Summary */}
        {currentStage && (
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">Current Status</p>
            <p className="font-heading font-semibold text-primary">
              {stages[currentStageIndex]?.label}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {stages[currentStageIndex]?.description}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ServiceStatusTracker;

