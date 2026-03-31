import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-foreground text-background/70 mt-24">
      <div className="container py-16 md:py-20 grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-12">
        <div className="col-span-2 md:col-span-1">
          <h3 className="font-display text-2xl font-bold text-background mb-5">ArtVault</h3>
          <p className="text-sm leading-relaxed text-background/50">
            Connecting Sierra Leonean artists with the world. Authentic art, verified creators.
          </p>
        </div>
        <div>
          <h4 className="font-display font-semibold text-background mb-5 text-sm tracking-wide uppercase">Explore</h4>
          <div className="space-y-3 text-sm">
            <Link to="/shop" className="block hover:text-background transition-colors">Shop</Link>
            <Link to="/artists" className="block hover:text-background transition-colors">Artists</Link>
            <Link to="/exhibitions" className="block hover:text-background transition-colors">Exhibitions</Link>
            <Link to="/community" className="block hover:text-background transition-colors">Community</Link>
          </div>
        </div>
        <div>
          <h4 className="font-display font-semibold text-background mb-5 text-sm tracking-wide uppercase">Company</h4>
          <div className="space-y-3 text-sm">
            <Link to="/about" className="block hover:text-background transition-colors">About</Link>
            <Link to="/contact" className="block hover:text-background transition-colors">Contact</Link>
          </div>
        </div>
        <div>
          <h4 className="font-display font-semibold text-background mb-5 text-sm tracking-wide uppercase">Newsletter</h4>
          <p className="text-sm text-background/50 mb-4">Get updates on new artists and exhibitions.</p>
          <div className="flex">
            <input type="email" placeholder="Your email" className="flex-1 min-w-0 px-4 py-2.5 rounded-l-full text-sm bg-background/10 border border-background/15 text-background placeholder:text-background/30 focus:outline-none" />
            <button className="px-5 py-2.5 bg-background text-foreground rounded-r-full text-sm font-medium hover:opacity-90 transition-opacity whitespace-nowrap">
              Join
            </button>
          </div>
        </div>
      </div>
      <div className="border-t border-background/10 py-7 text-center text-xs text-background/30">
        © 2026 ArtVault. All rights reserved. Supporting Sierra Leonean Art Worldwide.
      </div>
    </footer>
  );
}
