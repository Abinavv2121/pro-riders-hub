import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Instagram, Facebook, Youtube } from "lucide-react";
import { motion } from "framer-motion";
import logo from "@/assets/logo.png";

const socialIcons = [
  { Icon: Instagram, label: "Instagram" },
  { Icon: Facebook, label: "Facebook" },
  { Icon: Youtube, label: "YouTube" },
];

const Footer = () => {
  return (
    <footer className="border-t border-border bg-background">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        className="container mx-auto px-5 md:px-8 py-16"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <img src={logo} alt="Pro-Bikers" className="h-8" loading="lazy" />
            <p className="text-muted-foreground text-small font-body leading-relaxed">
              Your Friendly Neighbourhood Bike Shop. Premium cycling experience since 1975.
            </p>
            <div className="flex gap-3 pt-2">
              {socialIcons.map(({ Icon, label }) => (
                <motion.a
                  key={label}
                  href="#"
                  aria-label={label}
                  whileHover={{ y: -2, rotate: -3 }}
                  transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                  className="p-2 border border-border rounded-lg text-muted-foreground hover:text-primary hover:border-primary/30 transition-colors duration-[240ms]"
                >
                  <Icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-bold text-foreground uppercase tracking-wider text-sm mb-4">Shop</h4>
            <ul className="space-y-2">
              {["Road Bikes", "Mountain Bikes", "Hybrid Bikes", "Pre-Owned", "Accessories", "Components"].map((item) => (
                <li key={item}>
                  <Link to="/shop" className="text-small text-muted-foreground hover:text-primary transition-colors duration-200 font-body inline-block relative group">
                    {item}
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-px bg-primary w-0 group-hover:w-full transition-all duration-200" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-heading font-bold text-foreground uppercase tracking-wider text-sm mb-4">Services</h4>
            <ul className="space-y-2">
              {["Bike Fitting", "Servicing", "Suspension Tuning", "Custom Builds", "Pickup & Delivery"].map((item) => (
                <li key={item}>
                  <Link to="/services" className="text-small text-muted-foreground hover:text-primary transition-colors duration-200 font-body inline-block relative group">
                    {item}
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-px bg-primary w-0 group-hover:w-full transition-all duration-200" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading font-bold text-foreground uppercase tracking-wider text-sm mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-small text-muted-foreground font-body">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>Chennai, Tamil Nadu, India</span>
              </li>
              <li className="flex items-center gap-2 text-small text-muted-foreground font-body">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <a href="tel:+919876543210" className="hover:text-primary transition-colors duration-200">+91 98765 43210</a>
              </li>
              <li className="flex items-center gap-2 text-small text-muted-foreground font-body">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <a href="mailto:info@probikers.in" className="hover:text-primary transition-colors duration-200">info@probikers.in</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground font-micro">
            © {new Date().getFullYear()} Pro-Bikers. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link to="/admin" className="text-xs text-muted-foreground hover:text-foreground transition-colors duration-200 font-micro relative group inline-block">
              Admin Portal
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-px bg-foreground/40 w-0 group-hover:w-full transition-all duration-200" />
            </Link>
            {["Privacy Policy", "Terms of Service", "Shipping", "Refund Policy"].map((item) => (
              <Link key={item} to="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors duration-200 font-micro relative group inline-block">
                {item}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-px bg-foreground/40 w-0 group-hover:w-full transition-all duration-200" />
              </Link>
            ))}
          </div>
        </div>
      </motion.div>
    </footer>
  );
};

export default Footer;
