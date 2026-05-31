import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import HomeHero from "@/components/home/HomeHero";
import TrustBar from "@/components/home/TrustBar";
import SummerSaleBanner from "@/components/home/SummerSaleBanner";
import HotDealsGrid from "@/components/home/HotDealsGrid";
import ShopByCategory from "@/components/home/ShopByCategory";
import FeaturedBrands from "@/components/home/FeaturedBrands";
import NewArrivalsGrid from "@/components/home/NewArrivalsGrid";
import PromoBanners from "@/components/home/PromoBanners";
import WhyChoose from "@/components/home/WhyChoose";
import CustomerTestimonials from "@/components/home/CustomerTestimonials";
import { motion } from "framer-motion";

const Index = () => {
  const revealProps = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.5, ease: "easeOut" as const }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        {/* 1. Announcement Bar is inside Header */}
        
        {/* 2. Hero Section */}
        <HomeHero />
        
        {/* 3. Hot Deals Grid */}
        <motion.div {...revealProps}>
          <HotDealsGrid />
        </motion.div>
        
        {/* 4. Summer Sale Banner */}
        <motion.div {...revealProps}>
          <SummerSaleBanner />
        </motion.div>

        {/* 5. Trust Bar */}
        <motion.div {...revealProps}>
          <TrustBar />
        </motion.div>
        
        {/* 6. Shop by Category */}
        <motion.div {...revealProps}>
          <ShopByCategory />
        </motion.div>
        
        {/* 7. Featured Brands */}
        <motion.div {...revealProps}>
          <FeaturedBrands />
        </motion.div>
        
        {/* 8. New Arrivals Grid */}
        <motion.div {...revealProps}>
          <NewArrivalsGrid />
        </motion.div>
        
        {/* 9. Promo Banners */}
        <motion.div {...revealProps}>
          <PromoBanners />
        </motion.div>
        
        {/* 10. Why Choose Pro-Bikers */}
        <motion.div {...revealProps}>
          <WhyChoose />
        </motion.div>
        
        {/* 11. Customer Testimonials */}
        <motion.div {...revealProps}>
          <CustomerTestimonials />
        </motion.div>
        
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Index;
