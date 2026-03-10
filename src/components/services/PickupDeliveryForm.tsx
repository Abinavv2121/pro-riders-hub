
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock, MapPin, Truck } from "lucide-react";
import { useState } from "react";

interface PickupDeliveryFormProps {
  onSubmit?: (data: PickupDeliveryData) => void;
}

export interface PickupDeliveryData {
  pickupAddress: string;
  pickupDate: string;
  pickupTime: string;
  deliveryAddress: string;
  specialInstructions: string;
  contactName: string;
  contactPhone: string;
}

const timeSlots = [
  { value: "09:00-11:00", label: "9:00 AM - 11:00 AM" },
  { value: "11:00-13:00", label: "11:00 AM - 1:00 PM" },
  { value: "13:00-15:00", label: "1:00 PM - 3:00 PM" },
  { value: "15:00-17:00", label: "3:00 PM - 5:00 PM" },
  { value: "17:00-19:00", label: "5:00 PM - 7:00 PM" },
];

const PickupDeliveryForm = ({ onSubmit }: PickupDeliveryFormProps) => {
  const [formData, setFormData] = useState<PickupDeliveryData>({
    pickupAddress: "",
    pickupDate: "",
    pickupTime: "",
    deliveryAddress: "",
    specialInstructions: "",
    contactName: "",
    contactPhone: "",
  });

  const [sameAsPickup, setSameAsPickup] = useState(true);

  const handleSubmit = () => {
    onSubmit?.(formData);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Truck className="w-5 h-5" />
          Pickup & Delivery Details
        </CardTitle>
        <CardDescription>
          Provide pickup and delivery information for your bike
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Contact Information */}
        <div className="space-y-4">
          <h4 className="font-medium">Contact Information</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contactName">Contact Name</Label>
              <Input
                id="contactName"
                placeholder="Enter your name"
                value={formData.contactName}
                onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactPhone">Phone Number</Label>
              <Input
                id="contactPhone"
                type="tel"
                placeholder="Enter phone number"
                value={formData.contactPhone}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Pickup Information */}
        <div className="space-y-4">
          <h4 className="font-medium flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Pickup Address
          </h4>
          <div className="space-y-2">
            <Label htmlFor="pickupAddress">Full Address</Label>
            <Textarea
              id="pickupAddress"
              placeholder="Enter complete pickup address with landmarks..."
              value={formData.pickupAddress}
              onChange={(e) => setFormData({ ...formData, pickupAddress: e.target.value })}
              rows={3}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pickupDate">
                <Calendar className="w-4 h-4 inline mr-2" />
                Preferred Pickup Date
              </Label>
              <Input
                id="pickupDate"
                type="date"
                value={formData.pickupDate}
                onChange={(e) => setFormData({ ...formData, pickupDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pickupTime">
                <Clock className="w-4 h-4 inline mr-2" />
                Preferred Time Slot
              </Label>
              <select
                id="pickupTime"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={formData.pickupTime}
                onChange={(e) => setFormData({ ...formData, pickupTime: e.target.value })}
              >
                <option value="">Select time slot</option>
                {timeSlots.map((slot) => (
                  <option key={slot.value} value={slot.value}>
                    {slot.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Delivery Information */}
        <div className="space-y-4">
          <h4 className="font-medium flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Delivery Address
          </h4>
          <div className="flex items-center gap-2 mb-2">
            <input
              type="checkbox"
              id="sameAsPickup"
              checked={sameAsPickup}
              onChange={(e) => {
                setSameAsPickup(e.target.checked);
                if (e.target.checked) {
                  setFormData({ ...formData, deliveryAddress: formData.pickupAddress });
                }
              }}
              className="w-4 h-4"
            />
            <Label htmlFor="sameAsPickup" className="cursor-pointer">
              Same as pickup address
            </Label>
          </div>
          {!sameAsPickup && (
            <div className="space-y-2">
              <Label htmlFor="deliveryAddress">Different Delivery Address</Label>
              <Textarea
                id="deliveryAddress"
                placeholder="Enter complete delivery address..."
                value={formData.deliveryAddress}
                onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
                rows={3}
              />
            </div>
          )}
        </div>

        {/* Special Instructions */}
        <div className="space-y-2">
          <Label>Special Instructions (Optional)</Label>
          <Textarea
            placeholder="Any special instructions for pickup or delivery..."
            value={formData.specialInstructions}
            onChange={(e) => setFormData({ ...formData, specialInstructions: e.target.value })}
            rows={2}
          />
        </div>

        {/* Service Info */}
        <div className="bg-muted rounded-lg p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Pickup & Delivery Service</span>
            <span className="font-medium">₹299</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Free pickup within 10km radius. Additional charges may apply for longer distances.
          </p>
        </div>

        {/* Submit Button */}
        <Button onClick={handleSubmit} className="w-full">
          <Truck className="w-4 h-4 mr-2" />
          Schedule Pickup & Delivery
        </Button>
      </CardContent>
    </Card>
  );
};

export default PickupDeliveryForm;

