import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Search, ShoppingBag, Phone, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/assets/logo.png";

const navLinks = [
  { label: "Bikes", href: "/shop" },
  { label: "Brands", href: "/brands" },
  { label: "Services", href: "/services" },
  { label: "Community", href: "/community" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const headerBg = scrolled
    ? "bg-background/95 backdrop-blur-md border-b border-border"
    : isHome
    ? "bg-transparent"
    : "bg-background";

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${headerBg}`}>
      {/* Top bar */}
      <div className="hidden lg:block border-b border-border/50">
        <div className="container mx-auto px-8 flex justify-between items-center h-8 text-xs text-muted-foreground font-micro">
          <span>Your Friendly Neighbourhood Bike Shop — Since 1975</span>
          <div className="flex items-center gap-4">
            <a href="tel:+919876543210" className="hover:text-foreground transition-colors duration-200">Call Us</a>
            <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors duration-200">WhatsApp</a>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div className="container mx-auto px-5 md:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link to="/" className="flex-shrink-0 z-50">
            <img src={logo} alt="Pro-Bikers" className="h-8 lg:h-10" />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="px-4 py-2 text-small font-heading font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 uppercase tracking-wider"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right */}
          <div className="flex items-center gap-2">
            <button className="p-2.5 text-muted-foreground hover:text-foreground transition-colors duration-200 hidden sm:block">
              <Search className="w-5 h-5" />
            </button>
            <button className="p-2.5 text-muted-foreground hover:text-foreground transition-colors duration-200 relative">
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center">0</span>
            </button>
            <button
              className="lg:hidden p-2.5 text-foreground z-50 relative"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              <AnimatePresence mode="wait">
                {mobileOpen ? (
                  <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                    <X className="w-6 h-6" />
                  </motion.div>
                ) : (
                  <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                    <Menu className="w-6 h-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </div>

      {/* Fullscreen mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 lg:hidden bg-background flex flex-col"
          >
            <nav className="flex-1 flex flex-col items-center justify-center gap-1 px-8">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.25, delay: 0.04 + i * 0.05 }}
                >
                  <Link
                    to={link.href}
                    className="block py-3 text-foreground text-2xl sm:text-3xl font-heading font-bold uppercase tracking-widest text-center hover:text-primary transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.25 }}
              className="px-8 pb-10 flex items-center justify-center gap-6"
            >
              <a href="tel:+919876543210" className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-small font-micro transition-colors duration-200">
                <Phone className="w-4 h-4" /> Call Us
              </a>
              <span className="w-px h-4 bg-border" />
              <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-muted-foreground hover:text-primary text-small font-micro transition-colors duration-200">
                <MessageCircle className="w-4 h-4" /> WhatsApp
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
