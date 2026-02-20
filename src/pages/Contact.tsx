import React, { useState } from "react";
import PageShell from "@/components/PageShell";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase, Enquiry } from "@/lib/supabase";
import { sendCustomerAutoReply } from "@/lib/emailjs";

const Contact = () => {
  const [formData, setFormData] = useState<Enquiry>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill all required fields (Name, Email, Message).");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Save to Supabase
      const { error: supabaseError } = await supabase
        .from('enquiries')
        .insert([{
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message
        }]);

      if (supabaseError) throw supabaseError;

      // 2. Send Auto Reply to Customer via EmailJS
      try {
        await sendCustomerAutoReply({
          to_name: formData.name,
          to_email: formData.email,
        });
      } catch (emailError) {
        console.error("EmailJS Error:", emailError);
        // Continue even if email fails, data is saved. Provide warning.
        toast.warning("Enquiry saved, but email notification might have failed.");
      }

      toast.success("Message sent successfully! We'll be in touch soon.");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      console.error("Submission Error:", error);
      toast.error("Failed to send message. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageShell>
      <section className="container mx-auto px-5 md:px-8 space-section">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="font-heading text-hero-sm md:text-section text-foreground mb-4">Contact Us</h1>
          <p className="text-muted-foreground font-body text-body mb-12 max-w-xl">Visit our store or reach out — we're here to help you find your perfect ride.</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-lg-space">
          <div className="space-y-8">
            {[
              { icon: MapPin, title: "Visit Us", text: "Pro-Bikers Store, Chennai, Tamil Nadu, India" },
              { icon: Phone, title: "Call Us", text: "+91 98765 43210", href: "tel:+919876543210" },
              { icon: Mail, title: "Email", text: "info@probikers.in", href: "mailto:info@probikers.in" },
              { icon: Clock, title: "Store Hours", text: "Mon - Sat: 9:00 AM – 8:00 PM\nSun: 10:00 AM – 6:00 PM" },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-4">
                <item.icon className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-heading font-bold text-foreground mb-1">{item.title}</h3>
                  {item.href ? (
                    <a href={item.href} className="text-muted-foreground font-body hover:text-primary transition-colors duration-200">{item.text}</a>
                  ) : (
                    item.text.split("\n").map((line, i) => (
                      <p key={i} className="text-muted-foreground font-body">{line}</p>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Your Name *" className="w-full px-4 py-3 border border-border rounded-lg bg-card text-foreground font-body text-sm focus:outline-none focus:border-primary transition-colors duration-200" required />
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email Address *" className="w-full px-4 py-3 border border-border rounded-lg bg-card text-foreground font-body text-sm focus:outline-none focus:border-primary transition-colors duration-200" required />
            </div>
            <input type="text" name="subject" value={formData.subject} onChange={handleChange} placeholder="Subject" className="w-full px-4 py-3 border border-border rounded-lg bg-card text-foreground font-body text-sm focus:outline-none focus:border-primary transition-colors duration-200" />
            <textarea name="message" value={formData.message} onChange={handleChange} placeholder="Your Message *" rows={5} className="w-full px-4 py-3 border border-border rounded-lg bg-card text-foreground font-body text-sm focus:outline-none focus:border-primary transition-colors duration-200 resize-none" required />
            <Button size="lg" disabled={isSubmitting}>
              {isSubmitting ? "Sending..." : "Send Message"}
            </Button>
          </form>
        </div>
      </section>
    </PageShell>
  );
};

export default Contact;
