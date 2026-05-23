import logo from "@/assets/logo.png";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { bikeBrands, bikeCategories, bikes } from "@/data/bikes";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, Menu, MessageCircle, Phone, Search, ShoppingCart, User as UserIcon, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AnnouncementBar from "./AnnouncementBar";

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
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [hoveredBrand, setHoveredBrand] = useState<string | null>(null);
  const dropdownTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const subTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { totalItems, setIsOpen } = useCart();
  const { user, signOut } = useAuth();

  const openDropdown = useCallback((key: string) => {
    if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
    setActiveDropdown(key);
    setHoveredCategory(null);
    setHoveredBrand(null);
  }, []);

  const closeDropdown = useCallback(() => {
    dropdownTimeout.current = setTimeout(() => {
      setActiveDropdown(null);
      setHoveredCategory(null);
      setHoveredBrand(null);
    }, 150);
  }, []);

  const keepDropdownOpen = useCallback(() => {
    if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
  }, []);

  const openSub = useCallback((key: string, type: "category" | "brand") => {
    if (subTimeout.current) clearTimeout(subTimeout.current);
    if (type === "category") setHoveredCategory(key);
    else setHoveredBrand(key);
  }, []);

  const closeSub = useCallback((type: "category" | "brand") => {
    subTimeout.current = setTimeout(() => {
      if (type === "category") setHoveredCategory(null);
      else setHoveredBrand(null);
    }, 100);
  }, []);

  const keepSubOpen = useCallback(() => {
    if (subTimeout.current) clearTimeout(subTimeout.current);
    if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
  }, []);


  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setActiveDropdown(null);
  }, [location]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <AnnouncementBar />
      <div
        className={`w-full border-b border-black/5 transition-all duration-300 h-[var(--navbar-height)] lg:h-[var(--navbar-height-lg)] ${
          scrolled ? "bg-white/95 backdrop-blur-md shadow-sm" : "bg-white"
        }`}
      >
        <div className="container mx-auto px-4 md:px-6 h-full flex items-center">
          <div className="flex items-center justify-between w-full h-full">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0 z-50">
              <img src={logo} alt="Pro-Bikers" className="h-8 lg:h-10" />
            </Link>

            {/* Center nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.href;
                const hasDropdown = link.label === "Bikes" || link.label === "Brands";
                return (
                  <div
                    key={link.label}
                    className="relative"
                    onMouseEnter={hasDropdown ? () => openDropdown(link.label) : undefined}
                    onMouseLeave={hasDropdown ? closeDropdown : undefined}
                  >
                    <Link
                      to={link.href}
                      className={`relative px-4 py-2 text-[13px] font-heading font-bold uppercase tracking-[0.1em] transition-colors duration-300 ease-out flex items-center gap-1
                        ${isActive ? "text-primary" : "text-[#111111] hover:text-primary"}
                      `}
                    >
                      {link.label}
                      <span
                        className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-primary transition-all duration-300
                          ${isActive ? "w-6 opacity-100" : "w-0 opacity-0 group-hover:w-4 group-hover:opacity-100"}
                        `}
                      />
                    </Link>

                    {/* Bikes Mega Dropdown */}
                    {hasDropdown && activeDropdown === link.label && (
                      <AnimatePresence>
                        {link.label === "Bikes" && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-full left-0 mt-0 z-50 min-w-max pt-2"
                            onMouseEnter={keepDropdownOpen}
                            onMouseLeave={closeDropdown}
                          >
                            <div className="bg-white border border-[#CCE0F5] rounded-xl shadow-2xl p-1 inline-flex min-h-[200px]">
                              {/* Category list */}
                              <div className="w-56 border-r border-[#CCE0F5] p-3">
                                <p className="text-[10px] font-heading font-semibold uppercase tracking-[0.2em] text-primary mb-2 px-3">Categories</p>
                                {bikeCategories.map((cat) => (
                                  <div
                                    key={cat.key}
                                    onMouseEnter={() => openSub(cat.key, "category")}
                                    onMouseLeave={() => closeSub("category")}
                                  >
                                    <Link
                                      to={`/shop/${cat.key}`}
                                      onClick={() => setActiveDropdown(null)}
                                      className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-heading font-medium uppercase tracking-wider transition-all duration-150
                                        ${hoveredCategory === cat.key
                                          ? "bg-[#EBF4FF] text-primary"
                                          : "text-[#111111] hover:bg-[#F0F6FF]"
                                        }
                                      `}
                                    >
                                      {cat.label}
                                      <ChevronRight className="w-3.5 h-3.5 opacity-80" />
                                    </Link>
                                  </div>
                                ))}
                              </div>

                              {/* Bikes sub-panel */}
                              <div className="w-64 p-4">
                                <AnimatePresence mode="wait">
                                  {hoveredCategory ? (
                                    <motion.div
                                      key={hoveredCategory}
                                      initial={{ opacity: 0, x: 5 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      exit={{ opacity: 0, x: 5 }}
                                      transition={{ duration: 0.15 }}
                                      onMouseEnter={keepSubOpen}
                                      onMouseLeave={() => closeSub("category")}
                                    >
                                      <p className="text-[10px] font-heading font-semibold uppercase tracking-[0.2em] text-primary mb-3">
                                        {bikeCategories.find((c) => c.key === hoveredCategory)?.label}
                                      </p>
                                      <div className="flex flex-col gap-1">
                                        {bikes
                                          .filter((b) => b.category === hoveredCategory)
                                          .slice(0, 6)
                                          .map((bike) => (
                                            <Link
                                              key={bike.id}
                                              to={`/product/${bike.id}`}
                                              onClick={() => setActiveDropdown(null)}
                                              className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#F0F6FF] transition-all duration-150 group/bike"
                                            >
                                              <div className="flex flex-col min-w-0">
                                                <span className="text-xs font-heading font-semibold text-[#111111] truncate">{bike.name}</span>
                                                <span className="text-[10px] text-[#888888] font-heading uppercase tracking-wider">{bike.brand}</span>
                                              </div>
                                            </Link>
                                          ))}
                                      </div>
                                    </motion.div>
                                  ) : (
                                    <div className="h-full flex items-center justify-center text-center">
                                      <p className="text-[10px] text-[#888888] font-heading uppercase tracking-widest leading-relaxed">Hover a category<br/>to see bikes</p>
                                    </div>
                                  )}
                                </AnimatePresence>
                              </div>
                            </div>
                          </motion.div>
                        )}
                        {link.label === "Brands" && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-full left-0 mt-0 z-50 min-w-max pt-2"
                            onMouseEnter={keepDropdownOpen}
                            onMouseLeave={closeDropdown}
                          >
                            <div className="bg-white border border-[#CCE0F5] rounded-xl shadow-2xl p-1 inline-flex min-h-[200px]">
                              {/* Brand list */}
                              <div className="w-56 border-r border-[#CCE0F5] p-3">
                                <p className="text-[10px] font-heading font-semibold uppercase tracking-[0.2em] text-primary mb-2 px-3">Brands</p>
                                {bikeBrands.map((brand) => (
                                  <div
                                    key={brand.name}
                                    onMouseEnter={() => openSub(brand.name, "brand")}
                                    onMouseLeave={() => closeSub("brand")}
                                  >
                                    <div
                                      className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-heading font-medium uppercase tracking-wider transition-all duration-150 cursor-default
                                        ${hoveredBrand === brand.name
                                          ? "bg-[#EBF4FF] text-primary"
                                          : "text-[#111111] hover:bg-[#F0F6FF]"
                                        }
                                      `}
                                    >
                                      {brand.name}
                                      <ChevronRight className="w-3.5 h-3.5 opacity-80" />
                                    </div>
                                  </div>
                                ))}
                              </div>

                              {/* Brand categories sub-panel */}
                              <div className="w-64 p-4">
                                <AnimatePresence mode="wait">
                                  {hoveredBrand ? (
                                    <motion.div
                                      key={hoveredBrand}
                                      initial={{ opacity: 0, x: 5 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      exit={{ opacity: 0, x: 5 }}
                                      transition={{ duration: 0.15 }}
                                      onMouseEnter={keepSubOpen}
                                      onMouseLeave={() => closeSub("brand")}
                                    >
                                      <p className="text-[10px] font-heading font-semibold uppercase tracking-[0.2em] text-primary mb-3">{hoveredBrand}</p>
                                      <div className="space-y-4">
                                        {bikeBrands
                                          .find((b) => b.name === hoveredBrand)
                                          ?.categories.map((catKey) => {
                                            const cat = bikeCategories.find((c) => c.key === catKey);
                                            const brandBikes = bikes.filter((b) => b.brand === hoveredBrand && b.category === catKey);
                                            return brandBikes.length > 0 ? (
                                              <div key={catKey}>
                                                <p className="text-[9px] font-heading font-bold text-primary/60 uppercase tracking-widest mb-1.5">{cat?.label}</p>
                                                <div className="flex flex-col gap-1">
                                                  {brandBikes.slice(0, 3).map((bike) => (
                                                    <Link
                                                      key={bike.id}
                                                      to={`/product/${bike.id}`}
                                                      onClick={() => setActiveDropdown(null)}
                                                      className="flex items-center gap-3 p-1.5 rounded-lg hover:bg-[#F0F6FF] transition-all duration-150"
                                                    >
                                                      <span className="text-[11px] font-heading font-semibold text-[#111111] truncate">{bike.name}</span>
                                                    </Link>
                                                  ))}
                                                </div>
                                              </div>
                                            ) : null;
                                          })}
                                      </div>
                                    </motion.div>
                                  ) : (
                                    <div className="h-full flex items-center justify-center text-center">
                                      <p className="text-[10px] text-[#888888] font-heading uppercase tracking-widest leading-relaxed">Hover a brand<br/>to see bikes</p>
                                    </div>
                                  )}
                                </AnimatePresence>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    )}
                  </div>
                );
              })}
            </nav>

            {/* Right icons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 text-[#111111] hover:text-primary transition-colors duration-200"
              >
                <Search className="w-5 h-5" />
              </button>
              
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-2 text-[#111111] hover:text-primary transition-colors duration-200">
                      <UserIcon className="w-5 h-5" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 bg-white border border-[#CCE0F5] shadow-xl">
                    <DropdownMenuItem onClick={() => navigate("/dashboard")} className="cursor-pointer font-heading font-semibold text-xs uppercase tracking-wider p-3 focus:bg-[#F0F6FF]">
                      Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={async () => { await signOut(); navigate("/"); }} className="cursor-pointer font-heading font-semibold text-xs uppercase tracking-wider p-3 text-destructive focus:text-destructive focus:bg-destructive/5">
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <button
                  onClick={() => navigate("/auth")}
                  className="p-2 text-[#111111] hover:text-primary transition-colors duration-200"
                >
                  <UserIcon className="w-5 h-5" />
                </button>
              )}

              <button
                onClick={() => setIsOpen(true)}
                className="p-2 text-[#111111] hover:text-primary transition-colors duration-200 relative"
              >
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-primary text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-sm">
                    {totalItems}
                  </span>
                )}
              </button>
              
              <button
                className="lg:hidden p-2 text-[#111111]"
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[60] bg-white flex flex-col"
          >
            <div className="flex items-center justify-between h-16 px-4 border-b border-border">
              <img src={logo} alt="Pro-Bikers" className="h-8" />
              <button onClick={() => setMobileOpen(false)}>
                <X className="w-6 h-6 text-[#111111]" />
              </button>
            </div>
            
            <nav className="flex-1 flex flex-col py-8 px-6 overflow-y-auto">
              {navLinks.map((link, i) => (
                <Link
                  key={link.label}
                  to={link.href}
                  className="py-4 text-xl font-heading font-bold uppercase tracking-widest text-[#111111] border-b border-[#F0F6FF]"
                >
                  {link.label}
                </Link>
              ))}
              
              <div className="mt-auto pt-10 grid grid-cols-2 gap-4">
                <a href="tel:+919876543210" className="flex flex-col items-center justify-center p-4 bg-[#F0F6FF] rounded-xl text-center">
                  <Phone className="w-5 h-5 mb-2 text-primary" />
                  <span className="text-[10px] font-heading font-bold uppercase tracking-wider text-[#111111]">Call Us</span>
                </a>
                <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center p-4 bg-[#EBF4FF] rounded-xl text-center">
                  <MessageCircle className="w-5 h-5 mb-2 text-primary" />
                  <span className="text-[10px] font-heading font-bold uppercase tracking-wider text-[#111111]">WhatsApp</span>
                </a>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <CommandDialog open={searchOpen} onOpenChange={setSearchOpen}>
        <CommandInput placeholder="Search bikes, brands, categories..." />
        <CommandList className="max-h-[70vh]">
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Bikes">
            {bikes.map((bike) => (
              <CommandItem
                key={bike.id}
                onSelect={() => {
                  setSearchOpen(false);
                  navigate(`/product/${bike.id}`);
                }}
                className="flex items-center gap-4 cursor-pointer py-3"
              >
                <div className="w-12 h-12 bg-[#F0F6FF] rounded-lg flex items-center justify-center flex-shrink-0">
                  <img src={bike.image} alt={bike.name} className="w-10 h-10 object-contain" />
                </div>
                <div className="flex flex-col">
                  <span className="font-heading font-bold text-[#111111] text-sm">{bike.name}</span>
                  <span className="text-[10px] text-[#888888] uppercase tracking-wider font-heading mt-0.5">{bike.brand} · {bike.category}</span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </header>
  );
};

export default Header;
