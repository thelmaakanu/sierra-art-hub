import { Link } from "react-router-dom";
import { Trash2, ArrowLeft, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/lib/auth";
import { convertPrice } from "@/lib/data";

export default function CartPage() {
  const { items, removeItem, currency } = useCart();
  const { user } = useAuth();

  const total = items.reduce((sum, item) => sum + item.price, 0);

  if (items.length === 0) {
    return (
      <div className="container py-20 text-center">
        <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h1 className="font-display text-3xl font-bold mb-3">Your Cart is Empty</h1>
        <p className="text-muted-foreground mb-8">Discover beautiful Sierra Leonean art to add to your collection.</p>
        <Link to="/shop" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-md font-medium text-sm">
          <ArrowLeft className="h-4 w-4" /> Browse Art
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-12 max-w-3xl">
      <h1 className="font-display text-3xl font-bold mb-8">Cart ({items.length})</h1>

      <div className="space-y-4 mb-8">
        {items.map(item => (
          <div key={item.id} className="flex gap-4 p-4 bg-card rounded-lg border">
            <img src={item.image} alt={item.title} className="h-20 w-20 rounded-md object-cover" />
            <div className="flex-1 min-w-0">
              <h3 className="font-display font-semibold text-sm">{item.title}</h3>
              <p className="text-xs text-muted-foreground">{item.artistName}</p>
              <p className="text-sm font-semibold text-primary mt-1">{convertPrice(item.price, currency)}</p>
            </div>
            <button onClick={() => removeItem(item.id)} className="p-2 text-muted-foreground hover:text-destructive transition-colors self-start">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      <div className="bg-card border rounded-lg p-6 space-y-4">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-semibold">{convertPrice(total, currency)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Shipping</span>
          <span className="text-muted-foreground">Calculated at checkout</span>
        </div>
        <div className="border-t pt-4 flex justify-between">
          <span className="font-display font-bold text-lg">Total</span>
          <span className="font-display font-bold text-lg text-primary">{convertPrice(total, currency)}</span>
        </div>
        {user ? (
          <Link
            to="/checkout"
            className="w-full block text-center bg-primary text-primary-foreground py-3.5 rounded-md font-medium text-sm hover:opacity-90 transition-opacity"
          >
            Proceed to Checkout
          </Link>
        ) : (
          <Link
            to="/login"
            className="w-full block text-center bg-primary text-primary-foreground py-3.5 rounded-md font-medium text-sm hover:opacity-90 transition-opacity"
          >
            Login to Checkout
          </Link>
        )}
      </div>
    </div>
  );
}
