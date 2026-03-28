import { motion } from "framer-motion";
import { Palette, Globe, Heart, ShieldCheck } from "lucide-react";

export default function About() {
  return (
    <div className="container py-12">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-6">About ArtVault</h1>
          <p className="text-lg text-muted-foreground leading-relaxed mb-12">
            ArtVault is Sierra Leone's premier online art marketplace — a platform built to empower local artists 
            and connect them with art lovers across the globe.
          </p>
        </motion.div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} viewport={{ once: true }} className="bg-card rounded-xl border p-8">
            <Heart className="h-8 w-8 text-primary mb-4" />
            <h2 className="font-display text-xl font-bold mb-3">Our Mission</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              To give Sierra Leonean artists a global stage, ensuring every brushstroke, carving, and textile 
              weave reaches the audience it deserves — while preserving the rich cultural heritage of West Africa.
            </p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} viewport={{ once: true }} className="bg-card rounded-xl border p-8">
            <Globe className="h-8 w-8 text-primary mb-4" />
            <h2 className="font-display text-xl font-bold mb-3">Our Vision</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              To become the leading marketplace for authentic African art — a platform where tradition meets 
              innovation, and where every purchase directly supports the creative economy of Sierra Leone.
            </p>
          </motion.div>
        </div>

        {/* Values */}
        <h2 className="font-display text-2xl font-bold mb-8 text-center">What We Stand For</h2>
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {[
            { icon: ShieldCheck, title: "Authenticity", desc: "Every artist is verified as a Sierra Leonean creator. No fakes, no reproductions." },
            { icon: Palette, title: "Creativity", desc: "We celebrate the diverse artistic traditions — from Mende masks to contemporary canvas." },
            { icon: Globe, title: "Accessibility", desc: "Art should have no borders. We ship worldwide and support multiple currencies." },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="text-center p-6"
            >
              <div className="inline-flex p-3 rounded-full bg-secondary mb-4">
                <item.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-display font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Story */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="bg-secondary/50 rounded-xl p-8 md:p-12">
          <h2 className="font-display text-2xl font-bold mb-4">Our Story</h2>
          <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
            <p>
              ArtVault was born from a simple observation: Sierra Leone is home to some of the most talented 
              and culturally rich artists in West Africa, yet many lack the platform to reach international buyers.
            </p>
            <p>
              We built ArtVault to bridge that gap. By combining a curated marketplace with artist verification, 
              community features, and global shipping, we're creating an ecosystem where art and artists thrive.
            </p>
            <p>
              Every artwork on ArtVault tells a story — of ancestral traditions, contemporary visions, and the 
              vibrant spirit of Sierra Leone. When you purchase from ArtVault, you're not just buying art — 
              you're investing in a community.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
