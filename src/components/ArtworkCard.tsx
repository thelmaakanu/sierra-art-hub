import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { Artwork, convertPrice } from "@/lib/data";
import { useCart } from "@/lib/cart";
import { motion } from "framer-motion";

export default function ArtworkCard({ artwork, index = 0 }: { artwork: Artwork; index?: number }) {
  const { currency } = useCart();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
    >
      <Link to={`/artwork/${artwork.id}`} className="group block">
        <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-muted">
          <img
            src={artwork.image}
            alt={artwork.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {artwork.sold && (
            <div className="absolute inset-0 bg-foreground/50 flex items-center justify-center">
              <span className="bg-background text-foreground font-display font-semibold px-4 py-2 rounded-md text-sm">SOLD</span>
            </div>
          )}
          <button
            className="absolute top-3 right-3 p-2 rounded-full bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background"
            onClick={e => { e.preventDefault(); }}
          >
            <Heart className="h-4 w-4 text-foreground" />
          </button>
        </div>
        <div className="mt-3 space-y-1">
          <h3 className="font-display font-semibold text-sm leading-tight">{artwork.title}</h3>
          <p className="text-xs text-muted-foreground">{artwork.artistName}</p>
          <p className="text-sm font-semibold text-primary">
            {convertPrice(artwork.price, currency)}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
