import { MessageCircle } from "lucide-react";

const WhatsAppButton = () => {
  return (
    <a
      href="https://wa.me/919876543210"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-neon-green hover:bg-neon-green/90 text-primary-foreground rounded-full flex items-center justify-center shadow-2xl hover:scale-105 hover:-translate-y-[2px] transition-all duration-200"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="w-6 h-6" />
    </a>
  );
};

export default WhatsAppButton;
