import { Link, useLocation } from "react-router-dom";
import { ShoppingBag, Menu, X, Search } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import { currencies } from "@/lib/data";
import logo from "@/assets/logo.png";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/artists", label: "Artists" },
  { to: "/exhibitions", label: "Exhibitions" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { items, currency, setCurrency } = useCart();
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b">
      <div className="container flex items-center justify-between h-16 md:h-20">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="ArtVault" className="h-10 w-10 md:h-12 md:w-12" />
          <span className="font-display text-xl md:text-2xl font-bold tracking-tight">ArtVault</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map(l => (
            <Link
              key={l.to}
              to={l.to}
              className={`text-sm font-medium tracking-wide transition-colors hover:text-primary ${
                location.pathname === l.to ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link to="/search" className="p-2 hover:text-primary transition-colors">
            <Search className="h-5 w-5" />
          </Link>

          <select
            value={currency}
            onChange={e => setCurrency(e.target.value)}
            className="text-xs bg-secondary rounded-md px-2 py-1.5 border-none font-medium text-secondary-foreground"
          >
            {currencies.map(c => (
              <option key={c.code} value={c.code}>{c.code}</option>
            ))}
          </select>

          <Link to="/cart" className="relative p-2 hover:text-primary transition-colors">
            <ShoppingBag className="h-5 w-5" />
            {items.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                {items.length}
              </span>
            )}
          </Link>

          <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="md:hidden border-t bg-background px-6 py-4 space-y-3">
          {navLinks.map(l => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setMobileOpen(false)}
              className={`block text-base font-medium ${
                location.pathname === l.to ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
