import { useEffect, useState } from "react";
import PageShell from "@/components/PageShell";
import { motion } from "framer-motion";
import { supabase, CommunityEvent } from "@/lib/supabase";
import communityHeroImage from "@/assets/community-ride.jpg";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";

// Mock data matching the layout and text in the provided screenshots
const MOCK_EVENTS: CommunityEvent[] = [
  {
    id: "mock-1",
    name: "CC Enduro Series - 2026 - Season 1",
    banner_image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1400&auto=format&fit=crop",
    description: `Chennai Cyclists\n\nPresents\n\nEnduro Series - Season 1 - Ancient Series\n\nPowered by\n\nProbikers\n\nWe are excited to present the First Season of "CC Enduro Series 2026-27", an ancient series.\n\nRegister for the first 4 events at discounted price.\n\nHere are the 4 events -\n\nStamina 222 - Nadavavi Well\n\nFortitude 333 - TBA\n\nPersistence 444- TBA\n\nResilience 555 - TBA\n\nStarting Point for all 4 events - Probikers, OMR\n\nRule book for Enduro Series\n\nREWARDS: A special and unique medal for all the finishers\n\nBulk Registration closes on 23rd July, 2026`,
    faqs: `Q: What are the events in Season 1?\nA: The season includes Stamina 222 (Nadavavi Well), Fortitude 333, Persistence 444, and Resilience 555.\n\nQ: Where is the starting point?\nA: The starting point for all 4 events is Probikers, OMR.\n\nQ: Is a helmet mandatory?\nA: Yes, helmets are strictly mandatory for all riders during the events.\n\nQ: Are there any finishers rewards?\nA: Yes! A special and unique medal will be given to all the finishers of the series.`,
    register_details: `Register for the first 4 events at discounted price.\n\nBulk Registration closes on 23rd July, 2026.\n\nTo register, visit the Probikers store in OMR or contact the Chennai Cyclists community representatives directly.`,
    rules: `1. Riders must wear a certified helmet at all times during the event.\n2. Bicycles must be in good working condition with front and rear lights.\n3. Respect other road users and strictly follow all traffic regulations.\n4. Drafting behind non-participant vehicles is strictly prohibited.\n5. Keep the environment clean. Do not litter along the route.`
  },
  {
    id: "mock-2",
    name: "CBC 2026 Winter Commute Series + July Commute Challenge",
    banner_image: "https://images.unsplash.com/photo-1571188654248-7a89213fe7e7?q=80&w=1400&auto=format&fit=crop",
    description: `Chennai Cyclists & Probikers\n\nPresents\n\n10 Days Commute & Winter 50 Days Commute Challenge\n\nJoin our annual winter commuting series and the special July commuter challenge! Stay active, reduce your carbon footprint, and earn rewards for daily commutes.`,
    faqs: `Q: How can I track my commutes?\nA: You can track and log your rides using our Strava club or by submitting daily ride sheets at the workshop.\n\nQ: What is the distance requirement?\nA: A minimum of 5 km per commute is required to log progress.\n\nQ: Who can join this challenge?\nA: Anyone who commutes to work or study can participate in this challenge.`,
    register_details: `Registration is free and open to all cyclists.\n\nRegister online on the Chennai Cyclists Strava club or sign up at our Probikers service desk to receive your logging kit.`,
    rules: `1. Only rides made on work/educational commuting days will count.\n2. Rides must be logged via Strava or verified manual logs.\n3. Safe riding practices and traffic compliance are mandatory.`
  }
];

const Community = () => {
  const [events, setEvents] = useState<CommunityEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<CommunityEvent | null>(null);
  const [activeTab, setActiveTab] = useState<"description" | "faqs" | "register" | "rules">("description");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data, error } = await supabase
          .from("community_events")
          .select("*")
          .order("created_at", { ascending: false });
        if (error) throw error;
        
        // If query succeeded but returned no rows, fallback to mock data so page is populated initially
        if (!data || data.length === 0) {
          setEvents(MOCK_EVENTS);
        } else {
          setEvents(data);
        }
      } catch (err) {
        console.warn("Table community_events not found. Using mock events.", err);
        setEvents(MOCK_EVENTS);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleOpenDetails = (event: CommunityEvent) => {
    setSelectedEvent(event);
    setActiveTab("description");
  };

  const handleCloseDetails = () => {
    setSelectedEvent(null);
  };

  return (
    <PageShell>
      {selectedEvent ? (
        /* Detailed Event Page (Second Image Layout) */
        <div className="bg-[#FFFFFF] min-h-screen py-10">
          <div className="container mx-auto px-5 md:px-8 max-w-4xl">
            {/* Back Button and Title */}
            <div className="flex items-center mb-6">
              <button
                onClick={handleCloseDetails}
                className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-black uppercase tracking-wider transition-colors cursor-pointer font-heading"
              >
                <ChevronLeft className="w-4 h-4" /> Back to Events
              </button>
            </div>
            
            <h1 className="text-center font-heading text-xl md:text-2xl font-bold text-black uppercase tracking-wide mb-6">
              {selectedEvent.name}
            </h1>

            {/* Banner Image */}
            <div className="w-full rounded-xl overflow-hidden shadow-md mb-8 aspect-[21/9]">
              <img
                src={selectedEvent.banner_image}
                alt={selectedEvent.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Horizontal Tabs */}
            <div className="border-b border-gray-200 mb-6">
              <div className="flex gap-8 overflow-x-auto pb-px">
                {(["description", "faqs", "register", "rules"] as const).map((tab) => {
                  const label =
                    tab === "description"
                      ? "Description"
                      : tab === "faqs"
                      ? "FAQs"
                      : tab === "register"
                      ? "Register"
                      : "Rules";
                  
                  const isActive = activeTab === tab;

                  return (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`pb-3.5 text-xs font-heading font-bold uppercase tracking-wider transition-all border-b-2 cursor-pointer whitespace-nowrap ${
                        isActive
                          ? "border-black text-black"
                          : "border-transparent text-gray-500 hover:text-gray-900"
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tab Contents */}
            <div className="p-2 rounded-xl min-h-[300px]">
              <div className="text-gray-800 text-sm md:text-[15px] font-body whitespace-pre-wrap leading-relaxed text-left">
                {activeTab === "description" && selectedEvent.description}
                {activeTab === "faqs" && selectedEvent.faqs}
                {activeTab === "register" && selectedEvent.register_details}
                {activeTab === "rules" && selectedEvent.rules}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Event List Page (First Image Layout) */
        <div className="bg-[#f9fafb] min-h-screen">
          {/* Hero Section */}
          <section className="relative h-[40vh] flex items-center overflow-hidden">
            <div className="absolute inset-0">
              <img src={communityHeroImage} alt="Community ride" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-[hsl(216,16%,7%)]/70" />
            </div>
            <div className="relative z-10 container mx-auto px-5 md:px-8">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <p className="text-primary text-xs uppercase tracking-[0.3em] font-heading font-semibold mb-3">Tamil Nadu Cycling Club</p>
                <h1 className="font-heading text-hero-sm md:text-section text-[#FFFFFF] mb-4">Community</h1>
                <p className="text-muted-foreground font-body text-body max-w-xl">Group rides, events, and a community that pushes your limits.</p>
              </motion.div>
            </div>
          </section>

          {/* Events list */}
          <section className="container mx-auto px-5 md:px-8 py-16 max-w-4xl space-y-12">
            {loading ? (
              <div className="text-center py-12 text-gray-400 font-heading">
                Loading community events...
              </div>
            ) : events.length === 0 ? (
              <div className="text-center py-16 bg-white border border-gray-150 rounded-2xl shadow-sm text-gray-400">
                <p className="font-medium text-gray-700 font-heading">No upcoming events at this moment.</p>
                <p className="text-sm mt-1">Check back later for updates!</p>
              </div>
            ) : (
              <div className="space-y-12">
                {events.map((event) => (
                  <div
                    key={event.id}
                    className="flex flex-col md:flex-row gap-6 md:gap-10 items-center bg-transparent border-0 p-0"
                  >
                    {/* Left Event Image - Rectangular */}
                    <div className="w-full md:w-[480px] aspect-[1.8/1] rounded-lg overflow-hidden bg-gray-100 shadow-sm shrink-0 border border-gray-150">
                      <img
                        src={event.banner_image}
                        alt={event.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Right Content */}
                    <div className="flex-1 min-w-0 flex flex-col justify-center space-y-4 text-left w-full">
                      <h3 className="font-heading text-lg md:text-xl font-bold text-black leading-tight">
                        {event.name}
                      </h3>
                      <button
                        onClick={() => handleOpenDetails(event)}
                        className="text-cyan-500 hover:text-cyan-600 font-heading font-semibold text-xs uppercase tracking-wider transition-colors w-fit cursor-pointer hover:underline flex items-center gap-1"
                      >
                        Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </PageShell>
  );
};

export default Community;
