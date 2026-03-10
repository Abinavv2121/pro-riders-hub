
import PageShell from "@/components/PageShell";
import {
  BookingCalendar,
  PickupDeliveryOption,
  ReminderSettings,
  ServicePackages,
  ServiceRequestForm,
  ServiceStatusTracker,
  TimeSlotSelector,
  type ServicePackage,
  type ServiceStage,
} from "@/components/services";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";
import { useState } from "react";

// Service packages data
const servicePackages: ServicePackage[] = [
  {
    id: "basic",
    name: "Basic Service",
    description: "Essential maintenance for regular riders",
    price: 999,
    features: [
      "Brake adjustment",
      "Gear tuning",
      "Chain lubrication",
      "Tire pressure check",
      "Basic safety inspection",
    ],
    icon: "basic",
  },
  {
    id: "standard",
    name: "Standard Service",
    description: "Complete maintenance for optimal performance",
    price: 2499,
    features: [
      "Everything in Basic",
      "Full bearing check",
      "Wheel trueing",
      "Cable replacement",
      "Fork/suspension check",
      "Detailed cleaning",
    ],
    icon: "standard",
    popular: true,
  },
  {
    id: "premium",
    name: "Premium Service",
    description: "Full overhaul for peak performance",
    price: 4999,
    features: [
      "Everything in Standard",
      "Complete bearing overhaul",
      "Hydraulic brake service",
      "Suspension tuning",
      "Frame inspection",
      "Priority scheduling",
    ],
    icon: "premium",
  },
];

const BikeServicing = () => {
  const [selectedPackage, setSelectedPackage] = useState<ServicePackage | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [priorityBooking, setPriorityBooking] = useState(false);
  const [pickupDelivery, setPickupDelivery] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [serviceStage, setServiceStage] = useState<ServiceStage>("received");

  const totalPrice = selectedPackage?.price || 0;
  const pickupDeliveryPrice = pickupDelivery ? 299 : 0;
  const priorityPrice = priorityBooking ? 199 : 0;
  const grandTotal = totalPrice + pickupDeliveryPrice + priorityPrice;

  const handlePackageSelect = (pkg: ServicePackage) => {
    setSelectedPackage(pkg);
    setCurrentStep(2);
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const handleSlotSelect = (slot: string) => {
    setSelectedSlot(slot);
  };

  const handleSubmitBooking = () => {
    if (selectedPackage && selectedDate && selectedSlot) {
      // In a real app, this would submit to backend
      alert("Booking submitted successfully! We'll contact you shortly.");
    }
  };

  const handleBookViaWhatsApp = () => {
    const message = `
🚴 *Bike Servicing Booking Request*

*Package:* ${selectedPackage?.name}
*Price:* ₹${selectedPackage?.price}

*Appointment:*
- Date: ${selectedDate?.toLocaleDateString()}
- Time Slot: ${selectedSlot}
- Priority: ${priorityBooking ? "Yes (+₹199)" : "No"}

*Pickup & Delivery:* ${pickupDelivery ? "Yes (+₹299)" : "No"}

*Total:* ₹${grandTotal}

_Requested from Pro Riders Hub Website_
    `.trim();

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/919876543210?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <PageShell>
      <section className="relative h-[50vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40" />
        <div className="absolute inset-0 bg-[url('@/assets/service-fitting.jpg')] bg-cover bg-center" />
        <div className="relative z-10 container mx-auto px-5 md:px-8">
          <h1 className="font-heading text-hero-sm md:text-section text-foreground mb-4">
            Bike Servicing
          </h1>
          <p className="text-muted-foreground font-body text-body max-w-xl">
            Professional bike servicing from basic tune-ups to full overhauls. 
            Our certified mechanics ensure your bike performs at its best.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-5 md:px-8 py-16 space-y-16">
        {/* Step 1: Select Package */}
        <div>
          <div className="flex items-center gap-4 mb-8">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
              1
            </div>
            <h2 className="font-heading text-h3">Choose Your Service Package</h2>
          </div>
          <ServicePackages
            packages={servicePackages}
            onSelectPackage={handlePackageSelect}
            selectedPackageId={selectedPackage?.id}
          />
        </div>

        {/* Step 2: Select Date & Time */}
        {selectedPackage && (
          <div>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                2
              </div>
              <h2 className="font-heading text-h3">Schedule Your Appointment</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <BookingCalendar
                selectedDate={selectedDate}
                onDateSelect={handleDateSelect}
                priorityBooking={priorityBooking}
                onPriorityChange={setPriorityBooking}
              />
              <TimeSlotSelector
                selectedSlot={selectedSlot}
                onSlotSelect={handleSlotSelect}
              />
            </div>
          </div>
        )}

        {/* Step 3: Additional Options */}
        {selectedDate && selectedSlot && (
          <div>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                3
              </div>
              <h2 className="font-heading text-h3">Additional Options</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <PickupDeliveryOption
                enabled={pickupDelivery}
                onToggle={setPickupDelivery}
                price={299}
              />
              <ServiceRequestForm />
            </div>
          </div>
        )}

        {/* Booking Summary */}
        {selectedPackage && selectedDate && selectedSlot && (
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-6">
              <h3 className="font-heading text-h4 mb-6">Booking Summary</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Service Package</span>
                  <span className="font-medium">{selectedPackage.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Base Price</span>
                  <span className="font-medium">₹{selectedPackage.price}</span>
                </div>
                {priorityBooking && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Priority Booking</span>
                    <span className="font-medium">₹199</span>
                  </div>
                )}
                {pickupDelivery && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Pickup & Delivery</span>
                    <span className="font-medium">₹299</span>
                  </div>
                )}
                <div className="border-t pt-3 flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">₹{grandTotal}</span>
                </div>
              </div>

              <Button onClick={handleBookViaWhatsApp} className="w-full" size="lg">
                <MessageSquare className="w-5 h-5 mr-2" />
                Book via WhatsApp
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Service Status Tracker Demo */}
        <div>
          <h2 className="font-heading text-h3 mb-8 text-center">Track Your Service</h2>
          <div className="max-w-3xl mx-auto">
            <ServiceStatusTracker currentStage={serviceStage} />
            <div className="flex justify-center gap-2 mt-4 flex-wrap">
              <Button variant="outline" size="sm" onClick={() => setServiceStage("received")}>
                Received
              </Button>
              <Button variant="outline" size="sm" onClick={() => setServiceStage("diagnosing")}>
                Diagnosing
              </Button>
              <Button variant="outline" size="sm" onClick={() => setServiceStage("in-service")}>
                In Service
              </Button>
              <Button variant="outline" size="sm" onClick={() => setServiceStage("ready")}>
                Ready
              </Button>
              <Button variant="outline" size="sm" onClick={() => setServiceStage("delivered")}>
                Delivered
              </Button>
            </div>
          </div>
        </div>

        {/* Reminder Settings */}
        <div className="max-w-xl mx-auto">
          <ReminderSettings />
        </div>
      </section>
    </PageShell>
  );
};

export default BikeServicing;

