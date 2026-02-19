import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Search, ShoppingBag, User } from "lucide-react";
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

  const headerBg = scrolled
    ? "bg-hero-bg/95 backdrop-blur-md shadow-lg"
    : isHome
    ? "bg-transparent"
    : "bg-hero-bg";

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${headerBg}`}>
      {/* Top bar */}
      <div className="hidden lg:block border-b border-hero-foreground/10">
        <div className="container mx-auto px-6 flex justify-between items-center h-8 text-xs text-hero-foreground/60 font-body">
          <span>Your Friendly Neighbourhood Bike Shop — Since 1975</span>
          <div className="flex items-center gap-4">
            <a href="tel:+919876543210" className="hover:text-hero-foreground transition-colors">
              Call Us
            </a>
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <img src={logo} alt="Pro-Bikers" className="h-8 lg:h-10 brightness-0 invert" />
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
          <div className="flex items-center gap-3">
            <button className="p-2 text-hero-foreground/70 hover:text-hero-foreground transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <button className="p-2 text-hero-foreground/70 hover:text-hero-foreground transition-colors hidden lg:block">
              <User className="w-5 h-5" />
            </button>
            <button className="p-2 text-hero-foreground/70 hover:text-hero-foreground transition-colors relative">
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                0
              </span>
            </button>
            <button
              className="lg:hidden p-2 text-hero-foreground"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-hero-bg border-t border-hero-foreground/10 overflow-hidden"
          >
            <nav className="container mx-auto px-6 py-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  className="block py-3 text-hero-foreground/80 hover:text-hero-foreground text-base font-medium uppercase tracking-wider font-heading border-b border-hero-foreground/5"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
