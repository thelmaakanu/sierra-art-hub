import { useState } from "react";
import { exhibitions, convertPrice } from "@/lib/data";
import { CalendarDays, MapPin, Ticket, UserPlus, PlusCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/auth";
import { useCart } from "@/lib/cart";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const TICKET_PRICE = 500; // NLE per ticket

export default function ExhibitionsPage() {
  const upcoming = exhibitions.filter(e => e.upcoming);
  const past = exhibitions.filter(e => !e.upcoming);
  const { user, profile } = useAuth();
  const [ticketModal, setTicketModal] = useState<string | null>(null);
  const [joinModal, setJoinModal] = useState<string | null>(null);
  const [hostModal, setHostModal] = useState(false);

  return (
    <div className="container py-12">
      <div className="mb-10">
        <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">Exhibitions</h1>
        <p className="text-muted-foreground">Discover art events and gallery showings across Sierra Leone</p>
      </div>

      {upcoming.length > 0 && (
        <section className="mb-16">
          <h2 className="font-display text-2xl font-bold mb-6">Upcoming</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {upcoming.map((ex, i) => (
              <ExhibitionCard key={ex.id} ex={ex} i={i} user={user} profile={profile}
                onBuyTicket={() => setTicketModal(ex.id)}
                onJoinRequest={() => setJoinModal(ex.id)}
              />
            ))}
          </div>
        </section>
      )}

      {past.length > 0 && (
        <section className="mb-16">
          <h2 className="font-display text-2xl font-bold mb-6">Past</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {past.map((ex, i) => (
              <ExhibitionCard key={ex.id} ex={ex} i={i} user={user} profile={profile} />
            ))}
          </div>
        </section>
      )}

      {/* Host Exhibition Request */}
      <div className="text-center py-12 border-t">
        <h3 className="font-display text-xl font-bold mb-2">Want to host an exhibition?</h3>
        <p className="text-sm text-muted-foreground mb-4">Share your idea and we'll help make it happen.</p>
        {user ? (
          <button onClick={() => setHostModal(true)} className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-md font-medium text-sm hover:opacity-90 transition-opacity">
            <PlusCircle className="h-4 w-4" /> Request to Host an Exhibition
          </button>
        ) : (
          <Link to="/login" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-md font-medium text-sm hover:opacity-90 transition-opacity">
            Login to Request
          </Link>
        )}
      </div>

      <AnimatePresence>
        {ticketModal && <TicketModal exhibitionId={ticketModal} onClose={() => setTicketModal(null)} />}
        {joinModal && <JoinRequestModal exhibitionId={joinModal} onClose={() => setJoinModal(null)} />}
        {hostModal && <HostExhibitionModal onClose={() => setHostModal(false)} />}
      </AnimatePresence>
    </div>
  );
}

function ExhibitionCard({ ex, i, user, profile, onBuyTicket, onJoinRequest }: {
  ex: typeof exhibitions[0]; i: number; user: any; profile: any;
  onBuyTicket?: () => void; onJoinRequest?: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: i * 0.1 }}
      viewport={{ once: true }}
      className="group rounded-xl overflow-hidden bg-card border"
    >
      <div className="aspect-[16/9] overflow-hidden">
        <img src={ex.image} alt={ex.title} loading="lazy" className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" />
      </div>
      <div className="p-6">
        <h3 className="font-display text-xl font-bold mb-3">{ex.title}</h3>
        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
          <span className="flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" /> {ex.date}</span>
          <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {ex.location}</span>
        </div>
        <p className="text-sm text-muted-foreground mb-4">{ex.description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {ex.featuredArtists.map(a => (
            <span key={a} className="text-xs bg-secondary text-secondary-foreground px-3 py-1 rounded-full">{a}</span>
          ))}
        </div>

        {ex.upcoming && (
          <div className="flex flex-wrap gap-2 pt-3 border-t">
            <button
              onClick={onBuyTicket}
              className="flex items-center gap-1.5 bg-primary text-primary-foreground px-4 py-2 rounded-md text-xs font-medium hover:opacity-90 transition-opacity"
            >
              <Ticket className="h-3.5 w-3.5" /> Buy Ticket
            </button>
            {user && profile?.user_type === "artist" && (
              <button
                onClick={onJoinRequest}
                className="flex items-center gap-1.5 bg-secondary text-secondary-foreground px-4 py-2 rounded-md text-xs font-medium hover:bg-muted transition-colors"
              >
                <UserPlus className="h-3.5 w-3.5" /> Request to Join
              </button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

function ModalOverlay({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-foreground/50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
        className="bg-background rounded-xl border p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

function TicketModal({ exhibitionId, onClose }: { exhibitionId: string; onClose: () => void }) {
  const ex = exhibitions.find(e => e.id === exhibitionId)!;
  const { user, profile } = useAuth();
  const { currency } = useCart();
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(false);

  const handlePurchase = async () => {
    if (!user) { toast.error("Please login to purchase tickets"); return; }
    setLoading(true);
    const { error } = await supabase.from("exhibition_tickets").insert({
      exhibition_title: ex.title,
      buyer_id: user.id,
      buyer_name: profile?.full_name || "",
      buyer_email: user.email || "",
      quantity: qty,
      total_price: TICKET_PRICE * qty,
    });
    setLoading(false);
    if (error) { toast.error("Failed to purchase ticket"); return; }
    toast.success("Ticket purchased successfully!");
    onClose();
  };

  return (
    <ModalOverlay onClose={onClose}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-lg font-bold">Buy Ticket</h3>
        <button onClick={onClose}><X className="h-5 w-5 text-muted-foreground" /></button>
      </div>
      <div className="space-y-3 mb-6">
        <p className="font-semibold">{ex.title}</p>
        <p className="text-sm text-muted-foreground"><CalendarDays className="inline h-3.5 w-3.5 mr-1" />{ex.date}</p>
        <p className="text-sm text-muted-foreground"><MapPin className="inline h-3.5 w-3.5 mr-1" />{ex.location}</p>
        <p className="text-sm">Price: <span className="font-semibold text-primary">{convertPrice(TICKET_PRICE, currency)}</span> / ticket</p>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1.5">Quantity</label>
        <select value={qty} onChange={e => setQty(Number(e.target.value))} className="w-full px-3 py-2.5 rounded-md text-sm bg-secondary border-none">
          {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
        </select>
      </div>
      <div className="flex justify-between font-semibold mb-4 p-3 bg-secondary rounded-md">
        <span>Total</span>
        <span className="text-primary">{convertPrice(TICKET_PRICE * qty, currency)}</span>
      </div>
      {user ? (
        <button onClick={handlePurchase} disabled={loading} className="w-full bg-primary text-primary-foreground py-3 rounded-md font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50">
          {loading ? "Processing..." : "Confirm Purchase"}
        </button>
      ) : (
        <Link to="/login" className="block w-full text-center bg-primary text-primary-foreground py-3 rounded-md font-medium text-sm" onClick={onClose}>
          Login to Purchase
        </Link>
      )}
    </ModalOverlay>
  );
}

function JoinRequestModal({ exhibitionId, onClose }: { exhibitionId: string; onClose: () => void }) {
  const { user, profile } = useAuth();
  const [message, setMessage] = useState("");
  const [portfolioLink, setPortfolioLink] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    const { error } = await supabase.from("exhibition_join_requests").insert({
      exhibition_id: exhibitionId,
      artist_id: user.id,
      artist_name: profile?.full_name || "",
      portfolio_link: portfolioLink || `${window.location.origin}/artist/${user.id}`,
      message,
    });
    setLoading(false);
    if (error) { toast.error("Failed to submit request"); return; }
    toast.success("Join request submitted! We'll review it soon.");
    onClose();
  };

  return (
    <ModalOverlay onClose={onClose}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-lg font-bold">Request to Join Exhibition</h3>
        <button onClick={onClose}><X className="h-5 w-5 text-muted-foreground" /></button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1.5">Artist Name</label>
          <input type="text" value={profile?.full_name || ""} readOnly className="w-full px-3 py-2.5 rounded-md text-sm bg-secondary border-none" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Portfolio Link</label>
          <input type="url" value={portfolioLink} onChange={e => setPortfolioLink(e.target.value)} placeholder="https://..." className="w-full px-3 py-2.5 rounded-md text-sm bg-secondary border-none focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Message to Organizer</label>
          <textarea value={message} onChange={e => setMessage(e.target.value)} rows={3} placeholder="Why you'd like to join..." className="w-full px-3 py-2.5 rounded-md text-sm bg-secondary border-none focus:outline-none focus:ring-2 focus:ring-ring resize-none" required />
        </div>
        <button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground py-3 rounded-md font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50">
          {loading ? "Submitting..." : "Submit Request"}
        </button>
      </form>
    </ModalOverlay>
  );
}

function HostExhibitionModal({ onClose }: { onClose: () => void }) {
  const { user } = useAuth();
  const [form, setForm] = useState({ name: "", email: user?.email || "", idea: "", location: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    const { error } = await supabase.from("host_exhibition_requests").insert({
      user_id: user.id,
      name: form.name,
      email: form.email,
      exhibition_idea: form.idea,
      location: form.location,
    });
    setLoading(false);
    if (error) { toast.error("Failed to submit request"); return; }
    toast.success("Exhibition hosting request submitted!");
    onClose();
  };

  return (
    <ModalOverlay onClose={onClose}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-lg font-bold">Request to Host an Exhibition</h3>
        <button onClick={onClose}><X className="h-5 w-5 text-muted-foreground" /></button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1.5">Your Name</label>
          <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required className="w-full px-3 py-2.5 rounded-md text-sm bg-secondary border-none focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Email</label>
          <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required className="w-full px-3 py-2.5 rounded-md text-sm bg-secondary border-none focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Exhibition Idea</label>
          <textarea value={form.idea} onChange={e => setForm(f => ({ ...f, idea: e.target.value }))} rows={3} required className="w-full px-3 py-2.5 rounded-md text-sm bg-secondary border-none focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Proposed Location</label>
          <input type="text" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} required className="w-full px-3 py-2.5 rounded-md text-sm bg-secondary border-none focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
        <button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground py-3 rounded-md font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50">
          {loading ? "Submitting..." : "Submit Request"}
        </button>
      </form>
    </ModalOverlay>
  );
}
