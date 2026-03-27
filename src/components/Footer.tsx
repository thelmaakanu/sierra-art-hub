import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-foreground text-background/80 mt-20">
      <div className="container py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <h3 className="font-display text-xl font-bold text-background mb-4">ArtVault</h3>
          <p className="text-sm leading-relaxed text-background/60">
            Connecting Sierra Leonean artists with the world. Authentic art, verified creators.
          </p>
        </div>
        <div>
          <h4 className="font-display font-semibold text-background mb-4">Explore</h4>
          <div className="space-y-2 text-sm">
            <Link to="/shop" className="block hover:text-background transition-colors">Shop</Link>
            <Link to="/artists" className="block hover:text-background transition-colors">Artists</Link>
            <Link to="/exhibitions" className="block hover:text-background transition-colors">Exhibitions</Link>
          </div>
        </div>
        <div>
          <h4 className="font-display font-semibold text-background mb-4">Support</h4>
          <div className="space-y-2 text-sm">
            <a href="#" className="block hover:text-background transition-colors">Help Center</a>
            <a href="#" className="block hover:text-background transition-colors">Shipping Info</a>
            <a href="#" className="block hover:text-background transition-colors">Returns</a>
          </div>
        </div>
        <div>
          <h4 className="font-display font-semibold text-background mb-4">Newsletter</h4>
          <p className="text-sm text-background/60 mb-3">Get updates on new artists and exhibitions.</p>
          <div className="flex">
            <input type="email" placeholder="Your email" className="flex-1 px-3 py-2 rounded-l-md text-sm bg-background/10 border border-background/20 text-background placeholder:text-background/40 focus:outline-none" />
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-r-md text-sm font-medium hover:opacity-90 transition-opacity">
              Join
            </button>
          </div>
        </div>
      </div>
      <div className="border-t border-background/10 py-6 text-center text-xs text-background/40">
        © 2026 ArtVault. All rights reserved. Supporting Sierra Leonean Art Worldwide.
      </div>
    </footer>
  );
}
