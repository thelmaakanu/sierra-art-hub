import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Phone, ArrowRight } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { motion } from "framer-motion";

type LoginMethod = "email" | "phone";

export default function Login() {
  const [method, setMethod] = useState<LoginMethod>("email");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("+232 ");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let loginEmail = email;

    if (method === "phone") {
      const cleaned = phone.replace(/\s/g, "");
      if (!/^\+232\d{8}$/.test(cleaned)) {
        toast.error("Please enter a valid Sierra Leone phone number");
        setLoading(false);
        return;
      }
      const { data: profile } = await supabase
        .from("profiles")
        .select("email")
        .eq("phone", cleaned)
        .single();

      if (!profile?.email) {
        toast.error("No account found with this phone number");
        setLoading(false);
        return;
      }
      loginEmail = profile.email;
    }

    const { error } = await signIn(loginEmail, password);
    setLoading(false);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Welcome back! 🎉");
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-[calc(100vh-72px)] flex items-center justify-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="w-full max-w-[420px]"
      >
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-secondary mb-6">
            <Mail className="h-7 w-7 text-foreground" />
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-3">Welcome Back</h1>
          <p className="text-muted-foreground text-sm">Sign in to your ArtVault account</p>
        </div>

        <div className="flex rounded-2xl bg-secondary p-1.5 mb-8">
          <button
            type="button"
            onClick={() => setMethod("email")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
              method === "email" ? "bg-foreground text-background shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Mail className="h-4 w-4" /> Email
          </button>
          <button
            type="button"
            onClick={() => setMethod("phone")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
              method === "phone" ? "bg-foreground text-background shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Phone className="h-4 w-4" /> Phone
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {method === "email" ? (
            <div>
              <label className="block text-sm font-semibold mb-2.5">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" required className="apple-input" />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-semibold mb-2.5">Phone Number</label>
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+232 XXXXXXXX" required className="apple-input" />
              <p className="text-xs text-muted-foreground mt-2">Sierra Leone format: +232 followed by 8 digits</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold mb-2.5">Password</label>
            <div className="relative">
              <input type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required className="apple-input pr-12" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="apple-btn-primary flex items-center justify-center gap-2">
            {loading ? (
              <span className="inline-block h-4 w-4 border-2 border-background/30 border-t-background rounded-full animate-spin" />
            ) : (
              <>Sign In <ArrowRight className="h-4 w-4" /></>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-10">
          Don't have an account?{" "}
          <Link to="/register" className="text-foreground font-semibold hover:opacity-60 transition-opacity">Create one</Link>
        </p>
      </motion.div>
    </div>
  );
}
