import { artists } from "@/lib/data";
import ArtistCard from "@/components/ArtistCard";

export default function ArtistsPage() {
  return (
    <div className="container py-12">
      <div className="mb-10">
        <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">Our Artists</h1>
        <p className="text-muted-foreground">Verified Sierra Leonean creators sharing their art with the world</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-10">
        {artists.map((a, i) => <ArtistCard key={a.id} artist={a} index={i} />)}
      </div>
    </div>
  );
}
