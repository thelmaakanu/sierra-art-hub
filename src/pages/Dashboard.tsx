import { useState, useEffect, useRef } from "react";
import { Upload, Trash2, DollarSign, TrendingUp, Eye, Package, Bell, Image as ImageIcon, Edit3, ShoppingBag, Heart, Sparkles } from "lucide-react";
import { convertPrice, categories } from "@/lib/data";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";

const COMMISSION_RATE = 10;

interface ArtworkRow {
  id: string;
  title: string;
  description: string | null;
  price: number;
  category: string;
  image_url: string | null;
  sold: boolean;
  created_at: string;
}

export default function Dashboard() {
  const { user, profile, loading: authLoading } = useAuth();
  const { currency } = useCart();
  const navigate = useNavigate();
  const isArtist = profile?.user_type === "artist";
  const [showWelcome, setShowWelcome] = useState(false);

  const artistTabs: { key: string; label: string; icon: React.ElementType }[] = [
    { key: "gallery", label: "My Gallery", icon: ImageIcon },
    { key: "upload", label: "Upload Art", icon: Upload },
    { key: "earnings", label: "Earnings", icon: DollarSign },
    { key: "notifications", label: "Notifications", icon: Bell },
  ];

  const buyerTabs: { key: string; label: string; icon: React.ElementType }[] = [
    { key: "overview", label: "Overview", icon: Eye },
    { key: "notifications", label: "Notifications", icon: Bell },
  ];

  const tabs = isArtist ? artistTabs : buyerTabs;
  const [activeTab, setActiveTab] = useState(tabs[0].key);
  const [artworks, setArtworks] = useState<ArtworkRow[]>([]);

  useEffect(() => {
    if (!authLoading && !user) navigate("/login");
  }, [user, authLoading]);

  useEffect(() => {
    if (user && isArtist) fetchArtworks();
  }, [user, isArtist]);

  useEffect(() => {
    if (user && profile) {
      const welcomed = sessionStorage.getItem(`welcomed_${user.id}`);
      if (!welcomed) {
        setShowWelcome(true);
        sessionStorage.setItem(`welcomed_${user.id}`, "true");
      }
    }
  }, [user, profile]);

  const fetchArtworks = async () => {
    if (!user) return;
    const { data } = await supabase.from("artworks").select("*").eq("artist_id", user.id).order("created_at", { ascending: false });
    setArtworks((data as ArtworkRow[]) || []);
  };

  if (authLoading) return <div className="container py-24 text-center text-muted-foreground">Loading...</div>;
  if (!user || !profile) return null;

  return (
    <div className="container py-10">
      {showWelcome && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-secondary rounded-2xl p-7 mb-10 relative"
        >
          <button onClick={() => setShowWelcome(false)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground text-sm">✕</button>
          <div className="flex items-start gap-4">
            <Sparkles className="h-6 w-6 flex-shrink-0 mt-0.5" />
            <div>
              <h2 className="font-display text-lg font-bold mb-1">Welcome to ArtVault, {profile.full_name}! 🎉</h2>
              <p className="text-sm text-muted-foreground mb-5">Your account is set up. Here's what you can do next:</p>
              <div className="flex flex-wrap gap-3">
                <Link to="/shop" className="inline-flex items-center gap-2 bg-foreground text-background px-5 py-2.5 rounded-full text-sm font-medium hover:opacity-90 transition-opacity">
                  <ShoppingBag className="h-4 w-4" /> Explore Shop
                </Link>
                {isArtist && (
                  <button onClick={() => { setActiveTab("upload"); setShowWelcome(false); }} className="inline-flex items-center gap-2 bg-background border px-5 py-2.5 rounded-full text-sm font-medium hover:bg-foreground/5 transition-colors">
                    <Upload className="h-4 w-4" /> Upload First Artwork
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-start gap-8 mb-12">
        <div className="h-24 w-24 rounded-full overflow-hidden ring-2 ring-border flex-shrink-0 bg-foreground text-background flex items-center justify-center text-3xl font-bold">
          {profile.avatar_url ? (
            <img src={profile.avatar_url} alt={profile.full_name} className="h-full w-full object-cover" />
          ) : (
            profile.full_name[0]?.toUpperCase()
          )}
        </div>
        <div className="flex-1">
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-2 tracking-tight">{profile.full_name}</h1>
          <div className="flex items-center gap-2 mb-3">
            <span className={`inline-flex items-center gap-1 text-xs font-medium uppercase tracking-wider px-3 py-1.5 rounded-full ${
              isArtist ? "bg-foreground/10" : "bg-secondary"
            }`}>
              {isArtist ? "🎨 Artist" : "🛍️ Buyer"}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mb-4">{profile.bio || (isArtist ? "Sierra Leonean Artist" : "Art enthusiast")}</p>
          {isArtist && (
            <div className="flex gap-8 text-sm">
              <div><span className="font-bold text-lg">{artworks.length}</span> <span className="text-muted-foreground">Artworks</span></div>
            </div>
          )}
        </div>
        <Link to="/wishlist" className="inline-flex items-center gap-2 px-5 py-2.5 bg-secondary rounded-full text-sm font-medium hover:bg-foreground/10 transition-colors">
          <Heart className="h-4 w-4" /> Wishlist
        </Link>
      </div>

      {/* Quick Actions (Buyer) */}
      {!isArtist && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { label: "Browse Shop", icon: ShoppingBag, to: "/shop" },
            { label: "My Wishlist", icon: Heart, to: "/wishlist" },
            { label: "Exhibitions", icon: Eye, to: "/exhibitions" },
            { label: "Community", icon: Edit3, to: "/community" },
          ].map((action) => (
            <Link
              key={action.label}
              to={action.to}
              className="flex flex-col items-center gap-3 p-7 bg-card border rounded-2xl hover:border-foreground/20 hover:shadow-lg transition-all duration-300 text-center"
            >
              <action.icon className="h-6 w-6" />
              <span className="text-sm font-medium">{action.label}</span>
            </Link>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 mb-10 overflow-x-auto border-b -mx-4 px-4 md:mx-0 md:px-0">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === tab.key ? "border-foreground text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "overview" && <BuyerOverview />}
      {activeTab === "gallery" && isArtist && <GalleryTab works={artworks} currency={currency} onRefresh={fetchArtworks} />}
      {activeTab === "upload" && isArtist && <UploadTab userId={user.id} onUploaded={() => { fetchArtworks(); setActiveTab("gallery"); }} />}
      {activeTab === "earnings" && isArtist && <EarningsTab artworks={artworks} currency={currency} />}
      {activeTab === "notifications" && <NotificationsTab />}
    </div>
  );
}

function BuyerOverview() {
  return (
    <div>
      <h2 className="font-display text-xl font-bold mb-8 tracking-tight">Your Activity</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link to="/shop" className="bg-card border rounded-2xl p-10 hover:border-foreground/20 hover:shadow-lg transition-all duration-300">
          <ShoppingBag className="h-8 w-8 mb-4" />
          <h3 className="font-display font-semibold text-base mb-2">Explore Art</h3>
          <p className="text-sm text-muted-foreground">Discover authentic Sierra Leonean artworks from verified artists</p>
        </Link>
        <Link to="/exhibitions" className="bg-card border rounded-2xl p-10 hover:border-foreground/20 hover:shadow-lg transition-all duration-300">
          <Eye className="h-8 w-8 mb-4" />
          <h3 className="font-display font-semibold text-base mb-2">Exhibitions</h3>
          <p className="text-sm text-muted-foreground">Browse upcoming exhibitions and get your tickets</p>
        </Link>
      </div>
    </div>
  );
}

function GalleryTab({ works, currency, onRefresh }: { works: ArtworkRow[]; currency: string; onRefresh: () => void }) {
  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("artworks").delete().eq("id", id);
    if (error) { toast.error("Failed to delete"); return; }
    toast.success("Artwork deleted");
    onRefresh();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-display text-xl font-bold tracking-tight">My Artworks ({works.length})</h2>
      </div>
      {works.length === 0 ? (
        <p className="text-center text-muted-foreground py-16">No artworks yet. Upload your first piece!</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {works.map((work, i) => (
            <motion.div key={work.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="rounded-2xl border overflow-hidden">
              <div className="aspect-[4/3] relative bg-secondary">
                {work.image_url ? (
                  <img src={work.image_url} alt={work.title} className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-muted-foreground"><ImageIcon className="h-10 w-10" /></div>
                )}
                <div className={`absolute top-3 right-3 text-xs font-medium px-3 py-1.5 rounded-full ${work.sold ? "bg-foreground text-background" : "bg-background text-foreground"}`}>
                  {work.sold ? "SOLD" : "AVAILABLE"}
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-display font-semibold text-sm mb-1">{work.title}</h3>
                <p className="text-sm font-semibold mb-4">{convertPrice(work.price, currency)}</p>
                <button onClick={() => handleDelete(work.id)} className="flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-medium bg-secondary rounded-full hover:bg-destructive hover:text-destructive-foreground transition-colors">
                  <Trash2 className="h-3 w-3" /> Delete
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

function UploadTab({ userId, onUploaded }: { userId: string; onUploaded: () => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Painting");
  const [price, setPrice] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const commission = price * (COMMISSION_RATE / 100);
  const earnings = price - commission;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || price <= 0) { toast.error("Please fill all fields"); return; }
    setUploading(true);
    let imageUrl: string | null = null;
    if (file) {
      const ext = file.name.split(".").pop();
      const path = `${userId}/${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage.from("artist-uploads").upload(path, file);
      if (uploadError) { toast.error("Image upload failed"); setUploading(false); return; }
      const { data: urlData } = supabase.storage.from("artist-uploads").getPublicUrl(path);
      imageUrl = urlData.publicUrl;
    }
    const { error } = await supabase.from("artworks").insert({
      artist_id: userId,
      title: title.trim(),
      description: description.trim() || null,
      category,
      price,
      image_url: imageUrl,
    });
    setUploading(false);
    if (error) { toast.error("Failed to upload artwork"); return; }
    toast.success("Artwork uploaded successfully!");
    onUploaded();
  };

  return (
    <div className="max-w-xl">
      <h2 className="font-display text-xl font-bold mb-8 tracking-tight">Upload New Artwork</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div
          onClick={() => fileRef.current?.click()}
          className="border-2 border-dashed border-border rounded-2xl p-12 text-center cursor-pointer hover:border-foreground/30 transition-colors"
        >
          <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-3" />
          <p className="text-sm text-muted-foreground">{file ? file.name : "Click or drag to upload artwork image"}</p>
          <p className="text-xs text-muted-foreground mt-1">JPG, PNG, WebP up to 10MB</p>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => setFile(e.target.files?.[0] || null)} />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Title</label>
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Artwork title" className="w-full px-4 py-3 rounded-xl text-sm bg-secondary border-none focus:outline-none focus:ring-2 focus:ring-ring" required />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe your artwork..." rows={3} className="w-full px-4 py-3 rounded-xl text-sm bg-secondary border-none focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Category</label>
          <select value={category} onChange={e => setCategory(e.target.value)} className="w-full px-4 py-3 rounded-xl text-sm bg-secondary border-none focus:outline-none focus:ring-2 focus:ring-ring">
            {categories.filter(c => c !== "All").map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Price (NLE)</label>
          <input type="number" min={0} value={price || ""} onChange={e => setPrice(Number(e.target.value))} className="w-full px-4 py-3 rounded-xl text-sm bg-secondary border-none focus:outline-none focus:ring-2 focus:ring-ring" required />
        </div>

        {price > 0 && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="bg-secondary rounded-2xl p-5 space-y-2">
            <h4 className="font-display font-semibold text-sm mb-3">Commission Breakdown</h4>
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Price</span><span>NLe {price.toLocaleString()}</span></div>
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Platform Fee ({COMMISSION_RATE}%)</span><span className="text-destructive">- NLe {commission.toLocaleString()}</span></div>
            <div className="flex justify-between text-sm font-bold border-t pt-3"><span>You Will Earn</span><span>NLe {earnings.toLocaleString()}</span></div>
          </motion.div>
        )}

        <button type="submit" disabled={uploading} className="w-full bg-foreground text-background py-3.5 rounded-full font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50">
          {uploading ? "Uploading..." : "Upload Artwork"}
        </button>
      </form>
    </div>
  );
}

function EarningsTab({ artworks, currency }: { artworks: ArtworkRow[]; currency: string }) {
  const totalSales = artworks.filter(a => a.sold).reduce((s, a) => s + a.price, 0);
  const netEarnings = totalSales * 0.9;

  const stats = [
    { label: "Total Sales", value: totalSales, icon: TrendingUp },
    { label: "Net Earnings", value: netEarnings, icon: DollarSign },
    { label: "Artworks Listed", value: artworks.length, icon: Package, raw: true },
    { label: "Sold", value: artworks.filter(a => a.sold).length, icon: Eye, raw: true },
  ];

  return (
    <div>
      <h2 className="font-display text-xl font-bold mb-8 tracking-tight">Earnings Overview</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="rounded-2xl border p-5">
            <div className="flex items-center gap-2 mb-3">
              <stat.icon className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{stat.label}</span>
            </div>
            <p className="font-display text-lg font-bold">
              {(stat as any).raw ? stat.value : convertPrice(stat.value, currency)}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function NotificationsTab() {
  return (
    <div className="max-w-xl">
      <h2 className="font-display text-xl font-bold mb-8 tracking-tight">Notifications</h2>
      <p className="text-center text-muted-foreground py-16">No notifications yet.</p>
    </div>
  );
}
