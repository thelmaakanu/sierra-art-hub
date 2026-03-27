import { useState } from "react";
import { Search } from "lucide-react";
import { artworks, artists, exhibitions } from "@/lib/data";
import ArtworkCard from "@/components/ArtworkCard";
import ArtistCard from "@/components/ArtistCard";
import { Link } from "react-router-dom";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const q = query.toLowerCase();

  const filteredArt = q ? artworks.filter(a => a.title.toLowerCase().includes(q) || a.category.toLowerCase().includes(q)) : [];
  const filteredArtists = q ? artists.filter(a => a.name.toLowerCase().includes(q)) : [];
  const filteredExhibitions = q ? exhibitions.filter(e => e.title.toLowerCase().includes(q)) : [];

  return (
    <div className="container py-12">
      <div className="max-w-xl mx-auto mb-12">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search artworks, artists, exhibitions..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-xl bg-card border text-base focus:outline-none focus:ring-2 focus:ring-primary/30"
            autoFocus
          />
        </div>
      </div>

      {q && filteredArtists.length > 0 && (
        <section className="mb-12">
          <h2 className="font-display text-xl font-bold mb-6">Artists</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            {filteredArtists.map((a, i) => <ArtistCard key={a.id} artist={a} index={i} />)}
          </div>
        </section>
      )}

      {q && filteredArt.length > 0 && (
        <section className="mb-12">
          <h2 className="font-display text-xl font-bold mb-6">Artworks</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {filteredArt.map((a, i) => <ArtworkCard key={a.id} artwork={a} index={i} />)}
          </div>
        </section>
      )}

      {q && filteredExhibitions.length > 0 && (
        <section>
          <h2 className="font-display text-xl font-bold mb-6">Exhibitions</h2>
          <div className="space-y-4">
            {filteredExhibitions.map(ex => (
              <Link key={ex.id} to="/exhibitions" className="block p-4 bg-card border rounded-lg hover:border-primary transition-colors">
                <h3 className="font-display font-semibold">{ex.title}</h3>
                <p className="text-sm text-muted-foreground">{ex.date} · {ex.location}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {q && filteredArt.length === 0 && filteredArtists.length === 0 && filteredExhibitions.length === 0 && (
        <p className="text-center text-muted-foreground py-16">No results found for "{query}"</p>
      )}
    </div>
  );
}
