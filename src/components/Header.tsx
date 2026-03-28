import { Link, useLocation } from "react-router-dom";
import { ShoppingBag, Menu, X, Search, Heart, User, LayoutDashboard, LogOut } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import { useWishlist } from "@/lib/wishlist";
import { useAuth } from "@/lib/auth";
import { currencies } from "@/lib/data";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/artists", label: "Artists" },
  { to: "/exhibitions", label: "Exhibitions" },
  { to: "/community", label: "Community" },
  { to: "/about", label: "About" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { items, currency, setCurrency } = useCart();
  const { wishlist } = useWishlist();
  const { user, profile, signOut } = useAuth();
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b">
      <div className="container flex items-center justify-between h-14 md:h-16">
        <Link to="/" className="flex items-center gap-2">
          <span className="font-display text-lg md:text-xl font-bold tracking-tight">ArtVault</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-6">
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

        <div className="flex items-center gap-1 md:gap-2">
          <Link to="/search" className="p-2 hover:text-primary transition-colors">
            <Search className="h-5 w-5" />
          </Link>

          <Link to="/wishlist" className="relative p-2 hover:text-primary transition-colors">
            <Heart className="h-5 w-5" />
            {wishlist.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </Link>

          <select
            value={currency}
            onChange={e => setCurrency(e.target.value)}
            className="hidden md:block text-xs bg-secondary rounded-md px-2 py-1.5 border-none font-medium text-secondary-foreground"
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

          {user ? (
            <>
              {profile?.user_type === "artist" && (
                <Link to="/dashboard" className="hidden md:flex p-2 hover:text-primary transition-colors" title="Dashboard">
                  <LayoutDashboard className="h-5 w-5" />
                </Link>
              )}
              <button onClick={signOut} className="hidden md:flex p-2 hover:text-destructive transition-colors" title="Sign out">
                <LogOut className="h-5 w-5" />
              </button>
              <div className="hidden md:flex items-center pl-1">
                <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                  {(profile?.full_name || user.email || "U")[0].toUpperCase()}
                </div>
              </div>
            </>
          ) : (
            <Link to="/login" className="hidden md:flex p-2 hover:text-primary transition-colors" title="Login">
              <User className="h-5 w-5" />
            </Link>
          )}

          <button className="lg:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="lg:hidden border-t bg-background px-6 py-4 space-y-3">
          {navLinks.map(l => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setMobileOpen(false)}
              className={`block text-base font-medium py-1 ${
                location.pathname === l.to ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <Link to="/contact" onClick={() => setMobileOpen(false)} className="block text-base font-medium py-1 text-muted-foreground">Contact</Link>
          <div className="pt-2 border-t">
            <select
              value={currency}
              onChange={e => setCurrency(e.target.value)}
              className="text-sm bg-secondary rounded-md px-3 py-2 border-none font-medium text-secondary-foreground w-full mb-3"
            >
              {currencies.map(c => <option key={c.code} value={c.code}>{c.code} ({c.symbol})</option>)}
            </select>
          </div>
          {user ? (
            <>
              {profile?.user_type === "artist" && (
                <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="block text-base font-medium text-muted-foreground py-1">
                  Dashboard
                </Link>
              )}
              <button onClick={() => { signOut(); setMobileOpen(false); }} className="block text-base font-medium text-destructive py-1">
                Sign Out
              </button>
            </>
          ) : (
            <Link to="/login" onClick={() => setMobileOpen(false)} className="block text-base font-medium text-muted-foreground py-1">
              Login
            </Link>
          )}
        </nav>
      )}
    </header>
  );
}
