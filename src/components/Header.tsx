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
import { ChevronRight, Menu, MessageCircle, Phone, Search, ShoppingBag, User as UserIcon, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

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
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.7);
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
    <header className="fixed top-0 left-0 right-0 z-50 px-4 md:px-6 pt-4">
      <div
        className={`container mx-auto rounded-2xl border border-border/30 motion-reduce:transition-none transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] ${scrolled
          ? "scale-95 bg-background/80 backdrop-blur-md shadow-xl"
          : "scale-100 bg-background/40 backdrop-blur-lg shadow-lg"
          }`}
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
                    className={`relative px-4 py-2 text-xs font-heading font-medium uppercase tracking-[0.15em] transition-colors duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] flex items-center gap-1
                      ${isActive ? "text-primary" : activeDropdown === link.label ? "text-[#111111]" : "text-muted-foreground hover:text-[#111111]"}
                    `}
                  >
                    {link.label}
                    <span
                      className={`absolute bottom-0.5 left-1/2 -translate-x-1/2 h-px bg-primary transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]
                        ${isActive ? "w-4 opacity-100" : "w-0 opacity-0"}
                      `}
                    />
                    {!isActive && (
                      <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 h-px bg-foreground/40 w-0 opacity-0 group-hover:w-3 group-hover:opacity-60 transition-all duration-200" />
                    )}
                  </Link>

                  {/* Bikes Mega Dropdown */}
                  {hasDropdown && activeDropdown === link.label && (
                    <AnimatePresence>
                      {link.label === "Bikes" && (
                        <motion.div
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
                          className="absolute top-full left-0 mt-2 z-50 min-w-max"
                          onMouseEnter={keepDropdownOpen}
                          onMouseLeave={closeDropdown}
                        >
                          <div className="container mx-auto px-6">
                            <div className="bg-background/95 backdrop-blur-xl border border-border/40 rounded-xl shadow-2xl p-1 inline-flex min-h-[200px]">
                            {/* Category list */}
                            <div className="w-56 border-r border-border/30 p-3">
                              <p className="text-[10px] font-heading font-semibold uppercase tracking-[0.2em] text-muted-foreground/60 mb-2 px-3">Categories</p>
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
                                        ? "bg-primary/10 text-primary"
                                        : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                                      }
                                    `}
                                  >
                                    {cat.label}
                                    <ChevronRight className="w-3.5 h-3.5 opacity-40" />
                                  </Link>
                                </div>
                              ))}
                            </div>

                            {/* Bikes sub-panel */}
                            <div className="flex-1 p-4">
                              <AnimatePresence mode="wait">
                                {hoveredCategory ? (
                                  <motion.div
                                    key={hoveredCategory}
                                    initial={{ opacity: 0, x: 8 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 8 }}
                                    transition={{ duration: 0.12 }}
                                    onMouseEnter={keepSubOpen}
                                    onMouseLeave={() => closeSub("category")}
                                  >
                                    <p className="text-[10px] font-heading font-semibold uppercase tracking-[0.2em] text-muted-foreground/60 mb-3">
                                      {bikeCategories.find((c) => c.key === hoveredCategory)?.label}
                                    </p>
                                    <div className="flex flex-col gap-2">
                                      {bikes
                                        .filter((b) => b.category === hoveredCategory)
                                        .map((bike) => (
                                          <Link
                                            key={bike.id}
                                            to={`/product/${bike.id}`}
                                            onClick={() => setActiveDropdown(null)}
                                            className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted/40 transition-all duration-150 group/bike"
                                          >
                                            <div className="flex flex-col min-w-0">
                                              <span className="text-xs font-heading font-semibold text-foreground truncate">{bike.name}</span>
                                              <span className="text-[10px] text-muted-foreground font-heading uppercase tracking-wider">{bike.brand}</span>
                                            </div>
                                          </Link>
                                        ))}
                                    </div>
                                  </motion.div>
                                ) : (
                                  <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="h-full flex items-center justify-center"
                                  >
                                    <p className="text-xs text-muted-foreground/50 font-heading uppercase tracking-widest">Hover a category to see bikes</p>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          </div>
                          </div>
                        </motion.div>
                      )}
                      {link.label === "Brands" && (
                        <motion.div
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
                          className="absolute top-full left-0 mt-2 z-50 min-w-max"
                          onMouseEnter={keepDropdownOpen}
                          onMouseLeave={closeDropdown}
                        >
                          <div className="container mx-auto px-6">
                            <div className="bg-background/95 backdrop-blur-xl border border-border/40 rounded-xl shadow-2xl p-1 inline-flex min-h-[200px]">
                            {/* Brand list */}
                            <div className="w-56 border-r border-border/30 p-3">
                              <p className="text-[10px] font-heading font-semibold uppercase tracking-[0.2em] text-muted-foreground/60 mb-2 px-3">Brands</p>
                              {bikeBrands.map((brand) => (
                                <div
                                  key={brand.name}
                                  onMouseEnter={() => openSub(brand.name, "brand")}
                                  onMouseLeave={() => closeSub("brand")}
                                >
                                  <div
                                    className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-heading font-medium uppercase tracking-wider transition-all duration-150 cursor-default
                                      ${hoveredBrand === brand.name
                                        ? "bg-primary/10 text-primary"
                                        : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                                      }
                                    `}
                                  >
                                    {brand.name}
                                    <ChevronRight className="w-3.5 h-3.5 opacity-40" />
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* Brand categories sub-panel */}
                            <div className="flex-1 p-4">
                              <AnimatePresence mode="wait">
                                {hoveredBrand ? (
                                  <motion.div
                                    key={hoveredBrand}
                                    initial={{ opacity: 0, x: 8 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 8 }}
                                    transition={{ duration: 0.12 }}
                                    onMouseEnter={keepSubOpen}
                                    onMouseLeave={() => closeSub("brand")}
                                  >
                                    <p className="text-[10px] font-heading font-semibold uppercase tracking-[0.2em] text-muted-foreground/60 mb-3">{hoveredBrand}</p>
                                    <div className="space-y-1">
                                      {bikeBrands
                                        .find((b) => b.name === hoveredBrand)
                                        ?.categories.map((catKey) => {
                                          const cat = bikeCategories.find((c) => c.key === catKey);
                                          const brandBikes = bikes.filter((b) => b.brand === hoveredBrand && b.category === catKey);
                                          return brandBikes.length > 0 ? (
                                            <div key={catKey} className="mb-4">
                                              <p className="text-[10px] font-heading font-semibold text-muted-foreground/60 mb-2">{cat?.label}</p>
                                              <div className="flex flex-col gap-2">
                                                {brandBikes.map((bike) => (
                                                  <Link
                                                    key={bike.id}
                                                    to={`/product/${bike.id}`}
                                                    onClick={() => setActiveDropdown(null)}
                                                    className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted/40 transition-all duration-150 group/bike"
                                                  >
                                                    <div className="flex flex-col min-w-0">
                                                      <span className="text-xs font-heading font-semibold text-foreground truncate">{bike.name}</span>
                                                      <span className="text-[10px] text-muted-foreground font-heading uppercase tracking-wider">{bike.brand}</span>
                                                    </div>
                                                  </Link>
                                                ))}
                                              </div>
                                            </div>
                                          ) : null;
                                        })}
                                    </div>
                                  </motion.div>
                                ) : (
                                  <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="h-full flex items-center justify-center"
                                  >
                                    <p className="text-xs text-muted-foreground/50 font-heading uppercase tracking-widest">Hover a brand to see bikes</p>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
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
          <div className="flex items-center gap-1">
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Open search"
              title="Search"
              className="p-2 text-muted-foreground hover:text-foreground transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] hidden sm:flex items-center justify-center hover:-translate-y-px hover:rotate-[-3deg] motion-reduce:hover:transform-none"
            >
              <Search className="w-[18px] h-[18px]" />
            </button>
            {/* User Account */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button aria-label="Account menu" title="Account" className="p-2 text-muted-foreground hover:text-foreground transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] relative flex items-center justify-center hover:-translate-y-px hover:rotate-[-3deg] motion-reduce:hover:transform-none">
                    <UserIcon className="w-[18px] h-[18px]" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-background border-border">
                  <DropdownMenuItem onClick={() => navigate("/dashboard")} className="cursor-pointer font-body">
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={async () => { await signOut(); navigate("/"); }} className="cursor-pointer font-body text-destructive focus:text-destructive">
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <button
                onClick={() => navigate("/auth")}
                aria-label="Sign in"
                title="Sign in"
                className="p-2 text-muted-foreground hover:text-foreground transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] relative flex items-center justify-center hover:-translate-y-px hover:rotate-[-3deg] motion-reduce:hover:transform-none"
              >
                <UserIcon className="w-[18px] h-[18px]" />
              </button>
            )}

            <button
              onClick={() => setIsOpen(true)}
              aria-label="Open cart"
              title="Cart"
              className="p-2 text-muted-foreground hover:text-foreground transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] relative flex items-center justify-center hover:-translate-y-px hover:rotate-[3deg] motion-reduce:hover:transform-none"
            >
              <ShoppingBag className="w-[18px] h-[18px]" />
              {totalItems > 0 && (
                <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 bg-primary text-primary-foreground text-[9px] font-bold rounded-full flex items-center justify-center">
                  {totalItems > 9 ? "9+" : totalItems}
                </span>
              )}
            </button>
            <button
              className="lg:hidden p-2 text-foreground z-50 relative flex items-center justify-center"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle navigation menu"
              title={mobileOpen ? "Close menu" : "Open menu"}
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

      {/* Search Dialog */}
      <CommandDialog open={searchOpen} onOpenChange={setSearchOpen}>
        <CommandInput placeholder="Search bikes, brands, categories..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Bikes">
            {bikes.map((bike) => (
              <CommandItem
                key={bike.id}
                onSelect={() => {
                  setSearchOpen(false);
                  navigate(`/shop`);
                }}
                className="flex items-center gap-4 cursor-pointer py-3"
              >
                <div className="w-12 h-12 bg-muted/30 rounded-md flex items-center justify-center flex-shrink-0">
                  <img src={bike.image} alt={bike.name} className="w-10 h-10 object-contain" />
                </div>
                <div className="flex flex-col">
                  <span className="font-heading font-semibold text-foreground text-sm">{bike.name}</span>
                  <span className="text-xs text-muted-foreground uppercase tracking-wider font-heading mt-0.5">{bike.brand} · {bike.category}</span>
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
