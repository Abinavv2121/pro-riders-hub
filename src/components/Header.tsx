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
import { bikes } from "@/data/bikes";
import { accessoryCategories, accessoryBrands, apparelCategories, apparelBrands } from "@/data/accessories";
import { cycleBrands } from "@/data/brands";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, Menu, MessageCircle, Phone, Search, ShoppingCart, User as UserIcon, X, ChevronDown, Tag } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AnnouncementBar from "./AnnouncementBar";
import { supabase, Sale } from "@/lib/supabase";

const navLinks = [
  { label: "Sale", href: "/shop?sale=true" },
  { label: "Bikes", href: "/shop" },
  { label: "Apparels", href: "/apparels" },
  { label: "Accessories", href: "/accessories" },
  { label: "Service", href: "/servicing" },
  { label: "Community", href: "/community" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const bikeDropdownCategories = [
  { label: "Road Bikes", key: "road", href: "/shop/race-road" },
  { label: "Gravel Bikes", key: "gravel", href: "/shop/gravel" },
  { label: "Mountain Bikes", key: "mtb", href: "/shop/mtb" },
  { label: "Hybrid Bikes", key: "hybrid", href: "/shop/city-fitness" },
  { label: "Kids Bikes", key: "kids", href: "/shop/kids" },
  { label: "Pre-owned Bikes", key: "pre-owned", href: "/shop/pre-owned" },
  { label: "Restoration Bikes", key: "restoration", href: "/shop/restoration" },
  { label: "Stock Clearance/Sale", key: "sale", href: "/shop?sale=true" },
];

const getBikesForCategory = (key: string) => {
  if (key === "road") {
    return bikes.filter(b => b.category === "race-road" || b.category === "endurance-road");
  }
  if (key === "gravel") {
    return bikes.filter(b => b.category === "gravel");
  }
  if (key === "mtb") {
    return bikes.filter(b => b.category === "mtb");
  }
  if (key === "hybrid") {
    return bikes.filter(b => b.category === "city-fitness" || b.category === "hybrid");
  }
  if (key === "sale") {
    return bikes.filter(b => b.tag === "Sale" || b.tag === "Stock Clearance/Sale" || (b.originalPrice && b.originalPrice > b.price));
  }
  if (key === "kids") {
    return bikes.filter(b => b.size === "20" || b.size === "24" || b.name.toLowerCase().includes("kids") || b.name.toLowerCase().includes("junior"));
  }
  if (key === "pre-owned") {
    return bikes.filter(b => b.condition === "used" || b.tag === "Pre-Owned");
  }
  if (key === "restoration") {
    return bikes.filter(b => b.tag === "Restoration" || b.condition === "restored");
  }
  return [];
};

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [hoveredBrand, setHoveredBrand] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<Record<string, boolean>>({});
  const [activeSales, setActiveSales] = useState<Sale[]>([]);

  useEffect(() => {
    const fetchSales = async () => {
      const now = new Date().toISOString();
      const { data } = await supabase
        .from("sales")
        .select("*")
        .eq("is_active", true)
        .or(`valid_until.is.null,valid_until.gte.${now}`)
        .order("created_at", { ascending: false });
      if (data) setActiveSales(data);
    };
    fetchSales();
  }, []);
  
  const toggleMobileExpanded = (key: string) => {
    setMobileExpanded(prev => ({ ...prev, [key]: !prev[key] }));
  };
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
                const hasDropdown = link.label === "Bikes" || link.label === "Apparels" || link.label === "Accessories" || link.label === "Sale";
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
                        ${isActive ? "text-primary" : link.label === "Sale" ? "text-red-500 hover:text-red-600" : "text-[#111111] hover:text-primary"}
                      `}
                    >
                      {link.label}
                      {link.label === "Sale" && activeSales.length > 0 && (
                        <span className="ml-1 inline-flex items-center bg-red-500 text-white text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full leading-none">
                          LIVE
                        </span>
                      )}
                      {hasDropdown && link.label !== "Sale" && <ChevronDown className="w-3 h-3 opacity-60" />}
                      {link.label === "Sale" && activeSales.length > 0 && <ChevronDown className="w-3 h-3 opacity-60" />}
                      <span
                        className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-primary transition-all duration-300
                          ${isActive ? "w-6 opacity-100" : "w-0 opacity-0 group-hover:w-4 group-hover:opacity-100"}
                        `}
                      />
                    </Link>

                    {/* Bikes Mega Dropdown */}
                    {hasDropdown && activeDropdown === link.label && link.label === "Bikes" && (
                      <AnimatePresence>
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
                              <p className="text-[10px] font-heading font-semibold uppercase tracking-[0.2em] text-primary mb-2 px-3">Bikes</p>
                              {bikeDropdownCategories.map((cat) => (
                                <div
                                  key={cat.key}
                                  onMouseEnter={() => openSub(cat.key, "category")}
                                  onMouseLeave={() => closeSub("category")}
                                >
                                  <Link
                                    to={cat.href}
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
                                      {bikeDropdownCategories.find((c) => c.key === hoveredCategory)?.label}
                                    </p>
                                    <div className="flex flex-col gap-1">
                                      {getBikesForCategory(hoveredCategory).length > 0 ? (
                                        getBikesForCategory(hoveredCategory)
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
                                          ))
                                      ) : (
                                        <p className="text-[10px] text-[#888888] font-heading uppercase tracking-widest leading-relaxed p-2">Explore our collection online or at the store</p>
                                      )}
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
                      </AnimatePresence>
                    )}

                    {/* Apparels Mega Dropdown */}
                    {hasDropdown && activeDropdown === link.label && link.label === "Apparels" && (
                      <AnimatePresence>
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
                              <p className="text-[10px] font-heading font-semibold uppercase tracking-[0.2em] text-primary mb-2 px-3">Apparels</p>
                              {apparelCategories.map((cat) => (
                                <div
                                  key={cat.name}
                                  onMouseEnter={() => openSub(cat.name, "category")}
                                  onMouseLeave={() => closeSub("category")}
                                >
                                  <Link
                                    to={cat.href}
                                    onClick={() => setActiveDropdown(null)}
                                    className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-heading font-medium uppercase tracking-wider transition-all duration-150
                                      ${hoveredCategory === cat.name
                                        ? "bg-[#EBF4FF] text-primary"
                                        : "text-[#111111] hover:bg-[#F0F6FF]"
                                      }
                                    `}
                                  >
                                    {cat.name}
                                    <ChevronRight className="w-3.5 h-3.5 opacity-80" />
                                  </Link>
                                </div>
                              ))}
                            </div>

                            {/* Brands sub-panel */}
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
                                      Brands for {hoveredCategory}
                                    </p>
                                    <div className="grid grid-cols-2 gap-1">
                                      {(apparelBrands[hoveredCategory as keyof typeof apparelBrands] || []).map((brand) => (
                                        <Link
                                          key={brand}
                                          to={`/apparels?category=${apparelCategories.find(c => c.name === hoveredCategory)?.href.split('category=')[1] || hoveredCategory}&brand=${encodeURIComponent(brand)}`}
                                          onClick={() => setActiveDropdown(null)}
                                          className="p-2 rounded-lg text-[11px] font-heading font-semibold text-[#111111] hover:bg-[#F0F6FF] transition-all duration-150 uppercase tracking-wider"
                                        >
                                          {brand}
                                        </Link>
                                      ))}
                                    </div>
                                  </motion.div>
                                ) : (
                                  <div className="h-full flex items-center justify-center text-center">
                                    <p className="text-[10px] text-[#888888] font-heading uppercase tracking-widest leading-relaxed">Hover an apparel type<br/>to see brands</p>
                                  </div>
                                )}
                              </AnimatePresence>
                            </div>
                          </div>
                        </motion.div>
                      </AnimatePresence>
                    )}

                    {/* Accessories Mega Dropdown */}
                    {hasDropdown && activeDropdown === link.label && link.label === "Accessories" && (
                      <AnimatePresence>
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
                              <p className="text-[10px] font-heading font-semibold uppercase tracking-[0.2em] text-primary mb-2 px-3">Accessories</p>
                              {accessoryCategories.map((cat) => (
                                <div
                                  key={cat.name}
                                  onMouseEnter={() => openSub(cat.name, "category")}
                                  onMouseLeave={() => closeSub("category")}
                                >
                                  <Link
                                    to={cat.href}
                                    onClick={() => setActiveDropdown(null)}
                                    className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-heading font-medium uppercase tracking-wider transition-all duration-150
                                      ${hoveredCategory === cat.name
                                        ? "bg-[#EBF4FF] text-primary"
                                        : "text-[#111111] hover:bg-[#F0F6FF]"
                                      }
                                    `}
                                  >
                                    {cat.name}
                                    <ChevronRight className="w-3.5 h-3.5 opacity-80" />
                                  </Link>
                                </div>
                              ))}
                            </div>

                            {/* Subcategories & Brands sub-panel */}
                            <div className="w-72 p-4">
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
                                    className="space-y-4"
                                  >
                                    {/* Subcategories */}
                                    {accessoryCategories.find(c => c.name === hoveredCategory)?.subcategories && (
                                      <div>
                                        <p className="text-[9px] font-heading font-bold text-primary/60 uppercase tracking-widest mb-1.5">Types</p>
                                        <div className="grid grid-cols-2 gap-1">
                                          {accessoryCategories.find(c => c.name === hoveredCategory)?.subcategories?.map((subcat) => (
                                            <Link
                                              key={subcat.name}
                                              to={subcat.href}
                                              onClick={() => setActiveDropdown(null)}
                                              className="px-2 py-1 text-[11px] font-heading font-semibold text-[#111111] hover:text-primary transition-colors uppercase tracking-wider"
                                            >
                                              {subcat.name}
                                            </Link>
                                          ))}
                                        </div>
                                      </div>
                                    )}

                                    {/* Brands */}
                                    <div>
                                      <p className="text-[9px] font-heading font-bold text-primary/60 uppercase tracking-widest mb-1.5">Brands</p>
                                      <div className="grid grid-cols-2 gap-1">
                                        {(accessoryBrands[hoveredCategory as keyof typeof accessoryBrands] || []).slice(0, 8).map((brand) => (
                                          <Link
                                            key={brand}
                                            to={`/accessories?category=${accessoryCategories.find(c => c.name === hoveredCategory)?.href.split('category=')[1] || hoveredCategory}&brand=${encodeURIComponent(brand)}`}
                                            onClick={() => setActiveDropdown(null)}
                                            className="px-2 py-1.5 rounded-lg text-[10px] font-heading font-semibold text-muted-foreground hover:text-primary hover:bg-[#F0F6FF] transition-all duration-150 uppercase tracking-wider"
                                          >
                                            {brand}
                                          </Link>
                                        ))}
                                      </div>
                                    </div>
                                  </motion.div>
                                ) : (
                                  <div className="h-full flex items-center justify-center text-center">
                                    <p className="text-[10px] text-[#888888] font-heading uppercase tracking-widest leading-relaxed">Hover an accessory<br/>to view details</p>
                                  </div>
                                )}
                              </AnimatePresence>
                            </div>
                          </div>
                        </motion.div>
                      </AnimatePresence>
                    )}

                    {/* Sale Dropdown */}
                    {hasDropdown && activeDropdown === link.label && link.label === "Sale" && activeSales.length > 0 && (
                      <AnimatePresence>
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full left-0 mt-0 z-50 min-w-max pt-2"
                          onMouseEnter={keepDropdownOpen}
                          onMouseLeave={closeDropdown}
                        >
                          <div className="bg-white border border-red-100 rounded-xl shadow-2xl p-4 w-80">
                            <p className="text-[10px] font-heading font-semibold uppercase tracking-[0.2em] text-red-500 mb-3 flex items-center gap-1.5">
                              <Tag className="w-3 h-3" /> Active Sales
                            </p>
                            <div className="flex flex-col gap-3">
                              {activeSales.slice(0, 3).map((sale) => (
                                <Link
                                  key={sale.id}
                                  to="/shop?sale=true"
                                  onClick={() => setActiveDropdown(null)}
                                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-red-50 transition-all duration-150 group"
                                >
                                  {sale.banner_image ? (
                                    <img
                                      src={sale.banner_image}
                                      alt={sale.title}
                                      className="w-16 h-10 object-cover rounded-md border border-gray-100 shrink-0"
                                    />
                                  ) : (
                                    <div className="w-16 h-10 bg-gradient-to-br from-red-400 to-red-600 rounded-md shrink-0 flex items-center justify-center">
                                      <Tag className="w-4 h-4 text-white" />
                                    </div>
                                  )}
                                  <div className="flex-1 min-w-0">
                                    <p className="text-xs font-heading font-bold text-[#111111] truncate">{sale.title}</p>
                                    {sale.discount_percentage && (
                                      <span className="text-[10px] font-heading font-semibold text-red-500 uppercase tracking-wider">
                                        {sale.discount_percentage}% OFF
                                      </span>
                                    )}
                                  </div>
                                </Link>
                              ))}
                            </div>
                            {activeSales.length > 3 && (
                              <p className="text-[10px] text-[#888888] font-heading uppercase tracking-wider mt-2 text-center">
                                +{activeSales.length - 3} more active sale{activeSales.length - 3 > 1 ? "s" : ""}
                              </p>
                            )}
                            <Link
                              to="/shop?sale=true"
                              onClick={() => setActiveDropdown(null)}
                              className="mt-3 w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-heading font-bold uppercase tracking-[0.1em] text-[11px] px-4 py-2.5 rounded-lg transition-colors"
                            >
                              Shop All Sales
                            </Link>
                          </div>
                        </motion.div>
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
              {navLinks.map((link, i) => {
                const hasDropdown = link.label === "Bikes" || link.label === "Apparels" || link.label === "Accessories";
                const isExpanded = !!mobileExpanded[link.label];
                
                return (
                  <div key={link.label} className="border-b border-[#F0F6FF] py-2">
                    {hasDropdown ? (
                      <div>
                        <button
                          onClick={() => toggleMobileExpanded(link.label)}
                          className="w-full flex items-center justify-between py-2 text-lg font-heading font-bold uppercase tracking-widest text-[#111111]"
                        >
                          {link.label}
                          <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} />
                        </button>
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="pl-4 pb-2 flex flex-col gap-2 overflow-hidden"
                            >
                              {link.label === "Bikes" &&
                                bikeDropdownCategories.map((sub) => (
                                  <Link
                                    key={sub.label}
                                    to={sub.href}
                                    onClick={() => setMobileOpen(false)}
                                    className="py-1 text-sm font-heading font-semibold text-muted-foreground hover:text-primary uppercase tracking-wider"
                                  >
                                    {sub.label}
                                  </Link>
                                ))
                              }
                              {link.label === "Apparels" &&
                                apparelCategories.map((sub) => (
                                  <Link
                                    key={sub.name}
                                    to={sub.href}
                                    onClick={() => setMobileOpen(false)}
                                    className="py-1 text-sm font-heading font-semibold text-muted-foreground hover:text-primary uppercase tracking-wider"
                                  >
                                    {sub.name}
                                  </Link>
                                ))
                              }
                              {link.label === "Accessories" &&
                                accessoryCategories.map((sub) => (
                                  <div key={sub.name} className="py-1">
                                    <Link
                                      to={sub.href}
                                      onClick={() => setMobileOpen(false)}
                                      className="text-sm font-heading font-bold text-muted-foreground hover:text-primary uppercase tracking-wider block"
                                    >
                                      {sub.name}
                                    </Link>
                                    {sub.subcategories && (
                                      <div className="pl-3 mt-1 flex flex-col gap-1 border-l border-primary/10">
                                        {sub.subcategories.map((subcat) => (
                                          <Link
                                            key={subcat.name}
                                            to={subcat.href}
                                            onClick={() => setMobileOpen(false)}
                                            className="text-xs font-heading font-semibold text-muted-foreground/80 hover:text-primary uppercase tracking-wider"
                                          >
                                            {subcat.name}
                                          </Link>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                ))
                              }
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <Link
                        to={link.href}
                        onClick={() => setMobileOpen(false)}
                        className="block py-2 text-lg font-heading font-bold uppercase tracking-widest text-[#111111]"
                      >
                        {link.label}
                      </Link>
                    )}
                  </div>
                );
              })}
              
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
