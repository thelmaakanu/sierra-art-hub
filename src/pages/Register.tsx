import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

type UserType = "buyer" | "artist";

export default function Register() {
  const [userType, setUserType] = useState<UserType>("buyer");
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState("+232 ");
  const [phoneValid, setPhoneValid] = useState<boolean | null>(null);

  const validatePhone = (val: string) => {
    setPhone(val);
    if (val.length > 5) {
      setPhoneValid(/^\+232\s?\d{8}$/.test(val.replace(/\s/g, "").replace(/^\+232\s?/, "+232")));
    } else {
      setPhoneValid(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userType === "artist" && !phoneValid) {
      toast.error("Please enter a valid Sierra Leone phone number (+232 XXXXXXXX)");
      return;
    }
    toast.success(`${userType === "artist" ? "Artist" : "Buyer"} registration successful! (Demo mode)`);
  };

  return (
    <div className="container py-16 max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="font-display text-3xl font-bold mb-2">Join ArtVault</h1>
        <p className="text-muted-foreground text-sm">Create your account to start exploring</p>
      </div>

      {/* User Type Toggle */}
      <div className="flex rounded-lg bg-secondary p-1 mb-6">
        {(["buyer", "artist"] as const).map(type => (
          <button
            key={type}
            onClick={() => setUserType(type)}
            className={`flex-1 py-2.5 rounded-md text-sm font-medium transition-colors ${
              userType === type ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {type === "buyer" ? "Buyer" : "Artist"}
          </button>
        ))}
      </div>

      {userType === "artist" && (
        <div className="bg-accent/20 border border-accent/30 rounded-lg p-3 mb-6 flex items-start gap-2">
          <AlertCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
          <p className="text-xs text-accent-foreground">
            Artist registration is restricted to Sierra Leonean nationals. You must provide a valid Sierra Leone phone number (+232) for verification.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1.5">Full Name</label>
          <input type="text" placeholder="Enter your full name" required className="w-full px-3 py-2.5 rounded-md text-sm bg-secondary border-none focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Email</label>
          <input type="email" placeholder="your@email.com" required className="w-full px-3 py-2.5 rounded-md text-sm bg-secondary border-none focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Password</label>
          <div className="relative">
            <input type={showPassword ? "text" : "password"} placeholder="Min 8 characters" required minLength={8} className="w-full px-3 py-2.5 rounded-md text-sm bg-secondary border-none focus:outline-none focus:ring-2 focus:ring-ring pr-10" />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {userType === "buyer" && (
          <>
            <div>
              <label className="block text-sm font-medium mb-1.5">Country</label>
              <select required className="w-full px-3 py-2.5 rounded-md text-sm bg-secondary border-none focus:outline-none focus:ring-2 focus:ring-ring">
                <option value="">Select country</option>
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
            <div>
              <label className="block text-sm font-medium mb-1.5">Shipping Address</label>
              <textarea placeholder="Your shipping address" rows={2} required className="w-full px-3 py-2.5 rounded-md text-sm bg-secondary border-none focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
            </div>
          </>
        )}

        <AnimatePresence>
          {userType === "artist" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4 overflow-hidden"
            >
              <div>
                <label className="block text-sm font-medium mb-1.5">Nationality</label>
                <div className="w-full px-3 py-2.5 rounded-md text-sm bg-secondary text-foreground">
                  Sierra Leone 🇸🇱
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Phone Number</label>
                <div className="relative">
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => validatePhone(e.target.value)}
                    placeholder="+232 XXXXXXXX"
                    required
                    className="w-full px-3 py-2.5 rounded-md text-sm bg-secondary border-none focus:outline-none focus:ring-2 focus:ring-ring pr-10"
                  />
                  {phoneValid !== null && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2">
                      {phoneValid ? <CheckCircle2 className="h-4 w-4 text-primary" /> : <AlertCircle className="h-4 w-4 text-destructive" />}
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Must be Sierra Leone format: +232 XXXXXXXX</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Bio</label>
                <textarea placeholder="Tell us about your art and background..." rows={3} required className="w-full px-3 py-2.5 rounded-md text-sm bg-secondary border-none focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Profile Image</label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors">
                  <p className="text-sm text-muted-foreground">Click to upload profile photo</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">ID Verification (Optional)</label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors">
                  <p className="text-sm text-muted-foreground">Upload national ID for faster approval</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button type="submit" className="w-full bg-primary text-primary-foreground py-3 rounded-md font-medium text-sm hover:opacity-90 transition-opacity">
          {userType === "buyer" ? "Create Buyer Account" : "Apply as Artist"}
        </button>
      </form>

      <p className="text-center text-sm text-muted-foreground mt-6">
        Already have an account?{" "}
        <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link>
      </p>
    </div>
  );
}
