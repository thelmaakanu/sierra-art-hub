import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { artworks, categories } from "@/lib/data";
import ArtworkCard from "@/components/ArtworkCard";

type SortOption = "newest" | "price-low" | "price-high" | "popular";

export default function Shop() {
  const [searchParams] = useSearchParams();
  const initialCat = searchParams.get("category") || "All";
  const [selectedCategory, setSelectedCategory] = useState(initialCat);
  const [sort, setSort] = useState<SortOption>("newest");

  let filtered = selectedCategory === "All"
    ? artworks
    : artworks.filter(a => a.category === selectedCategory);

  if (sort === "price-low") filtered = [...filtered].sort((a, b) => a.price - b.price);
  else if (sort === "price-high") filtered = [...filtered].sort((a, b) => b.price - a.price);

  return (
    <div className="container py-12">
      <div className="mb-10">
        <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">Shop</h1>
        <p className="text-muted-foreground">Browse authentic Sierra Leonean artworks</p>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedCategory === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-muted"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <select
          value={sort}
          onChange={e => setSort(e.target.value as SortOption)}
          className="text-sm bg-secondary text-secondary-foreground rounded-md px-3 py-2 border-none"
        >
          <option value="newest">Newest</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="popular">Most Popular</option>
        </select>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filtered.map((a, i) => (
          <ArtworkCard key={a.id} artwork={a} index={i} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-muted-foreground py-20">No artworks found in this category.</p>
      )}
    </div>
  );
}
