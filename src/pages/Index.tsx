import { Link } from "react-router-dom";
import { ArrowRight, Palette, Globe, ShieldCheck, Star } from "lucide-react";
import { motion } from "framer-motion";
import { artists, artworks, exhibitions, categories } from "@/lib/data";
import ArtworkCard from "@/components/ArtworkCard";
import ArtistCard from "@/components/ArtistCard";
import heroImg from "@/assets/hero-art.jpg";

const Index = () => {
  const featuredArt = artworks.filter(a => !a.sold).slice(0, 8);
  const trendingArt = [...artworks].sort((a, b) => b.price - a.price).slice(0, 4);
  const featuredArtists = artists.slice(0, 5);
  const upcomingExhibitions = exhibitions.filter(e => e.upcoming);

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[90vh] min-h-[600px] overflow-hidden">
        <img src={heroImg} alt="Sierra Leonean art" width={1920} height={1080} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0" style={{ background: "var(--hero-overlay)" }} />
        <div className="relative container h-full flex flex-col justify-center items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="max-w-3xl"
          >
            <p className="text-white/60 font-body text-sm tracking-[0.3em] uppercase mb-6">
              Sierra Leone's Premier Art Marketplace
            </p>
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-[1.05] mb-8 tracking-tight">
              Discover Authentic African Art
            </h1>
            <p className="text-white/70 text-base md:text-lg max-w-xl mx-auto mb-10 leading-relaxed">
              Connect directly with verified Sierra Leonean artists. Every piece tells a story of heritage, culture, and creative brilliance.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 rounded-full font-medium text-sm hover:bg-white/90 transition-colors"
              >
                Explore Collection <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 border border-white/30 text-white px-8 py-4 rounded-full font-medium text-sm hover:bg-white/10 transition-colors"
              >
                Join as Artist
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Value Props */}
      <section className="py-20 border-b">
        <div className="container grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { icon: ShieldCheck, title: "Verified Artists", desc: "Every artist is authenticated as a Sierra Leonean creator" },
            { icon: Palette, title: "Authentic Art", desc: "Original works spanning paintings, sculptures, textiles & more" },
            { icon: Globe, title: "Global Shipping", desc: "We deliver authentic art to collectors worldwide" },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="mx-auto w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center mb-5">
                <item.icon className="h-6 w-6 text-foreground" />
              </div>
              <h3 className="font-display font-semibold text-lg mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Artists */}
      <section className="py-24">
        <div className="container">
          <div className="flex items-end justify-between mb-14">
            <div>
              <p className="text-xs tracking-[0.25em] uppercase text-muted-foreground mb-3">Meet the Creators</p>
              <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight">Featured Artists</h2>
            </div>
            <Link to="/artists" className="text-sm font-medium text-foreground hover:opacity-70 flex items-center gap-1 transition-opacity">
              View All <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {featuredArtists.map((a, i) => (
              <ArtistCard key={a.id} artist={a} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Trending Artworks */}
      <section className="py-24 bg-secondary/50">
        <div className="container">
          <div className="flex items-end justify-between mb-14">
            <div>
              <p className="text-xs tracking-[0.25em] uppercase text-muted-foreground mb-3">Curated Selection</p>
              <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight">Trending Artworks</h2>
            </div>
            <Link to="/shop" className="text-sm font-medium text-foreground hover:opacity-70 flex items-center gap-1 transition-opacity">
              Shop All <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {trendingArt.map((a, i) => (
              <ArtworkCard key={a.id} artwork={a} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-24">
        <div className="container">
          <div className="flex items-end justify-between mb-14">
            <div>
              <p className="text-xs tracking-[0.25em] uppercase text-muted-foreground mb-3">Fresh Collection</p>
              <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight">New Arrivals</h2>
            </div>
            <Link to="/shop" className="text-sm font-medium text-foreground hover:opacity-70 flex items-center gap-1 transition-opacity">
              View All <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {featuredArt.slice(4, 8).map((a, i) => (
              <ArtworkCard key={a.id} artwork={a} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-24 bg-secondary/50">
        <div className="container">
          <div className="text-center mb-14">
            <p className="text-xs tracking-[0.25em] uppercase text-muted-foreground mb-3">Browse By</p>
            <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight">Categories</h2>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {categories.filter(c => c !== "All").map(cat => (
              <Link
                key={cat}
                to={`/shop?category=${cat}`}
                className="px-8 py-4 rounded-full bg-background border text-foreground font-medium text-sm hover:bg-foreground hover:text-background transition-all duration-300"
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Exhibitions */}
      {upcomingExhibitions.length > 0 && (
        <section className="py-24">
          <div className="container">
            <div className="flex items-end justify-between mb-14">
              <div>
                <p className="text-xs tracking-[0.25em] uppercase text-muted-foreground mb-3">Upcoming Events</p>
                <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight">Featured Exhibitions</h2>
              </div>
              <Link to="/exhibitions" className="text-sm font-medium text-foreground hover:opacity-70 flex items-center gap-1 transition-opacity">
                View All <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {upcomingExhibitions.map((ex, i) => (
                <motion.div
                  key={ex.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.15 }}
                  viewport={{ once: true }}
                  className="group rounded-2xl overflow-hidden border hover:shadow-xl transition-shadow duration-500"
                >
                  <div className="aspect-[16/9] overflow-hidden">
                    <img src={ex.image} alt={ex.title} loading="lazy" className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  </div>
                  <div className="p-7">
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">{ex.date}</p>
                    <h3 className="font-display text-xl font-bold mb-2">{ex.title}</h3>
                    <p className="text-sm text-muted-foreground mb-1">{ex.location}</p>
                    <p className="text-sm text-muted-foreground mb-5 line-clamp-2">{ex.description}</p>
                    <Link to="/exhibitions" className="text-sm font-medium text-foreground hover:opacity-70 inline-flex items-center gap-1 transition-opacity">
                      Learn More <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-28 bg-foreground text-background">
        <div className="container text-center max-w-2xl mx-auto">
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-5 tracking-tight">Ready to Start Your Collection?</h2>
          <p className="text-background/60 text-lg mb-10">
            Join thousands of art lovers supporting Sierra Leonean artists and owning a piece of authentic African heritage.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/shop" className="inline-flex items-center gap-2 bg-background text-foreground px-8 py-4 rounded-full font-medium text-sm hover:opacity-90 transition-opacity">
              Browse Collection <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/register" className="inline-flex items-center gap-2 border border-background/30 text-background px-8 py-4 rounded-full font-medium text-sm hover:bg-background/10 transition-colors">
              Create Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
