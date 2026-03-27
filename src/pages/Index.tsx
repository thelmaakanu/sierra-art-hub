import { Link } from "react-router-dom";
import { ArrowRight, Palette, Globe, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { artists, artworks, exhibitions, categories } from "@/lib/data";
import ArtworkCard from "@/components/ArtworkCard";
import ArtistCard from "@/components/ArtistCard";
import heroImg from "@/assets/hero-art.jpg";

const Index = () => {
  const featuredArt = artworks.filter(a => !a.sold).slice(0, 4);
  const upcomingExhibition = exhibitions.find(e => e.upcoming);

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[85vh] min-h-[600px] overflow-hidden">
        <img src={heroImg} alt="Sierra Leonean art" width={1920} height={1080} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0" style={{ background: "var(--hero-overlay)" }} />
        <div className="relative container h-full flex flex-col justify-end pb-20 md:pb-28">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-2xl"
          >
            <p className="text-primary-foreground/70 font-body text-sm tracking-[0.2em] uppercase mb-4">
              Sierra Leone's Premier Art Marketplace
            </p>
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground leading-[1.1] mb-6">
              Discover Authentic African Art
            </h1>
            <p className="text-primary-foreground/80 text-base md:text-lg max-w-lg mb-8 leading-relaxed">
              Connect directly with verified Sierra Leonean artists. Every piece tells a story of heritage, culture, and creative brilliance.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-7 py-3.5 rounded-md font-medium text-sm hover:opacity-90 transition-opacity"
              >
                Explore Collection <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/artists"
                className="inline-flex items-center gap-2 border border-primary-foreground/30 text-primary-foreground px-7 py-3.5 rounded-md font-medium text-sm hover:bg-primary-foreground/10 transition-colors"
              >
                Meet the Artists
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Value Props */}
      <section className="py-16 border-b">
        <div className="container grid grid-cols-1 md:grid-cols-3 gap-8">
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
              className="flex items-start gap-4"
            >
              <div className="p-3 rounded-lg bg-secondary">
                <item.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-base mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Artists */}
      <section className="py-20">
        <div className="container">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2">Meet the Creators</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold">Featured Artists</h2>
            </div>
            <Link to="/artists" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
              View All <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            {artists.map((a, i) => (
              <ArtistCard key={a.id} artist={a} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Trending Artworks */}
      <section className="py-20 bg-card">
        <div className="container">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2">Curated Selection</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold">Trending Artworks</h2>
            </div>
            <Link to="/shop" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
              Shop All <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {featuredArt.map((a, i) => (
              <ArtworkCard key={a.id} artwork={a} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-12">
            <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2">Browse By</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold">Categories</h2>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {categories.filter(c => c !== "All").map(cat => (
              <Link
                key={cat}
                to={`/shop?category=${cat}`}
                className="px-8 py-4 rounded-lg bg-secondary text-secondary-foreground font-display font-semibold text-sm hover:bg-primary hover:text-primary-foreground transition-colors duration-300"
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Exhibition CTA */}
      {upcomingExhibition && (
        <section className="py-20 bg-card">
          <div className="container">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2">Upcoming</p>
                <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">{upcomingExhibition.title}</h2>
                <p className="text-muted-foreground mb-2">{upcomingExhibition.date}</p>
                <p className="text-muted-foreground mb-2">{upcomingExhibition.location}</p>
                <p className="text-sm text-muted-foreground mb-6">{upcomingExhibition.description}</p>
                <Link
                  to="/exhibitions"
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-md font-medium text-sm hover:opacity-90 transition-opacity"
                >
                  View Exhibitions <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="rounded-xl overflow-hidden aspect-[4/3]"
              >
                <img src={upcomingExhibition.image} alt={upcomingExhibition.title} loading="lazy" className="h-full w-full object-cover" />
              </motion.div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Index;
