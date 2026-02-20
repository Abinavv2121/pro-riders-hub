import probikersIcon from "@/assets/probikers-icon.png";

const WhatsAppButton = () => {
  return (
    <a
      href="https://wa.me/919876543210"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-primary hover:bg-primary/90 rounded-full flex items-center justify-center shadow-2xl hover:scale-105 hover:-translate-y-[2px] transition-all duration-200 overflow-hidden"
      aria-label="Chat on WhatsApp"
    >
      <img src={probikersIcon} alt="Pro-Bikers" className="w-10 h-10 invert object-contain" />
    </a>
  );
};

export default WhatsAppButton;
