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
                        bg-primary text-white border-2 border-primary
                        hover:bg-primary/85
                        transition-all duration-300 cursor-pointer"
                      onClick={() => handleEnquire(option.id)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                      </svg>
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
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
              </svg>
              Discuss Your Event
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EventSupport;

