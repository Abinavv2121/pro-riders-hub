import { useState, useEffect, useRef } from "react";
import { supabase, CommunityEvent } from "@/lib/supabase";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2, Calendar, Upload } from "lucide-react";

const EventsManagement = () => {
  const [events, setEvents] = useState<CommunityEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form fields
  const [name, setName] = useState("");
  const [bannerImage, setBannerImage] = useState("");
  const [description, setDescription] = useState("");
  const [faqs, setFaqs] = useState("");
  const [registerDetails, setRegisterDetails] = useState("");
  const [rules, setRules] = useState("");

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("community_events")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }
      setEvents(data || []);
    } catch (err: any) {
      console.warn("Table community_events not found. Using localStorage fallback.", err);
      const local = localStorage.getItem("community_events");
      if (local) {
        setEvents(JSON.parse(local));
      } else {
        setEvents([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const fileName = `events/${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
      const { data, error } = await supabase.storage
        .from("product-images")
        .upload(fileName, file, { upsert: true });
      if (error) throw error;
      const { data: urlData } = supabase.storage
        .from("product-images")
        .getPublicUrl(data.path);
      setBannerImage(urlData.publicUrl);
      toast.success("Event banner uploaded successfully");
    } catch (err: any) {
      console.error(err);
      toast.error("Banner upload failed. Please paste a URL instead.");
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !bannerImage.trim() || !description.trim() || !faqs.trim() || !registerDetails.trim() || !rules.trim()) {
      toast.error("Please fill in all the fields including event banner.");
      return;
    }

    setSubmitting(true);
    const newEvent: CommunityEvent = {
      id: Math.random().toString(36).substring(2, 9),
      name,
      banner_image: bannerImage,
      description,
      faqs,
      register_details: registerDetails,
      rules,
      created_at: new Date().toISOString(),
    };

    try {
      const { error } = await supabase
        .from("community_events")
        .insert([{
          name,
          banner_image: bannerImage,
          description,
          faqs,
          register_details: registerDetails,
          rules,
        }]);

      if (error) throw error;

      toast.success("Event created successfully in Supabase!");
      setName("");
      setBannerImage("");
      setDescription("");
      setFaqs("");
      setRegisterDetails("");
      setRules("");
      fetchEvents();
    } catch (err: any) {
      console.warn("Failed to create in Supabase. Creating in localStorage.", err);
      const local = localStorage.getItem("community_events");
      const currentEvents = local ? JSON.parse(local) : [];
      const updatedEvents = [newEvent, ...currentEvents];
      localStorage.setItem("community_events", JSON.stringify(updatedEvents));
      
      toast.success("Event created locally (Supabase table not found)!");
      setName("");
      setBannerImage("");
      setDescription("");
      setFaqs("");
      setRegisterDetails("");
      setRules("");
      setEvents(updatedEvents);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemoveEvent = async (id: string) => {
    if (!confirm("Are you sure you want to remove this event?")) return;

    try {
      const { error } = await supabase
        .from("community_events")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast.success("Event removed successfully from Supabase.");
      setEvents((prev) => prev.filter((ev) => ev.id !== id));
    } catch (err: any) {
      console.warn("Failed to delete from Supabase. Deleting from localStorage.", err);
      const local = localStorage.getItem("community_events");
      if (local) {
        const currentEvents = JSON.parse(local);
        const updatedEvents = currentEvents.filter((ev: any) => ev.id !== id);
        localStorage.setItem("community_events", JSON.stringify(updatedEvents));
        setEvents(updatedEvents);
        toast.success("Event removed locally.");
      } else {
        setEvents((prev) => prev.filter((ev) => ev.id !== id));
        toast.success("Event removed.");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 font-heading">Community Events</h2>
        <p className="text-sm text-gray-500 mt-0.5 font-body">
          Manage upcoming community rides, races, and challenges.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Create Event Form */}
        <div className="lg:col-span-1 bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4 h-fit">
          <h3 className="font-heading font-bold text-lg text-gray-900 border-b pb-2">Create New Event</h3>
          <form onSubmit={handleCreateEvent} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Event Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., CC Enduro Series - 2026 - Season 1"
                className="w-full px-3 py-2 border rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-gray-900 text-black font-body"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">Event Banner Image</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={bannerImage}
                  onChange={(e) => setBannerImage(e.target.value)}
                  placeholder="Paste banner URL..."
                  className="flex-1 px-3 py-2 border rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-gray-900 text-black font-body"
                />
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileUpload}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingImage}
                  className="shrink-0"
                >
                  {uploadingImage ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                </Button>
              </div>
              {bannerImage && (
                <div className="relative mt-2 border rounded-lg overflow-hidden aspect-video bg-gray-50 max-h-36">
                  <img src={bannerImage} alt="Event banner preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Details of the event..."
                rows={4}
                className="w-full px-3 py-2 border rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-gray-900 text-black font-body"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">FAQs</label>
              <textarea
                value={faqs}
                onChange={(e) => setFaqs(e.target.value)}
                placeholder="FAQs (one per line or formatted)..."
                rows={3}
                className="w-full px-3 py-2 border rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-gray-900 text-black font-body"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Registering Details (Register)</label>
              <textarea
                value={registerDetails}
                onChange={(e) => setRegisterDetails(e.target.value)}
                placeholder="How to register, registration link, cost, dates..."
                rows={3}
                className="w-full px-3 py-2 border rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-gray-900 text-black font-body"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Rules</label>
              <textarea
                value={rules}
                onChange={(e) => setRules(e.target.value)}
                placeholder="Event rules, terms, gear requirements..."
                rows={3}
                className="w-full px-3 py-2 border rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-gray-900 text-black font-body"
                required
              />
            </div>

            <Button type="submit" disabled={submitting} className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-lg py-2">
              {submitting ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Creating Event...</>
              ) : (
                "Create Event"
              )}
            </Button>
          </form>
        </div>

        {/* Existing Events List */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-heading font-bold text-lg text-gray-900">Created Events</h3>
          {loading ? (
            <div className="flex justify-center py-10 text-gray-400">
              <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading events...
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-12 px-4 border-2 border-dashed border-gray-200 rounded-xl bg-white text-gray-400">
              <Calendar className="w-10 h-10 mx-auto mb-3 opacity-50 text-gray-500" />
              <p className="font-semibold text-gray-700 font-heading">No events found</p>
              <p className="text-sm mt-1 text-gray-500 font-body">Create an event using the form to get started</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {events.map((ev) => (
                <div key={ev.id} className="border border-gray-200 rounded-xl bg-white p-4 shadow-sm flex flex-col md:flex-row gap-4 items-start">
                  <div className="w-full md:w-32 aspect-video md:aspect-square rounded-lg overflow-hidden bg-gray-100 shrink-0">
                    <img src={ev.banner_image} alt={ev.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <h4 className="font-heading font-bold text-lg text-gray-900 truncate">{ev.name}</h4>
                    <p className="text-xs text-gray-500 line-clamp-3 font-body">{ev.description}</p>
                    <div className="pt-2 flex flex-wrap gap-2 text-xs font-semibold text-gray-600 font-body">
                      <span className="bg-gray-100 px-2 py-1 rounded">FAQs: {ev.faqs ? "Yes" : "No"}</span>
                      <span className="bg-gray-100 px-2 py-1 rounded">Register: {ev.register_details ? "Yes" : "No"}</span>
                      <span className="bg-gray-100 px-2 py-1 rounded">Rules: {ev.rules ? "Yes" : "No"}</span>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleRemoveEvent(ev.id!)}
                    variant="destructive"
                    size="sm"
                    className="shrink-0 font-heading font-semibold text-xs uppercase px-3 py-1 flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Remove
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventsManagement;
