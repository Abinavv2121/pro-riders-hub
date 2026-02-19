import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Instagram, Facebook, Youtube } from "lucide-react";
import logo from "@/assets/logo.png";

const Footer = () => {
  return (
    <footer className="section-dark border-t border-hero-foreground/10">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <img src={logo} alt="Pro-Bikers" className="h-8" />
            <p className="text-hero-foreground/60 text-sm font-body leading-relaxed">
              Your Friendly Neighbourhood Bike Shop. Premium cycling experience since 1975.
            </p>
            <div className="flex gap-3 pt-2">
              <a href="#" className="p-2 border border-hero-foreground/20 rounded-sm text-hero-foreground/60 hover:text-primary hover:border-primary transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 border border-hero-foreground/20 rounded-sm text-hero-foreground/60 hover:text-primary hover:border-primary transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 border border-hero-foreground/20 rounded-sm text-hero-foreground/60 hover:text-primary hover:border-primary transition-colors">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-bold text-hero-foreground uppercase tracking-wider text-sm mb-4">Shop</h4>
            <ul className="space-y-2">
              {["Road Bikes", "Mountain Bikes", "Hybrid Bikes", "Pre-Owned", "Accessories", "Components"].map((item) => (
                <li key={item}>
                  <Link to="/shop" className="text-sm text-hero-foreground/60 hover:text-primary transition-colors font-body">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-heading font-bold text-hero-foreground uppercase tracking-wider text-sm mb-4">Services</h4>
            <ul className="space-y-2">
              {["Bike Fitting", "Servicing", "Suspension Tuning", "Custom Builds", "Pickup & Delivery"].map((item) => (
                <li key={item}>
                  <Link to="/services" className="text-sm text-hero-foreground/60 hover:text-primary transition-colors font-body">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading font-bold text-hero-foreground uppercase tracking-wider text-sm mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-hero-foreground/60 font-body">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>Chennai, Tamil Nadu, India</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-hero-foreground/60 font-body">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <a href="tel:+919876543210" className="hover:text-primary transition-colors">+91 98765 43210</a>
              </li>
              <li className="flex items-center gap-2 text-sm text-hero-foreground/60 font-body">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <a href="mailto:info@probikers.in" className="hover:text-primary transition-colors">info@probikers.in</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-hero-foreground/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-hero-foreground/40 font-body">
            © {new Date().getFullYear()} Pro-Bikers. All rights reserved.
          </p>
          <div className="flex gap-6">
            {["Privacy Policy", "Terms of Service", "Shipping", "Refund Policy"].map((item) => (
              <Link key={item} to="#" className="text-xs text-hero-foreground/40 hover:text-hero-foreground/70 transition-colors font-body">
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
