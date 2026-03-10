
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { AnimatePresence, motion } from "framer-motion";
import { Truck } from "lucide-react";

interface PickupDeliveryOptionProps {
  enabled?: boolean;
  onToggle: (enabled: boolean) => void;
  price?: number;
}

const PickupDeliveryOption = ({ enabled = false, onToggle, price = 299 }: PickupDeliveryOptionProps) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Truck className="w-5 h-5" />
          Pickup & Delivery Service
        </CardTitle>
        <CardDescription>
          We can pick up your bike, service it, and deliver it back to you
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div 
          className={`flex items-start space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer ${
            enabled 
              ? "border-primary bg-primary/5" 
              : "border-border hover:border-primary/50"
          }`}
          onClick={() => onToggle(!enabled)}
        >
          <Checkbox
            id="pickup-delivery"
            checked={enabled}
            onCheckedChange={(checked) => onToggle(checked as boolean)}
            className="mt-1"
          />
          <div className="flex-1">
            <Label 
              htmlFor="pickup-delivery" 
              className="flex items-center justify-between cursor-pointer"
            >
              <div>
                <span className="font-medium">Request Pickup & Delivery</span>
                <p className="text-sm text-muted-foreground mt-1">
                  We'll collect your bike and return it after service
                </p>
              </div>
              <span className="font-heading font-bold text-primary text-lg">
                ₹{price}
              </span>
            </Label>
          </div>
        </div>

        <AnimatePresence>
          {enabled && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 p-4 bg-muted rounded-lg space-y-4"
            >
              <p className="text-sm text-muted-foreground">
                Our team will contact you to confirm pickup and delivery details after booking.
              </p>
              <div className="flex items-center gap-2 text-sm text-green-600">
                <Truck className="w-4 h-4" />
                <span>Free pickup within 10km radius</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};

export default PickupDeliveryOption;

