
import PageShell from "@/components/PageShell";
import {
  BookingCalendar,
  PickupDeliveryOption,
  ServicePackages,
  ServiceRequestForm,
  TimeSlotSelector,
  type ServicePackage,
} from "@/components/services";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, Wrench, ShieldCheck, FileCheck, Award } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import bikeServicingHero from "@/assets/bike-servicing-hero.png";

// Service packages data
const servicePackages: ServicePackage[] = [
  // Hybrid / MTB Bikes
  {
    id: "hybrid-safety-check",
    name: "Safety Check (Hybrid / MTB)",
    description: "Essential check. Total peace of mind.",
    price: 500,
    features: [
      "Safety checks",
      "Brake inspection",
      "Gear inspection",
      "Bolt tightening",
      "Air pressure check",
      "Lubrication touch up"
    ],
    icon: "safety",
    category: "hybrid-mtb"
  },
  {
    id: "hybrid-performance-tune",
    name: "Performance Tune (Hybrid / MTB)",
    description: "Clean. Tune. Ride better.",
    price: 1000,
    features: [
      "Bike wash and cleaning",
      "Full degreasing of drivetrain",
      "Deep cleaning of cassette, chain and crank",
      "Gear tuning",
      "Brake adjustment",
      "Frame polishing",
      "Bottom bracket & headset inspection",
      "Detailed safety inspection"
    ],
    icon: "standard",
    popular: true,
    category: "hybrid-mtb"
  },
  {
    id: "hybrid-complete-overhaul",
    name: "Complete Overhaul (Hybrid / MTB)",
    description: "Full care. Peak performance.",
    price: 2500,
    features: [
      "Complete bike teardown",
      "Complete tuning and rebuild",
      "Complete deep cleaning"
    ],
    icon: "premium",
    category: "hybrid-mtb"
  },
  // Road Bikes
  {
    id: "road-safety-check",
    name: "Safety Check (Road)",
    description: "Essential check. Total peace of mind.",
    price: 500,
    features: [
      "Safety checks",
      "Brake inspection",
      "Gear inspection",
      "Bolt tightening",
      "Air pressure check",
      "Lubrication touch up"
    ],
    icon: "safety",
    category: "road"
  },
  {
    id: "road-performance-tune",
    name: "Performance Tune (Road)",
    description: "Clean. Tune. Ride better.",
    price: 1200,
    features: [
      "Bike wash and cleaning",
      "Full degreasing of drivetrain",
      "Deep cleaning of cassette, chain and crank",
      "Gear tuning",
      "Brake adjustment",
      "Frame polishing",
      "Bottom bracket & headset inspection",
      "Detailed safety inspection"
    ],
    icon: "standard",
    popular: true,
    category: "road"
  },
  {
    id: "road-precision-overhaul-alloy",
    name: "Precision Overhaul - Alloy (Road)",
    description: "Complete care for alloy performance.",
    price: 3500,
    features: [
      "Complete bike teardown",
      "Complete tuning and rebuild",
      "Complete deep cleaning"
    ],
    icon: "overhaul-alloy",
    category: "road"
  },
  {
    id: "road-precision-overhaul-carbon",
    name: "Precision Overhaul - Carbon (Road)",
    description: "Advanced care for high-performance carbon.",
    price: 5000,
    features: [
      "Complete bike teardown",
      "Complete tuning and rebuild",
      "Complete deep cleaning"
    ],
    icon: "overhaul-carbon",
    category: "road"
  }
];

const BikeServicing = () => {
  const [bikeCategory, setBikeCategory] = useState<"hybrid-mtb" | "road">("hybrid-mtb");
  const [selectedPackage, setSelectedPackage] = useState<ServicePackage | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [priorityBooking, setPriorityBooking] = useState(false);
  const [pickupDelivery, setPickupDelivery] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const handleCategoryChange = (category: "hybrid-mtb" | "road") => {
    setBikeCategory(category);
    setSelectedPackage(null);
  };

  const filteredPackages = servicePackages.filter((pkg) => pkg.category === bikeCategory);

  const totalPrice = selectedPackage?.price || 0;
  const pickupDeliveryPrice = pickupDelivery ? 299 : 0;
  const priorityPrice = priorityBooking ? 199 : 0;
  const grandTotal = totalPrice + pickupDeliveryPrice + priorityPrice;

  const handlePackageSelect = (pkg: ServicePackage) => {
    if (selectedPackage?.id === pkg.id) {
      setSelectedPackage(null);
      setSelectedDate(null);
      setSelectedSlot(null);
      setCurrentStep(1);
    } else {
      setSelectedPackage(pkg);
      setCurrentStep(2);
    }
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const handleSlotSelect = (slot: string) => {
    setSelectedSlot(slot);
  };

  const [submittingService, setSubmittingService] = useState(false);

  const handleServiceRequestSubmit = async (formData: any) => {
    if (!selectedPackage || !selectedDate || !selectedSlot) {
      toast.error("Please select a package, date, and time slot first.");
      return;
    }

    setSubmittingService(true);
    try {
      const uploadedPhotos: string[] = [];
      // 1. Upload photos to product-images bucket
      for (const file of formData.bikePhotos) {
        const fileName = `services/${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
        const { data, error } = await supabase.storage
          .from("product-images")
          .upload(fileName, file, { upsert: true });
        if (error) throw error;
        const { data: urlData } = supabase.storage
          .from("product-images")
          .getPublicUrl(data.path);
        uploadedPhotos.push(urlData.publicUrl);
      }

      // 2. Upload invoice if any
      let uploadedInvoiceUrl = "";
      if (formData.invoice) {
        const fileName = `services/${Date.now()}-${formData.invoice.name.replace(/\s+/g, "-")}`;
        const { data, error } = await supabase.storage
          .from("product-images")
          .upload(fileName, formData.invoice, { upsert: true });
        if (error) throw error;
        const { data: urlData } = supabase.storage
          .from("product-images")
          .getPublicUrl(data.path);
        uploadedInvoiceUrl = urlData.publicUrl;
      }

      // 3. Save service request
      const payload = {
        customer_name: formData.customerName,
        customer_email: formData.customerEmail,
        customer_phone: formData.customerPhone,
        package_id: selectedPackage.id,
        package_name: selectedPackage.name,
        service_date: selectedDate.toLocaleDateString(),
        service_time_slot: selectedSlot,
        priority_booking: priorityBooking,
        pickup_delivery: pickupDelivery,
        total_price: grandTotal,
        bike_brand: formData.bikeBrand || null,
        bike_model: formData.bikeModel || null,
        problem_description: formData.problemDescription,
        bike_photos: uploadedPhotos,
        invoice_url: uploadedInvoiceUrl || null,
        status: "received",
      };

      const { error } = await supabase.from("service_requests").insert([payload]);
      if (error) throw error;

      toast.success("Service request submitted successfully!");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to submit service request.");
    } finally {
      setSubmittingService(false);
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
      <section className="relative h-[70vh] min-h-[500px] flex items-center overflow-hidden">
        {/* Background image & gradient overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{ backgroundImage: `url(${bikeServicingHero})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/70 to-transparent" />
        
        <div className="relative z-10 container mx-auto px-5 md:px-8 flex flex-col justify-between h-full py-12">
          {/* Main content */}
          <div className="max-w-2xl mt-auto mb-auto">
            <p className="text-sky-400 text-xs font-black uppercase tracking-[0.3em] font-heading mb-3">
              PRO-BIKERS WORKSHOP
            </p>
            <h1 className="font-heading text-hero-xs sm:text-hero-sm md:text-hero font-extrabold text-white mb-6 uppercase leading-none">
              BIKE <span className="text-sky-500">SERVICING</span>
            </h1>
            <p className="text-gray-300 font-body text-sm md:text-base max-w-lg mb-8 leading-relaxed">
              Professional bicycle servicing, from essential safety checks to complete performance restoration.
            </p>
            <div>
              <Button 
                onClick={() => {
                  const el = document.getElementById("packages-section");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
                className="bg-sky-500 hover:bg-sky-600 text-white font-extrabold text-xs tracking-wider uppercase px-6 py-5 rounded-none flex items-center gap-2 cursor-pointer shadow-lg"
              >
                EXPLORE SERVICE PACKAGES
                <span className="text-sm font-black">&nbsp;&gt;</span>
              </Button>
            </div>
          </div>

          {/* Advantages row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-white/10 w-full mt-auto">
            <div className="flex flex-col items-center md:items-start text-center md:text-left gap-2">
              <Wrench className="w-5 h-5 text-sky-400" />
              <span className="text-xs font-black text-white uppercase tracking-wider">Expert Mechanics</span>
            </div>
            <div className="flex flex-col items-center md:items-start text-center md:text-left gap-2">
              <ShieldCheck className="w-5 h-5 text-sky-400" />
              <span className="text-xs font-black text-white uppercase tracking-wider">Genuine Parts</span>
            </div>
            <div className="flex flex-col items-center md:items-start text-center md:text-left gap-2">
              <FileCheck className="w-5 h-5 text-sky-400" />
              <span className="text-xs font-black text-white uppercase tracking-wider">Approval Before Work</span>
            </div>
            <div className="flex flex-col items-center md:items-start text-center md:text-left gap-2">
              <Award className="w-5 h-5 text-sky-400" />
              <span className="text-xs font-black text-white uppercase tracking-wider">Quality Guaranteed</span>
            </div>
          </div>
        </div>
      </section>

      <section id="packages-section" className="container mx-auto px-5 md:px-8 py-16 space-y-16">
        {/* Step 1: Select Package */}
        <div>
          {/* Main header block matching the screenshot */}
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-gray-100 pb-6 mb-8 gap-4">
            <div>
              <p className="text-sky-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">
                CHOOSE THE CARE YOUR BIKE NEEDS
              </p>
              <h2 className="font-heading text-3xl font-extrabold text-[#111111] uppercase tracking-tight">
                Our Service Packages
              </h2>
            </div>
            
            <div className="flex items-center gap-2 text-gray-500 text-xs font-semibold">
              <ShieldCheck className="w-5 h-5 text-sky-500" />
              <span>Same Pro-Bikers workshop standard.</span>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-sky-500 flex items-center justify-center text-white font-bold shadow-sm">
                1
              </div>
              <h3 className="font-heading text-xl font-extrabold text-[#111111]">Select Category</h3>
            </div>

            {/* Bike Category Selector Tabs */}
            <div className="flex bg-[#f1f5f9] p-1.5 rounded-2xl w-fit border border-[#e2e8f0]">
              <button
                type="button"
                onClick={() => handleCategoryChange("hybrid-mtb")}
                className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 cursor-pointer font-heading ${
                  bikeCategory === "hybrid-mtb"
                    ? "bg-[#111111] text-white shadow-md"
                    : "text-[#555555] hover:text-[#111111] hover:bg-gray-100"
                }`}
              >
                Hybrid / MTB Bikes
              </button>
              <button
                type="button"
                onClick={() => handleCategoryChange("road")}
                className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 cursor-pointer font-heading ${
                  bikeCategory === "road"
                    ? "bg-[#111111] text-white shadow-md"
                    : "text-[#555555] hover:text-[#111111] hover:bg-gray-100"
                }`}
              >
                Road Bikes
              </button>
            </div>
          </div>
          
          <ServicePackages
            packages={filteredPackages}
            onSelectPackage={handlePackageSelect}
            selectedPackageId={selectedPackage?.id}
          />
        </div>

        {/* Step 2: Select Date & Time */}
        {selectedPackage && (
          <div>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-10 h-10 rounded-full bg-sky-500 flex items-center justify-center text-white font-bold shadow-sm">
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
              <div className="w-10 h-10 rounded-full bg-sky-500 flex items-center justify-center text-white font-bold shadow-sm">
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
              <ServiceRequestForm onSubmit={handleServiceRequestSubmit} loading={submittingService} />
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


      </section>
    </PageShell>
  );
};

export default BikeServicing;

