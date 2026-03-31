import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { artworks as mockArtworks, categories, convertPrice } from "@/lib/data";
import { supabase } from "@/integrations/supabase/client";
import ArtworkCard from "@/components/ArtworkCard";
import { Artwork } from "@/lib/data";

type SortOption = "newest" | "price-low" | "price-high";

export default function Shop() {
  const [searchParams] = useSearchParams();
  const initialCat = searchParams.get("category") || "All";
  const [selectedCategory, setSelectedCategory] = useState(initialCat);
  const [sort, setSort] = useState<SortOption>("newest");
  const [dbArtworks, setDbArtworks] = useState<Artwork[]>([]);

  useEffect(() => {
    const fetchDbArtworks = async () => {
      const { data } = await supabase.from("artworks").select("*");
      if (data) {
        const profiles = await supabase.from("profiles").select("user_id, full_name");
        const profileMap = new Map((profiles.data || []).map(p => [p.user_id, p.full_name]));
        const mapped: Artwork[] = data.map(a => ({
          id: `db-${a.id}`,
          title: a.title,
          artistId: a.artist_id,
          artistName: profileMap.get(a.artist_id) || "Unknown Artist",
          price: Number(a.price),
          image: a.image_url || "",
          category: a.category,
          description: a.description || "",
          sold: a.sold,
        }));
        setDbArtworks(mapped);
      }
    };
    fetchDbArtworks();
  }, []);

  const allArtworks = [...mockArtworks, ...dbArtworks];
  let filtered = selectedCategory === "All"
    ? allArtworks
    : allArtworks.filter(a => a.category === selectedCategory);

  if (sort === "price-low") filtered = [...filtered].sort((a, b) => a.price - b.price);
  else if (sort === "price-high") filtered = [...filtered].sort((a, b) => b.price - a.price);

  return (
    <div className="container py-16">
      <div className="mb-12">
        <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-3">Shop</h1>
        <p className="text-muted-foreground text-lg">Browse authentic Sierra Leonean artworks</p>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                selectedCategory === cat
                  ? "bg-foreground text-background"
                  : "bg-secondary text-foreground hover:bg-foreground/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <select
          value={sort}
          onChange={e => setSort(e.target.value as SortOption)}
          className="text-sm bg-secondary rounded-lg px-4 py-2.5 border-none"
        >
          <option value="newest">Newest</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
        </select>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-7">
        {filtered.map((a, i) => (
          <ArtworkCard key={a.id} artwork={a} index={i} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-muted-foreground py-24">No artworks found in this category.</p>
      )}
    </div>
  );
}
