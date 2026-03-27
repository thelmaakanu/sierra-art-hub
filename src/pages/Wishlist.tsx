import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { artworks } from "@/lib/data";
import { useWishlist } from "@/lib/wishlist";
import ArtworkCard from "@/components/ArtworkCard";

export default function WishlistPage() {
  const { wishlist } = useWishlist();
  const wishlisted = artworks.filter(a => wishlist.includes(a.id));

  if (wishlisted.length === 0) {
    return (
      <div className="container py-20 text-center">
        <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h1 className="font-display text-3xl font-bold mb-3">Your Wishlist is Empty</h1>
        <p className="text-muted-foreground mb-8">Save artworks you love for later.</p>
        <Link to="/shop" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-md font-medium text-sm">
          Browse Art
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">Wishlist</h1>
      <p className="text-muted-foreground mb-8">{wishlisted.length} saved {wishlisted.length === 1 ? "artwork" : "artworks"}</p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {wishlisted.map((a, i) => (
          <ArtworkCard key={a.id} artwork={a} index={i} />
        ))}
      </div>
    </div>
  );
}
