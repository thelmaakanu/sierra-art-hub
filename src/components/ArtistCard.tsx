import { Link } from "react-router-dom";
import { BadgeCheck } from "lucide-react";
import { Artist } from "@/lib/data";
import { motion } from "framer-motion";

export default function ArtistCard({ artist, index = 0 }: { artist: Artist; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      viewport={{ once: true }}
    >
      <Link to={`/artist/${artist.id}`} className="group block text-center">
        <div className="relative w-36 h-36 md:w-44 md:h-44 mx-auto rounded-full overflow-hidden ring-2 ring-border group-hover:ring-foreground transition-all duration-300">
          <img src={artist.image} alt={artist.name} loading="lazy" className="h-full w-full object-cover" />
        </div>
        <div className="mt-5">
          <h3 className="font-display font-semibold text-base flex items-center justify-center gap-1.5">
            {artist.name}
            {artist.verified && <BadgeCheck className="h-4 w-4 text-foreground" />}
          </h3>
          <p className="text-xs text-muted-foreground mt-1">{artist.followers.toLocaleString()} followers · {artist.artworks} works</p>
        </div>
      </Link>
    </motion.div>
  );
}
