import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CustomCursor from "@/components/CustomCursor";
import { CartProvider } from "@/contexts/CartContext";
import CartDrawer from "@/components/CartDrawer";
import Index from "./pages/Index";
import Shop from "./pages/Shop";
import Brands from "./pages/Brands";
import Services from "./pages/Services";
import Community from "./pages/Community";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <CartProvider>
          <CustomCursor />
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <CartDrawer />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/shop/:category" element={<Shop />} />
              <Route path="/brands" element={<Brands />} />
              <Route path="/services" element={<Services />} />
              <Route path="/community" element={<Community />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/pre-owned" element={<Shop />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
