import { Link } from "react-router-dom";
import { ArrowRight, Palette, Globe, ShieldCheck, Star, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { artists, artworks, exhibitions, categories } from "@/lib/data";
import ArtworkCard from "@/components/ArtworkCard";
import ArtistCard from "@/components/ArtistCard";
import heroImg from "@/assets/hero-art.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: i * 0.12, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const Index = () => {
  const featuredArt = artworks.filter(a => !a.sold).slice(0, 8);
  const trendingArt = [...artworks].sort((a, b) => b.price - a.price).slice(0, 4);
  const featuredArtists = artists.slice(0, 5);
  const upcomingExhibitions = exhibitions.filter(e => e.upcoming);

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[100vh] min-h-[700px] overflow-hidden">
        <img src={heroImg} alt="Sierra Leonean art" width={1920} height={1080} className="absolute inset-0 h-full w-full object-cover scale-105" />
        <div className="absolute inset-0" style={{ background: "var(--hero-overlay)" }} />
        <div className="relative container h-full flex flex-col justify-end pb-24 md:pb-32">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="max-w-3xl"
          >
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-background/50 font-body text-sm tracking-[0.35em] uppercase mb-6 font-medium"
            >
              Sierra Leone's Premier Art Marketplace
            </motion.p>
            <h1 className="font-display text-5xl md:text-7xl lg:text-[5.5rem] font-bold text-background leading-[1.02] mb-8 tracking-[-0.02em]">
              Discover<br />Authentic<br />African Art
            </h1>
            <p className="text-background/60 text-base md:text-lg max-w-md mb-12 leading-relaxed font-light">
              Connect directly with verified Sierra Leonean artists. Every piece tells a story of heritage and brilliance.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/shop"
                className="inline-flex items-center gap-3 bg-background text-foreground px-8 py-4 rounded-2xl font-semibold text-sm hover:bg-background/90 transition-all duration-300 active:scale-[0.97]"
              >
                Explore Collection <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center gap-3 border border-background/25 text-background px-8 py-4 rounded-2xl font-medium text-sm hover:bg-background/10 transition-all duration-300"
              >
                Join as Artist
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Value Props */}
      <section className="py-28 border-b">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: ShieldCheck, title: "Verified Artists", desc: "Every artist is authenticated as a Sierra Leonean creator with rigorous verification" },
              { icon: Palette, title: "Authentic Art", desc: "Original works spanning paintings, sculptures, textiles and more from talented creators" },
              { icon: Globe, title: "Global Shipping", desc: "We deliver authentic art to collectors worldwide with secure packaging and tracking" },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                variants={fadeUp}
                viewport={{ once: true }}
                className="apple-card p-10 text-center group"
              >
                <div className="mx-auto w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mb-6 group-hover:bg-foreground group-hover:text-background transition-all duration-500">
                  <item.icon className="h-7 w-7" />
                </div>
                <h3 className="font-display font-bold text-lg mb-3">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Artists */}
      <section className="py-28">
        <div className="container">
          <motion.div initial="hidden" whileInView="visible" variants={fadeUp} custom={0} viewport={{ once: true }} className="flex items-end justify-between mb-16">
            <div>
              <p className="section-subtitle">Meet the Creators</p>
              <h2 className="section-title">Featured Artists</h2>
            </div>
            <Link to="/artists" className="text-sm font-semibold text-foreground hover:opacity-60 flex items-center gap-2 transition-opacity">
              View All <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {featuredArtists.map((a, i) => (
              <ArtistCard key={a.id} artist={a} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Trending Artworks */}
      <section className="py-28 bg-secondary/50">
        <div className="container">
          <motion.div initial="hidden" whileInView="visible" variants={fadeUp} custom={0} viewport={{ once: true }} className="flex items-end justify-between mb-16">
            <div>
              <p className="section-subtitle">Curated Selection</p>
              <h2 className="section-title">Trending Now</h2>
            </div>
            <Link to="/shop" className="text-sm font-semibold text-foreground hover:opacity-60 flex items-center gap-2 transition-opacity">
              Shop All <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {trendingArt.map((a, i) => (
              <ArtworkCard key={a.id} artwork={a} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-28">
        <div className="container">
          <motion.div initial="hidden" whileInView="visible" variants={fadeUp} custom={0} viewport={{ once: true }} className="flex items-end justify-between mb-16">
            <div>
              <p className="section-subtitle">Fresh Collection</p>
              <h2 className="section-title">New Arrivals</h2>
            </div>
            <Link to="/shop" className="text-sm font-semibold text-foreground hover:opacity-60 flex items-center gap-2 transition-opacity">
              View All <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {featuredArt.slice(4, 8).map((a, i) => (
              <ArtworkCard key={a.id} artwork={a} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-28 bg-secondary/50">
        <div className="container">
          <motion.div initial="hidden" whileInView="visible" variants={fadeUp} custom={0} viewport={{ once: true }} className="text-center mb-16">
            <p className="section-subtitle">Browse By</p>
            <h2 className="section-title">Categories</h2>
          </motion.div>
          <div className="flex flex-wrap justify-center gap-3">
            {categories.filter(c => c !== "All").map(cat => (
              <Link
                key={cat}
                to={`/shop?category=${cat}`}
                className="px-8 py-4 rounded-2xl bg-background border text-foreground font-medium text-sm hover:bg-foreground hover:text-background transition-all duration-300 active:scale-[0.97]"
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Exhibitions */}
      {upcomingExhibitions.length > 0 && (
        <section className="py-28">
          <div className="container">
            <motion.div initial="hidden" whileInView="visible" variants={fadeUp} custom={0} viewport={{ once: true }} className="flex items-end justify-between mb-16">
              <div>
                <p className="section-subtitle">Upcoming Events</p>
                <h2 className="section-title">Featured Exhibitions</h2>
              </div>
              <Link to="/exhibitions" className="text-sm font-semibold text-foreground hover:opacity-60 flex items-center gap-2 transition-opacity">
                View All <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </motion.div>
            <div className="grid md:grid-cols-2 gap-8">
              {upcomingExhibitions.map((ex, i) => (
                <motion.div
                  key={ex.id}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  variants={fadeUp}
                  viewport={{ once: true }}
                  className="group apple-card overflow-hidden"
                >
                  <div className="aspect-[16/9] overflow-hidden">
                    <img src={ex.image} alt={ex.title} loading="lazy" className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                  </div>
                  <div className="p-8">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">{ex.date}</p>
                    <h3 className="font-display text-xl font-bold mb-2">{ex.title}</h3>
                    <p className="text-sm text-muted-foreground mb-1">{ex.location}</p>
                    <p className="text-sm text-muted-foreground mb-6 line-clamp-2">{ex.description}</p>
                    <Link to="/exhibitions" className="text-sm font-semibold text-foreground hover:opacity-60 inline-flex items-center gap-2 transition-opacity">
                      Learn More <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-32 bg-foreground text-background">
        <div className="container text-center max-w-2xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" variants={fadeUp} custom={0} viewport={{ once: true }}>
            <Sparkles className="h-8 w-8 mx-auto mb-8 text-background/40" />
            <h2 className="font-display text-4xl md:text-6xl font-bold mb-6 tracking-tight leading-[1.08]">
              Ready to Start<br />Your Collection?
            </h2>
            <p className="text-background/50 text-lg mb-12 leading-relaxed">
              Join thousands of art lovers supporting Sierra Leonean artists and owning a piece of authentic African heritage.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/shop" className="inline-flex items-center gap-3 bg-background text-foreground px-8 py-4 rounded-2xl font-semibold text-sm hover:opacity-90 transition-all duration-300 active:scale-[0.97]">
                Browse Collection <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/register" className="inline-flex items-center gap-3 border border-background/20 text-background px-8 py-4 rounded-2xl font-medium text-sm hover:bg-background/10 transition-all duration-300">
                Create Account
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Index;
