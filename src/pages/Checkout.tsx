import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Truck, Shield, CreditCard } from "lucide-react";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/lib/auth";
import { convertPrice } from "@/lib/data";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function Checkout() {
  const { items, clearCart, currency } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [purchased, setPurchased] = useState(false);
  const [processing, setProcessing] = useState(false);
  const total = items.reduce((sum, item) => sum + item.price, 0);
  const shipping = total > 3000 ? 0 : 500;

  if (purchased) {
    return (
      <div className="container py-20 text-center max-w-md mx-auto">
        <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", duration: 0.6 }}>
          <CheckCircle2 className="h-20 w-20 text-primary mx-auto mb-6" />
        </motion.div>
        <h1 className="font-display text-3xl font-bold mb-3">Purchase Successful!</h1>
        <p className="text-muted-foreground mb-2">Thank you for supporting Sierra Leonean artists.</p>
        <p className="text-sm text-muted-foreground mb-8">Your artwork is being prepared for shipment. You'll receive a confirmation email shortly.</p>
        <Link to="/shop" className="bg-primary text-primary-foreground px-6 py-3 rounded-md font-medium text-sm hover:opacity-90 transition-opacity">
          Continue Shopping
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container py-20 text-center">
        <h1 className="font-display text-3xl font-bold mb-3">No Items to Checkout</h1>
        <Link to="/shop" className="text-primary hover:underline">Browse art</Link>
      </div>
    );
  }

  const handlePurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { toast.error("Please log in to purchase"); return; }
    setProcessing(true);

    // Mark all DB artworks as sold
    for (const item of items) {
      if (item.id.startsWith("db-")) {
        const dbId = item.id.replace("db-", "");
        await supabase.from("artworks").update({ sold: true }).eq("id", dbId);
      }
    }

    // Mark mock artworks as sold (update local data)
    // Mock artworks won't persist but we clear the cart anyway

    clearCart();
    setPurchased(true);
    setProcessing(false);
  };

  return (
    <div className="container py-12 max-w-4xl">
      <Link to="/cart" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8">
        <ArrowLeft className="h-4 w-4" /> Back to Cart
      </Link>

      <h1 className="font-display text-3xl font-bold mb-8">Checkout</h1>

      <form onSubmit={handlePurchase}>
        <div className="grid md:grid-cols-5 gap-8">
          <div className="md:col-span-3 space-y-6">
            <div className="bg-card rounded-lg border p-6">
              <h2 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
                <Truck className="h-5 w-5 text-primary" /> Shipping Information
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-medium mb-1.5">First Name</label>
                  <input type="text" required className="w-full px-3 py-2.5 rounded-md text-sm bg-secondary border-none focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-medium mb-1.5">Last Name</label>
                  <input type="text" required className="w-full px-3 py-2.5 rounded-md text-sm bg-secondary border-none focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1.5">Address</label>
                  <input type="text" required className="w-full px-3 py-2.5 rounded-md text-sm bg-secondary border-none focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">City</label>
                  <input type="text" required className="w-full px-3 py-2.5 rounded-md text-sm bg-secondary border-none focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Country</label>
                  <select required className="w-full px-3 py-2.5 rounded-md text-sm bg-secondary border-none focus:outline-none focus:ring-2 focus:ring-ring">
                    <option>Sierra Leone</option>
                    <option>Nigeria</option>
                    <option>Ghana</option>
                    <option>United States</option>
                    <option>United Kingdom</option>
                    <option>Germany</option>
                    <option>France</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1.5">Email</label>
                  <input type="email" required className="w-full px-3 py-2.5 rounded-md text-sm bg-secondary border-none focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg border p-6">
              <h2 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" /> Payment
              </h2>
              <div className="bg-secondary/50 rounded-lg p-4 flex items-center gap-3">
                <Shield className="h-5 w-5 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">This is a demo checkout. No real payment is processed.</p>
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="bg-card rounded-lg border p-6 sticky top-24">
              <h2 className="font-display font-semibold text-lg mb-4">Order Summary</h2>
              <div className="space-y-3 mb-4">
                {items.map(item => (
                  <div key={item.id} className="flex gap-3">
                    <img src={item.image} alt={item.title} className="h-14 w-14 rounded-md object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">{item.title}</p>
                      <p className="text-xs text-muted-foreground">{item.artistName}</p>
                      <p className="text-xs font-semibold text-primary">{convertPrice(item.price, currency)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-2 border-t pt-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{convertPrice(total, currency)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{shipping === 0 ? "Free" : convertPrice(shipping, currency)}</span>
                </div>
                <div className="flex justify-between font-bold border-t pt-2">
                  <span>Total</span>
                  <span className="text-primary">{convertPrice(total + shipping, currency)}</span>
                </div>
              </div>

              <button type="submit" disabled={processing} className="w-full mt-4 bg-primary text-primary-foreground py-3.5 rounded-md font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50">
                {processing ? "Processing..." : "Complete Purchase"}
              </button>

              <p className="text-xs text-muted-foreground text-center mt-3">
                Estimated delivery: 7-14 business days
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
