import { exhibitions } from "@/lib/data";
import { CalendarDays, MapPin } from "lucide-react";
import { motion } from "framer-motion";

export default function ExhibitionsPage() {
  const upcoming = exhibitions.filter(e => e.upcoming);
  const past = exhibitions.filter(e => !e.upcoming);

  const ExhibitionCard = ({ ex, i }: { ex: typeof exhibitions[0]; i: number }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: i * 0.1 }}
      viewport={{ once: true }}
      className="group rounded-xl overflow-hidden bg-card border"
    >
      <div className="aspect-[16/9] overflow-hidden">
        <img src={ex.image} alt={ex.title} loading="lazy" className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" />
      </div>
      <div className="p-6">
        <h3 className="font-display text-xl font-bold mb-3">{ex.title}</h3>
        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
          <span className="flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" /> {ex.date}</span>
          <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {ex.location}</span>
        </div>
        <p className="text-sm text-muted-foreground mb-4">{ex.description}</p>
        <div className="flex flex-wrap gap-2">
          {ex.featuredArtists.map(a => (
            <span key={a} className="text-xs bg-secondary text-secondary-foreground px-3 py-1 rounded-full">{a}</span>
          ))}
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="container py-12">
      <div className="mb-10">
        <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">Exhibitions</h1>
        <p className="text-muted-foreground">Discover art events and gallery showings across Sierra Leone</p>
      </div>

      {upcoming.length > 0 && (
        <section className="mb-16">
          <h2 className="font-display text-2xl font-bold mb-6">Upcoming</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {upcoming.map((ex, i) => <ExhibitionCard key={ex.id} ex={ex} i={i} />)}
          </div>
        </section>
      )}

      {past.length > 0 && (
        <section>
          <h2 className="font-display text-2xl font-bold mb-6">Past</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {past.map((ex, i) => <ExhibitionCard key={ex.id} ex={ex} i={i} />)}
          </div>
        </section>
      )}
    </div>
  );
}
