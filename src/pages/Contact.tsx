import PageShell from "@/components/PageShell";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const Contact = () => (
  <PageShell>
    <section className="container mx-auto px-6 py-16">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-heading font-bold text-foreground text-4xl md:text-6xl mb-4">Contact Us</h1>
        <p className="text-muted-foreground font-body text-lg mb-12 max-w-xl">Visit our store or reach out — we're here to help you find your perfect ride.</p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-16">
        <div className="space-y-8">
          <div className="flex items-start gap-4">
            <MapPin className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-heading font-bold text-foreground mb-1">Visit Us</h3>
              <p className="text-muted-foreground font-body">Pro-Bikers Store, Chennai, Tamil Nadu, India</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <Phone className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-heading font-bold text-foreground mb-1">Call Us</h3>
              <p className="text-muted-foreground font-body">+91 98765 43210</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <Mail className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-heading font-bold text-foreground mb-1">Email</h3>
              <p className="text-muted-foreground font-body">info@probikers.in</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <Clock className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-heading font-bold text-foreground mb-1">Store Hours</h3>
              <p className="text-muted-foreground font-body">Mon - Sat: 9:00 AM – 8:00 PM</p>
              <p className="text-muted-foreground font-body">Sun: 10:00 AM – 6:00 PM</p>
            </div>
          </div>
        </div>

        <form className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input type="text" placeholder="Your Name" className="w-full px-4 py-3 border border-border rounded-sm bg-background text-foreground font-body focus:outline-none focus:border-primary transition-colors" />
            <input type="email" placeholder="Email Address" className="w-full px-4 py-3 border border-border rounded-sm bg-background text-foreground font-body focus:outline-none focus:border-primary transition-colors" />
          </div>
          <input type="text" placeholder="Subject" className="w-full px-4 py-3 border border-border rounded-sm bg-background text-foreground font-body focus:outline-none focus:border-primary transition-colors" />
          <textarea placeholder="Your Message" rows={5} className="w-full px-4 py-3 border border-border rounded-sm bg-background text-foreground font-body focus:outline-none focus:border-primary transition-colors resize-none" />
          <Button variant="hero" size="lg" className="px-12">Send Message</Button>
        </form>
      </div>
    </section>
  </PageShell>
);

export default Contact;
