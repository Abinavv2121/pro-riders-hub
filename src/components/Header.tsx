import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Search, ShoppingBag, User, Phone, MessageCircle } from "lucide-react";
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

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const headerBg = scrolled
    ? "bg-hero-bg/95 backdrop-blur-md shadow-lg"
    : isHome
    ? "bg-transparent"
    : "bg-hero-bg";

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${headerBg}`}>
      {/* Top bar — desktop only */}
      <div className="hidden lg:block border-b border-hero-foreground/10">
        <div className="container mx-auto px-6 flex justify-between items-center h-8 text-xs text-hero-foreground/60 font-body">
          <span>Your Friendly Neighbourhood Bike Shop — Since 1975</span>
          <div className="flex items-center gap-4">
            <a href="tel:+919876543210" className="hover:text-hero-foreground transition-colors">Call Us</a>
            <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">WhatsApp</a>
          </div>
        </div>
      </div>

      {/* Main nav bar */}
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16 lg:h-20">
          <Link to="/" className="flex-shrink-0 z-50">
            <img src={logo} alt="Pro-Bikers" className="h-7 sm:h-8 lg:h-10" />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="px-4 py-2 text-sm font-medium text-hero-foreground/80 hover:text-hero-foreground transition-colors uppercase tracking-wider font-heading"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button className="p-2 text-hero-foreground/70 hover:text-hero-foreground transition-colors hidden sm:block">
              <Search className="w-5 h-5" />
            </button>
            <button className="p-2 text-hero-foreground/70 hover:text-hero-foreground transition-colors hidden lg:block">
              <User className="w-5 h-5" />
            </button>
            <button className="p-2 text-hero-foreground/70 hover:text-hero-foreground transition-colors relative">
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center">0</span>
            </button>
            <button
              className="lg:hidden p-2 text-hero-foreground z-50 relative"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              <AnimatePresence mode="wait">
                {mobileOpen ? (
                  <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <X className="w-6 h-6" />
                  </motion.div>
                ) : (
                  <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
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
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 lg:hidden bg-hero-bg flex flex-col"
          >
            {/* Nav links — centered */}
            <nav className="flex-1 flex flex-col items-center justify-center gap-2 px-8">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.3, delay: 0.05 + i * 0.06 }}
                >
                  <Link
                    to={link.href}
                    className="block py-3 text-hero-foreground text-2xl sm:text-3xl font-heading font-bold uppercase tracking-widest text-center hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            {/* Bottom bar with contact shortcuts */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.3 }}
              className="px-8 pb-10 flex items-center justify-center gap-6"
            >
              <a href="tel:+919876543210" className="flex items-center gap-2 text-hero-foreground/50 hover:text-hero-foreground text-sm font-body transition-colors">
                <Phone className="w-4 h-4" /> Call Us
              </a>
              <span className="w-px h-4 bg-hero-foreground/20" />
              <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-hero-foreground/50 hover:text-primary text-sm font-body transition-colors">
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
