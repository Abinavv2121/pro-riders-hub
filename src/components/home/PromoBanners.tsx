import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const PromoBanners = () => {
  return (
    <section className="bg-white py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Banner 1 */}
          <div className="bg-[#EBF4FF] rounded-2xl p-10 md:p-14 flex flex-col items-start border border-[#CCE0F5] group overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full group-hover:scale-150 transition-transform duration-700" />
            <span className="text-primary text-[12px] font-heading font-bold uppercase tracking-[0.2em] mb-4">
              Professional Fitting
            </span>
            <h2 className="text-3xl md:text-4xl font-heading font-black text-[#111111] leading-tight mb-8">
              Get Fitted.<br/>Ride Faster.
            </h2>
            <Link 
              to="/services" 
              className="px-8 py-3.5 border-2 border-primary text-primary font-heading font-bold uppercase tracking-wider text-xs rounded-full hover:bg-primary hover:text-white transition-all duration-300 flex items-center gap-2"
            >
              Book a Session <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Banner 2 */}
          <div className="bg-white rounded-2xl p-10 md:p-14 flex flex-col items-start border-2 border-primary group overflow-hidden relative">
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-primary/5 rounded-tl-full group-hover:scale-150 transition-transform duration-700" />
            <span className="text-primary text-[12px] font-heading font-bold uppercase tracking-[0.2em] mb-4">
              No-Cost EMI
            </span>
            <h2 className="text-3xl md:text-4xl font-heading font-black text-[#111111] leading-tight mb-8">
              Own Your Dream<br/>Bike Today.
            </h2>
            <Link 
              to="/shop" 
              className="px-8 py-3.5 border-2 border-primary text-primary font-heading font-bold uppercase tracking-wider text-xs rounded-full hover:bg-primary hover:text-white transition-all duration-300 flex items-center gap-2"
            >
              Check EMI Options <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoBanners;
