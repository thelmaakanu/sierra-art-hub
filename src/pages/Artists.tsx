import { artists } from "@/lib/data";
import ArtistCard from "@/components/ArtistCard";

export default function ArtistsPage() {
  return (
    <div className="container py-16">
      <div className="mb-12">
        <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-3">Our Artists</h1>
        <p className="text-muted-foreground text-lg">Verified Sierra Leonean creators sharing their art with the world</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
        {artists.map((a, i) => <ArtistCard key={a.id} artist={a} index={i} />)}
      </div>
    </div>
  );
}
