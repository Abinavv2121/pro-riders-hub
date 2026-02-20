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

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 md:px-6 pt-4">
      <div
        className={`container mx-auto rounded-2xl transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
          bg-background/40 backdrop-blur-xl border border-border/30
          shadow-[0_2px_20px_-4px_rgba(0,0,0,0.4)]
          ${scrolled ? "bg-background/60 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.5)]" : ""}
        `}
      >
        <div className="flex items-center justify-between h-14 lg:h-16 px-5 lg:px-6">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 z-50">
            <img src={logo} alt="Pro-Bikers" className="h-7 lg:h-8" />
          </Link>

          {/* Center nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.label}
                  to={link.href}
                  className={`relative px-4 py-2 text-xs font-heading font-medium uppercase tracking-[0.15em] transition-colors duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]
                    ${isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"}
                  `}
                >
                  {link.label}
                  {/* Active / hover indicator */}
                  <span
                    className={`absolute bottom-0.5 left-1/2 -translate-x-1/2 h-px bg-primary transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]
                      ${isActive ? "w-4 opacity-100" : "w-0 opacity-0 group-hover:w-3 group-hover:opacity-60"}
                    `}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Right icons */}
          <div className="flex items-center gap-1">
            <button className="p-2 text-muted-foreground hover:text-foreground hover:-translate-y-px transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] hidden sm:flex items-center justify-center motion-reduce:hover:transform-none">
              <Search className="w-[18px] h-[18px]" />
            </button>
            <button className="p-2 text-muted-foreground hover:text-foreground hover:-translate-y-px transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] relative flex items-center justify-center motion-reduce:hover:transform-none">
              <ShoppingBag className="w-[18px] h-[18px]" />
              <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 bg-primary text-primary-foreground text-[9px] font-bold rounded-full flex items-center justify-center">0</span>
            </button>
            <button
              className="lg:hidden p-2 text-foreground z-50 relative flex items-center justify-center"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              <AnimatePresence mode="wait">
                {mobileOpen ? (
                  <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                    <X className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                    <Menu className="w-5 h-5" />
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
            className="fixed inset-0 z-40 lg:hidden bg-background/95 backdrop-blur-2xl flex flex-col"
          >
            <nav className="flex-1 flex flex-col items-center justify-center gap-1 px-8">
              {navLinks.map((link, i) => {
                const isActive = location.pathname === link.href;
                return (
                  <motion.div
                    key={link.label}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.25, delay: 0.04 + i * 0.05 }}
                  >
                    <Link
                      to={link.href}
                      className={`block py-3 text-2xl sm:text-3xl font-heading font-bold uppercase tracking-widest text-center transition-colors duration-200
                        ${isActive ? "text-primary" : "text-foreground hover:text-primary"}
                      `}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                );
              })}
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
