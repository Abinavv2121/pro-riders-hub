import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Bike, MessageCircle, Store, Users, Wrench } from "lucide-react";

interface SupportOption {
  id: string;
  icon: React.ElementType;
  title: string;
  description: string;
  features: string[];
  cta: string;
}

const supportOptions: SupportOption[] = [
  {
    id: "technicians",
    icon: Wrench,
    title: "Technical Support",
    description: "Professional mechanics to ensure your event runs smoothly with no mechanical issues.",
    features: [
      "On-site mechanics throughout the event",
      "Basic repairs and adjustments",
      "Emergency breakdown assistance",
      "Pre-event bike checks",
    ],
    cta: "Enquire Now",
  },
  {
    id: "rentals",
    icon: Bike,
    title: "Rental Bikes for Events",
    description: "Provide rental bikes for participants who don't have their own or need a backup.",
    features: [
      "Wide range of bike categories",
      "Flexible rental durations",
      "Delivery to event venue",
      "Quantity discounts for large events",
    ],
    cta: "Enquire Now",
  },
  {
    id: "stalls",
    icon: Store,
    title: "Event Stalls",
    description: "Set up promotional stalls to showcase products, engage with participants, and boost brand visibility.",
    features: [
      "Branded stall setup",
      "Product display units",
      "Marketing material distribution",
      "Direct sales opportunity",
    ],
    cta: "Enquire Now",
  },
];

const EventSupport = () => {
  const handleEnquire = (optionId: string) => {
    const option = supportOptions.find((opt) => opt.id === optionId);
    if (!option) return;

    const message = `
🏆 *Event Support Inquiry*

*Service Type:* ${option.title}

*Description:* ${option.description}

_Requested from Pro Riders Hub Website_
    `.trim();

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/919876543210?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="space-y-16 pb-24">
      {/* Section Header - Bold like other pages */}
      <div className="container mx-auto px-5 md:px-8">
        <div className="text-center">
          <h2 className="font-heading font-bold text-hero-sm md:text-section text-foreground mb-3">
            Supporting Events
          </h2>
          <p className="text-[#000000] max-w-2xl mx-auto">
            We provide comprehensive support for cycling events, races, and community rides. 
            Make your event a success with our professional support services.
          </p>
        </div>
      </div>

      {/* Support Options Grid */}
      <div className="container mx-auto px-5 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {supportOptions.map((option, index) => (
            <motion.div
              key={option.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow duration-300 border-t-4 border-t-[#0ea5e9] bg-white text-black border-2 border-[#0ea5e9] shadow-sm">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-[#f0f9ff] rounded-lg">
                      <option.icon className="w-6 h-6 text-[#0ea5e9]" />
                    </div>
                    <CardTitle className="text-xl font-heading text-black">{option.title}</CardTitle>
                  </div>
                  <p className="text-black/70 text-sm">{option.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {option.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-black">
                        <Users className="w-4 h-4 text-[#0ea5e9] mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6">
                    <button
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium
                        bg-white text-black border-2 border-[#0ea5e9]
                        hover:bg-[#0ea5e9] hover:text-white
                        transition-all duration-300 cursor-pointer"
                      onClick={() => handleEnquire(option.id)}
                    >
                      <MessageCircle className="w-4 h-4" />
                      {option.cta}
                    </button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Additional Info */}
      <div className="container mx-auto px-5 md:px-8">
        <div className="bg-primary rounded-xl p-8 text-center shadow-sm">
          <h3 className="font-heading text-h3 mb-3 text-white">Need a Custom Package?</h3>
          <p className="text-white/90 mb-6 max-w-xl mx-auto">
            We understand that every event is unique. Contact us to discuss your specific 
            requirements and we'll create a tailored support package for you.
          </p>
          <Button variant="outline" size="lg" className="border-none shadow-sm" asChild>
            <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer">
              <MessageCircle className="w-5 h-5 mr-2" />
              Discuss Your Event
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EventSupport;

