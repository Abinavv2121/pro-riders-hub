import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ScrollReveal from "@/components/ScrollReveal";
import { useParallax } from "@/hooks/use-parallax";
import communityImage from "@/assets/community-ride.jpg";

const CommunitySection = () => {
  const { ref, offset } = useParallax(0.85);

  return (
    <section ref={ref as React.RefObject<HTMLElement>} className="relative space-section overflow-hidden">
      <div className="absolute inset-0" style={{ transform: `translateY(${offset}px)`, willChange: "transform" }}>
        <img src={communityImage} alt="Community ride" className="w-full h-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-background/85" />
      </div>

      <div className="relative z-10 container mx-auto px-5 md:px-8 text-center">
        <div className="max-w-2xl mx-auto">
          <ScrollReveal as="p" drift={8} className="text-primary text-xs uppercase tracking-[0.3em] font-heading font-semibold mb-3">
            Join the Community
          </ScrollReveal>
          <ScrollReveal as="h2" delay={0.08} drift={14} className="font-heading text-section-sm md:text-section text-foreground mb-6">
            Ride Together. Grow Together.
          </ScrollReveal>
          <ScrollReveal as="p" delay={0.16} drift={10} className="text-muted-foreground font-body text-body mb-10 max-w-xl mx-auto">
            Join the Tamil Nadu Cycling Club and connect with thousands of passionate riders. Weekly group rides, events, and a community that pushes your limits.
          </ScrollReveal>
          <ScrollReveal delay={0.24} drift={10} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/community">
              <Button size="lg">Join a Ride</Button>
            </Link>
            <Link to="/community">
              <Button variant="secondary" size="lg">View Events</Button>
            </Link>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default CommunitySection;
