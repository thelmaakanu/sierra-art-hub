import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ShoppingBag, Heart, Share2, BadgeCheck, Copy, Send } from "lucide-react";
import { artworks as mockArtworks, artists, convertPrice, Artwork } from "@/lib/data";
import { useCart } from "@/lib/cart";
import { useWishlist } from "@/lib/wishlist";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import ArtworkCard from "@/components/ArtworkCard";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";

export default function ArtworkDetail() {
  const { id } = useParams();
  const { addItem, currency } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { user } = useAuth();
  const [shareOpen, setShareOpen] = useState(false);
  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    const loadArtwork = async () => {
      setLoading(true);
      // Check if it's a DB artwork
      if (id?.startsWith("db-")) {
        const dbId = id.replace("db-", "");
        const { data } = await supabase.from("artworks").select("*").eq("id", dbId).single();
        if (data) {
          const { data: profileData } = await supabase.from("profiles").select("full_name").eq("user_id", data.artist_id).single();
          setArtwork({
            id: `db-${data.id}`,
            title: data.title,
            artistId: data.artist_id,
            artistName: profileData?.full_name || "Unknown Artist",
            price: Number(data.price),
            image: data.image_url || "",
            category: data.category,
            description: data.description || "",
            sold: data.sold,
          });
        }
      } else {
        const found = mockArtworks.find(a => a.id === id);
        setArtwork(found || null);
      }
      setLoading(false);
    };
    loadArtwork();
  }, [id]);

  if (loading) return <div className="container py-20 text-center text-muted-foreground">Loading...</div>;

  if (!artwork) {
    return (
      <div className="container py-20 text-center">
        <p className="text-muted-foreground">Artwork not found.</p>
        <Link to="/shop" className="text-primary mt-4 inline-block">Back to Shop</Link>
      </div>
    );
  }

  const artist = artists.find(a => a.id === artwork.artistId);
  const moreFromArtist = mockArtworks.filter(a => a.artistId === artwork.artistId && a.id !== artwork.id).slice(0, 4);
  const similarArt = mockArtworks.filter(a => a.category === artwork.category && a.id !== artwork.id).slice(0, 4);
  const wishlisted = isWishlisted(artwork.id);
  const shareUrl = window.location.href;

  const handleBuyNow = async () => {
    if (!user) {
      toast.error("Please log in to purchase");
      return;
    }
    if (artwork.sold) return;

    setPurchasing(true);

    // If it's a DB artwork, mark as sold
    if (artwork.id.startsWith("db-")) {
      const dbId = artwork.id.replace("db-", "");
      const { error } = await supabase.from("artworks").update({ sold: true }).eq("id", dbId);
      if (error) {
        toast.error("Purchase failed. Please try again.");
        setPurchasing(false);
        return;
      }
      setArtwork({ ...artwork, sold: true });
    }

    toast.success(`🎉 You've purchased "${artwork.title}"!`);
    setPurchasing(false);
  };

  const handleAddToCart = () => {
    addItem(artwork);
    toast.success(`"${artwork.title}" added to cart`);
  };

  return (
    <div className="container py-8">
      <Link to="/shop" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8">
        <ArrowLeft className="h-4 w-4" /> Back to Shop
      </Link>

      <div className="grid md:grid-cols-2 gap-6 md:gap-10 mb-20">
        <div className="rounded-xl overflow-hidden bg-muted aspect-[3/4]">
          <img src={artwork.image} alt={artwork.title} className="h-full w-full object-cover" />
        </div>

        <div className="flex flex-col justify-center">
          <span className="text-xs tracking-[0.15em] uppercase text-muted-foreground mb-2">{artwork.category}</span>
          <h1 className="font-display text-2xl md:text-3xl lg:text-4xl font-bold mb-3">{artwork.title}</h1>

          {artist && (
            <Link to={`/artist/${artist.id}`} className="flex items-center gap-2 mb-6">
              <img src={artist.image} alt={artist.name} className="h-8 w-8 rounded-full object-cover" />
              <span className="text-sm font-medium">{artist.name}</span>
              {artist.verified && <BadgeCheck className="h-4 w-4 text-primary" />}
            </Link>
          )}
          {!artist && <p className="text-sm text-muted-foreground mb-6">by {artwork.artistName}</p>}

          <p className="text-muted-foreground text-sm leading-relaxed mb-8">{artwork.description}</p>

          <div className="mb-8">
            <p className="font-display text-2xl md:text-3xl font-bold text-primary">
              {convertPrice(artwork.price, currency)}
            </p>
            {currency !== "NLE" && (
              <p className="text-xs text-muted-foreground mt-1">{convertPrice(artwork.price, "NLE")}</p>
            )}
          </div>

          <div className="flex flex-col gap-3">
            {artwork.sold ? (
              <div className="bg-muted text-muted-foreground px-6 py-3.5 rounded-md font-medium text-sm text-center">
                Sold
              </div>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={handleBuyNow}
                  disabled={purchasing}
                  className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3.5 rounded-md font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {purchasing ? "Processing..." : "Buy Now"}
                </button>
                <button
                  onClick={handleAddToCart}
                  className="flex items-center justify-center gap-2 border border-border px-6 py-3.5 rounded-md font-medium text-sm hover:bg-secondary transition-colors"
                >
                  <ShoppingBag className="h-4 w-4" /> Add to Cart
                </button>
              </div>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => { toggleWishlist(artwork.id); toast.success(wishlisted ? "Removed from wishlist" : "Added to wishlist"); }}
                className={`flex-1 flex items-center justify-center gap-2 p-3.5 rounded-md border transition-colors text-sm ${wishlisted ? "bg-primary/10 border-primary text-primary" : "hover:bg-secondary"}`}
              >
                <Heart className={`h-4 w-4 ${wishlisted ? "fill-primary text-primary" : ""}`} />
                {wishlisted ? "Wishlisted" : "Add to Wishlist"}
              </button>
              <div className="relative">
                <button onClick={() => setShareOpen(!shareOpen)} className="p-3.5 rounded-md border hover:bg-secondary transition-colors">
                  <Share2 className="h-4 w-4" />
                </button>
                <AnimatePresence>
                  {shareOpen && (
                    <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute right-0 top-14 bg-background border rounded-lg p-2 shadow-lg z-10 w-48">
                      <button onClick={() => { navigator.clipboard.writeText(shareUrl); toast.success("Link copied!"); setShareOpen(false); }} className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-secondary rounded-md">
                        <Copy className="h-3.5 w-3.5" /> Copy Link
                      </button>
                      <a href={`https://wa.me/?text=${encodeURIComponent(`Check out "${artwork.title}" on ArtVault: ${shareUrl}`)}`} target="_blank" rel="noopener noreferrer" onClick={() => setShareOpen(false)} className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-secondary rounded-md">
                        <Send className="h-3.5 w-3.5" /> WhatsApp
                      </a>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>

      {moreFromArtist.length > 0 && (
        <section className="mb-20">
          <h2 className="font-display text-2xl font-bold mb-8">More from {artwork.artistName}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {moreFromArtist.map((a, i) => <ArtworkCard key={a.id} artwork={a} index={i} />)}
          </div>
        </section>
      )}

      {similarArt.length > 0 && (
        <section>
          <h2 className="font-display text-2xl font-bold mb-8">Similar Artworks</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {similarArt.map((a, i) => <ArtworkCard key={a.id} artwork={a} index={i} />)}
          </div>
        </section>
      )}
    </div>
  );
}
