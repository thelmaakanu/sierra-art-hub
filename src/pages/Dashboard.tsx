import { useState } from "react";
import { Upload, Edit3, Trash2, DollarSign, TrendingUp, Eye, Package, Bell, Users, Image as ImageIcon } from "lucide-react";
import { artists, artworks, convertPrice, categories } from "@/lib/data";
import { useCart } from "@/lib/cart";
import { motion } from "framer-motion";
import { toast } from "sonner";

const COMMISSION_RATE = 10;
const mockArtist = artists[0];
const mockArtistWorks = artworks.filter(a => a.artistId === mockArtist.id);

const mockEarnings = {
  total: 8500,
  pending: 2500,
  completed: 5500,
  withdrawable: 5000,
};

const mockNotifications = [
  { id: "1", text: "New follower: Sarah M.", time: "2h ago", read: false },
  { id: "2", text: "'Mother & Child' received 5 new likes", time: "5h ago", read: false },
  { id: "3", text: "'Rhythms of the Ancestors' was sold!", time: "1d ago", read: true },
  { id: "4", text: "Payment of NLe 2,250 released", time: "2d ago", read: true },
];

type Tab = "gallery" | "upload" | "earnings" | "notifications";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("gallery");
  const { currency } = useCart();

  const tabs: { key: Tab; label: string; icon: React.ElementType }[] = [
    { key: "gallery", label: "My Gallery", icon: ImageIcon },
    { key: "upload", label: "Upload Art", icon: Upload },
    { key: "earnings", label: "Earnings", icon: DollarSign },
    { key: "notifications", label: "Notifications", icon: Bell },
  ];

  return (
    <div className="container py-8">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-start gap-6 mb-10">
        <div className="h-20 w-20 rounded-full overflow-hidden ring-4 ring-secondary flex-shrink-0">
          <img src={mockArtist.image} alt={mockArtist.name} className="h-full w-full object-cover" />
        </div>
        <div className="flex-1">
          <h1 className="font-display text-2xl md:text-3xl font-bold mb-1">{mockArtist.name}</h1>
          <p className="text-sm text-muted-foreground mb-3">{mockArtist.bio}</p>
          <div className="flex gap-6 text-sm">
            <div><span className="font-bold">{mockArtist.followers.toLocaleString()}</span> <span className="text-muted-foreground">Followers</span></div>
            <div><span className="font-bold">{mockArtist.artworks}</span> <span className="text-muted-foreground">Artworks</span></div>
            <div><span className="font-bold">12</span> <span className="text-muted-foreground">Following</span></div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-8 overflow-x-auto border-b">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === tab.key
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
            {tab.key === "notifications" && (
              <span className="bg-primary text-primary-foreground text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                {mockNotifications.filter(n => !n.read).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {activeTab === "gallery" && <GalleryTab works={mockArtistWorks} currency={currency} />}
      {activeTab === "upload" && <UploadTab />}
      {activeTab === "earnings" && <EarningsTab earnings={mockEarnings} currency={currency} />}
      {activeTab === "notifications" && <NotificationsTab />}
    </div>
  );
}

function GalleryTab({ works, currency }: { works: typeof artworks; currency: string }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-xl font-bold">My Artworks ({works.length})</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {works.map((work, i) => (
          <motion.div
            key={work.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-card rounded-lg border overflow-hidden"
          >
            <div className="aspect-[4/3] relative">
              <img src={work.image} alt={work.title} className="h-full w-full object-cover" />
              {work.sold && (
                <div className="absolute top-2 right-2 bg-destructive text-destructive-foreground text-xs font-bold px-2 py-1 rounded">SOLD</div>
              )}
              {!work.sold && (
                <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded">AVAILABLE</div>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-display font-semibold text-sm mb-1">{work.title}</h3>
              <p className="text-sm font-semibold text-primary mb-3">{convertPrice(work.price, currency)}</p>
              <div className="flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-xs font-medium bg-secondary text-secondary-foreground rounded-md hover:bg-muted transition-colors">
                  <Edit3 className="h-3 w-3" /> Edit
                </button>
                <button className="flex items-center justify-center gap-1 px-3 py-2 text-xs font-medium bg-secondary text-secondary-foreground rounded-md hover:bg-destructive hover:text-destructive-foreground transition-colors">
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function UploadTab() {
  const [price, setPrice] = useState(0);
  const commission = price * (COMMISSION_RATE / 100);
  const earnings = price - commission;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Artwork uploaded successfully! (Demo)");
  };

  return (
    <div className="max-w-xl">
      <h2 className="font-display text-xl font-bold mb-6">Upload New Artwork</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="border-2 border-dashed border-border rounded-lg p-10 text-center cursor-pointer hover:border-primary/50 transition-colors">
          <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">Click or drag to upload artwork image</p>
          <p className="text-xs text-muted-foreground mt-1">JPG, PNG, WebP up to 10MB</p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Title</label>
          <input type="text" placeholder="Artwork title" className="w-full px-3 py-2.5 rounded-md text-sm bg-secondary border-none focus:outline-none focus:ring-2 focus:ring-ring" required />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Description</label>
          <textarea placeholder="Describe your artwork..." rows={3} className="w-full px-3 py-2.5 rounded-md text-sm bg-secondary border-none focus:outline-none focus:ring-2 focus:ring-ring resize-none" required />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Category</label>
          <select className="w-full px-3 py-2.5 rounded-md text-sm bg-secondary border-none focus:outline-none focus:ring-2 focus:ring-ring" required>
            {categories.filter(c => c !== "All").map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Price (NLE)</label>
          <input
            type="number"
            min={0}
            placeholder="0"
            value={price || ""}
            onChange={e => setPrice(Number(e.target.value))}
            className="w-full px-3 py-2.5 rounded-md text-sm bg-secondary border-none focus:outline-none focus:ring-2 focus:ring-ring"
            required
          />
        </div>

        {price > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="bg-secondary rounded-lg p-4 space-y-2"
          >
            <h4 className="font-display font-semibold text-sm mb-2">Commission Breakdown</h4>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Price</span>
              <span>NLe {price.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Platform Fee ({COMMISSION_RATE}%)</span>
              <span className="text-destructive">- NLe {commission.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm font-bold border-t pt-2">
              <span>You Will Earn</span>
              <span className="text-primary">NLe {earnings.toLocaleString()}</span>
            </div>
          </motion.div>
        )}

        <button
          type="submit"
          className="w-full bg-primary text-primary-foreground py-3 rounded-md font-medium text-sm hover:opacity-90 transition-opacity"
        >
          Upload Artwork
        </button>
      </form>
    </div>
  );
}

function EarningsTab({ earnings, currency }: { earnings: typeof mockEarnings; currency: string }) {
  const stats = [
    { label: "Total Earnings", value: earnings.total, icon: TrendingUp, color: "text-primary" },
    { label: "Pending", value: earnings.pending, icon: Eye, color: "text-accent" },
    { label: "Completed", value: earnings.completed, icon: Package, color: "text-primary" },
    { label: "Withdrawable", value: earnings.withdrawable, icon: DollarSign, color: "text-primary" },
  ];

  return (
    <div>
      <h2 className="font-display text-xl font-bold mb-6">Earnings Overview</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-card rounded-lg border p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
              <span className="text-xs text-muted-foreground">{stat.label}</span>
            </div>
            <p className="font-display text-lg font-bold">{convertPrice(stat.value, currency)}</p>
          </motion.div>
        ))}
      </div>

      <div className="bg-card rounded-lg border p-6">
        <h3 className="font-display font-semibold mb-4">Recent Transactions</h3>
        <div className="space-y-3">
          {[
            { title: "Mother & Child - Sold", amount: 4950, status: "Completed", date: "Mar 20" },
            { title: "Rhythms of the Ancestors - Sold", amount: 2250, status: "Pending", date: "Mar 25" },
            { title: "Woven Heritage - Sold", amount: 2790, status: "Completed", date: "Mar 15" },
          ].map(tx => (
            <div key={tx.title} className="flex items-center justify-between py-2 border-b last:border-0">
              <div>
                <p className="text-sm font-medium">{tx.title}</p>
                <p className="text-xs text-muted-foreground">{tx.date}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-primary">{convertPrice(tx.amount, currency)}</p>
                <p className={`text-xs ${tx.status === "Completed" ? "text-primary" : "text-accent"}`}>{tx.status}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function NotificationsTab() {
  return (
    <div className="max-w-xl">
      <h2 className="font-display text-xl font-bold mb-6">Notifications</h2>
      <div className="space-y-2">
        {mockNotifications.map(notif => (
          <div
            key={notif.id}
            className={`flex items-center gap-3 p-4 rounded-lg border ${!notif.read ? "bg-secondary" : "bg-card"}`}
          >
            <div className={`h-2 w-2 rounded-full flex-shrink-0 ${!notif.read ? "bg-primary" : "bg-transparent"}`} />
            <div className="flex-1">
              <p className="text-sm">{notif.text}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{notif.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
