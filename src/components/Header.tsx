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
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b">
      <div className="container flex items-center justify-between h-16 md:h-[72px]">
        <Link to="/" className="flex items-center gap-2">
          <span className="font-display text-xl md:text-2xl font-bold tracking-tight">ArtVault</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map(l => (
            <Link
              key={l.to}
              to={l.to}
              className={`text-[13px] font-medium tracking-wide transition-opacity hover:opacity-100 ${
                location.pathname === l.to ? "opacity-100" : "opacity-50"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1 md:gap-2">
          <Link to="/search" className="p-2 opacity-60 hover:opacity-100 transition-opacity">
            <Search className="h-5 w-5" />
          </Link>

          <Link to="/wishlist" className="relative p-2 opacity-60 hover:opacity-100 transition-opacity">
            <Heart className="h-5 w-5" />
            {wishlist.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-foreground text-background text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </Link>

          <select
            value={currency}
            onChange={e => setCurrency(e.target.value)}
            className="hidden md:block text-xs bg-secondary rounded-lg px-2 py-1.5 border-none font-medium"
          >
            {currencies.map(c => (
              <option key={c.code} value={c.code}>{c.code}</option>
            ))}
          </select>

          <Link to="/cart" className="relative p-2 opacity-60 hover:opacity-100 transition-opacity">
            <ShoppingBag className="h-5 w-5" />
            {items.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-foreground text-background text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                {items.length}
              </span>
            )}
          </Link>

          {user ? (
            <>
              <Link to="/dashboard" className="hidden md:flex p-2 opacity-60 hover:opacity-100 transition-opacity" title="Dashboard">
                <LayoutDashboard className="h-5 w-5" />
              </Link>
              <button onClick={signOut} className="hidden md:flex p-2 opacity-60 hover:opacity-100 transition-opacity" title="Sign out">
                <LogOut className="h-5 w-5" />
              </button>
              <Link to="/dashboard" className="hidden md:flex items-center pl-1">
                <div className="h-8 w-8 rounded-full bg-foreground text-background flex items-center justify-center text-xs font-bold overflow-hidden">
                  {profile?.avatar_url ? (
                    <img src={profile.avatar_url} alt="" className="h-full w-full object-cover" />
                  ) : (
                    (profile?.full_name || user.email || "U")[0].toUpperCase()
                  )}
                </div>
              </Link>
            </>
          ) : (
            <Link to="/login" className="hidden md:flex p-2 opacity-60 hover:opacity-100 transition-opacity" title="Login">
              <User className="h-5 w-5" />
            </Link>
          )}

          <button className="lg:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="lg:hidden border-t bg-background px-6 py-5 space-y-3">
          {navLinks.map(l => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setMobileOpen(false)}
              className={`block text-base font-medium py-1.5 ${
                location.pathname === l.to ? "opacity-100" : "opacity-50"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <Link to="/contact" onClick={() => setMobileOpen(false)} className="block text-base font-medium py-1.5 opacity-50">Contact</Link>
          <div className="pt-3 border-t">
            <select
              value={currency}
              onChange={e => setCurrency(e.target.value)}
              className="text-sm bg-secondary rounded-lg px-3 py-2.5 border-none font-medium w-full mb-3"
            >
              {currencies.map(c => <option key={c.code} value={c.code}>{c.code} ({c.symbol})</option>)}
            </select>
          </div>
          {user ? (
            <>
              <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="block text-base font-medium py-1.5 opacity-70">
                My Profile
              </Link>
              <button onClick={() => { signOut(); setMobileOpen(false); }} className="block text-base font-medium py-1.5 opacity-50">
                Sign Out
              </button>
            </>
          ) : (
            <Link to="/login" onClick={() => setMobileOpen(false)} className="block text-base font-medium py-1.5 opacity-70">
              Login
            </Link>
          )}
        </nav>
      )}
    </header>
  );
}
