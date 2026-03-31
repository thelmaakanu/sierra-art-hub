import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, AlertCircle, CheckCircle2, Upload, Palette, ShoppingBag } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

type UserType = "buyer" | "artist";

export default function Register() {
  const [step, setStep] = useState<"type" | "form">("type");
  const [userType, setUserType] = useState<UserType>("buyer");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [country, setCountry] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");

  const [phone, setPhone] = useState("+232 ");
  const [phoneValid, setPhoneValid] = useState<boolean | null>(null);
  const [bio, setBio] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [idDocument, setIdDocument] = useState<File | null>(null);

  const validatePhone = (val: string) => {
    setPhone(val);
    const cleaned = val.replace(/\s/g, "");
    if (cleaned.length > 5) {
      setPhoneValid(/^\+232\d{8}$/.test(cleaned));
    } else {
      setPhoneValid(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (userType === "artist") {
      const cleaned = phone.replace(/\s/g, "");
      if (!/^\+232\d{8}$/.test(cleaned)) {
        toast.error("Please enter a valid Sierra Leone phone number (+232 followed by 8 digits)");
        return;
      }
    }

    setLoading(true);

    const metadata: Record<string, string> = {
      country: userType === "buyer" ? country : "Sierra Leone",
      user_type: userType,
    };

    if (userType === "buyer") {
      if (phoneNumber) metadata.phone = phoneNumber;
      if (shippingAddress) metadata.shipping_address = shippingAddress;
    } else {
      metadata.phone = phone.replace(/\s/g, "");
      metadata.bio = bio;
    }

    const { error } = await signUp(email, password, fullName, metadata);

    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }

    if (userType === "artist") {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        let profileImageUrl: string | null = null;
        let idDocumentUrl: string | null = null;

        if (profileImage) {
          const ext = profileImage.name.split(".").pop();
          const path = `${session.user.id}/profile.${ext}`;
          const { error: upErr } = await supabase.storage.from("artist-uploads").upload(path, profileImage);
          if (!upErr) {
            const { data: urlData } = supabase.storage.from("artist-uploads").getPublicUrl(path);
            profileImageUrl = urlData.publicUrl;
          }
        }

        if (idDocument) {
          const ext = idDocument.name.split(".").pop();
          const path = `${session.user.id}/id-doc.${ext}`;
          const { error: upErr } = await supabase.storage.from("artist-uploads").upload(path, idDocument);
          if (!upErr) {
            const { data: urlData } = supabase.storage.from("artist-uploads").getPublicUrl(path);
            idDocumentUrl = urlData.publicUrl;
          }
        }

        if (profileImageUrl) {
          await supabase.from("profiles").update({ avatar_url: profileImageUrl }).eq("user_id", session.user.id);
        }

        await supabase.from("artist_applications").insert({
          user_id: session.user.id,
          full_name: fullName,
          phone: phone.replace(/\s/g, ""),
          bio,
          profile_image_url: profileImageUrl,
          id_document_url: idDocumentUrl,
        });
      }
    }

    toast.success("Account created! Welcome to ArtVault 🎉");
    setLoading(false);
    navigate("/dashboard");
  };

  if (step === "type") {
    return (
      <div className="container py-20 max-w-lg mx-auto">
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl font-bold tracking-tight mb-3">Join ArtVault</h1>
          <p className="text-muted-foreground">Choose your account type to get started</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10">
          <button
            onClick={() => { setUserType("buyer"); setStep("form"); }}
            className="group relative bg-background border-2 border-border hover:border-foreground rounded-2xl p-10 text-center transition-all duration-300"
          >
            <div className="mx-auto w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mb-5 group-hover:bg-foreground/5 transition-colors">
              <ShoppingBag className="h-8 w-8" />
            </div>
            <h3 className="font-display text-lg font-bold mb-2">Buyer</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Browse, discover, and purchase authentic Sierra Leonean art from verified artists
            </p>
          </button>

          <button
            onClick={() => { setUserType("artist"); setStep("form"); }}
            className="group relative bg-background border-2 border-border hover:border-foreground rounded-2xl p-10 text-center transition-all duration-300"
          >
            <div className="mx-auto w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mb-5 group-hover:bg-foreground/5 transition-colors">
              <Palette className="h-8 w-8" />
            </div>
            <h3 className="font-display text-lg font-bold mb-2">Artist</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Showcase and sell your art to a global audience. Sierra Leonean nationals only
            </p>
            <span className="inline-block mt-4 text-[10px] font-bold uppercase tracking-wider bg-secondary px-3 py-1.5 rounded-full">
              🇸🇱 Sierra Leone Only
            </span>
          </button>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="text-foreground font-medium hover:opacity-70 transition-opacity">Sign in</Link>
        </p>
      </div>
    );
  }

  return (
    <div className="container py-20 max-w-md mx-auto">
      <div className="flex items-center gap-3 mb-10">
        <button onClick={() => setStep("type")} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          ← Back
        </button>
        <div className="text-center flex-1">
          <h1 className="font-display text-2xl font-bold mb-1 tracking-tight">
            {userType === "buyer" ? "Create Buyer Account" : "Apply as Artist"}
          </h1>
          <p className="text-muted-foreground text-xs">
            {userType === "buyer" ? "Open to all countries" : "Sierra Leonean nationals only 🇸🇱"}
          </p>
        </div>
      </div>

      {userType === "artist" && (
        <div className="bg-secondary rounded-xl p-4 mb-8 flex items-start gap-3">
          <AlertCircle className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
          <p className="text-xs text-muted-foreground">
            Artist registration requires a valid Sierra Leone phone number (+232). Your application will be reviewed by our team.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-2">Full Name</label>
          <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Enter your full name" required className="w-full px-4 py-3 rounded-xl text-sm bg-secondary border-none focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" required className="w-full px-4 py-3 rounded-xl text-sm bg-secondary border-none focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Password</label>
          <div className="relative">
            <input type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="Min 8 characters" required minLength={8} className="w-full px-4 py-3 rounded-xl text-sm bg-secondary border-none focus:outline-none focus:ring-2 focus:ring-ring pr-10" />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {userType === "buyer" && (
          <>
            <div>
              <label className="block text-sm font-medium mb-2">Phone Number (Optional)</label>
              <input type="tel" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} placeholder="+1234567890" className="w-full px-4 py-3 rounded-xl text-sm bg-secondary border-none focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Country</label>
              <select value={country} onChange={e => setCountry(e.target.value)} required className="w-full px-4 py-3 rounded-xl text-sm bg-secondary border-none focus:outline-none focus:ring-2 focus:ring-ring">
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
              <label className="block text-sm font-medium mb-2">Shipping Address</label>
              <textarea value={shippingAddress} onChange={e => setShippingAddress(e.target.value)} placeholder="Your shipping address" rows={2} required className="w-full px-4 py-3 rounded-xl text-sm bg-secondary border-none focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
            </div>
          </>
        )}

        <AnimatePresence>
          {userType === "artist" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-5 overflow-hidden"
            >
              <div>
                <label className="block text-sm font-medium mb-2">Nationality</label>
                <div className="w-full px-4 py-3 rounded-xl text-sm bg-secondary">Sierra Leone 🇸🇱</div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Phone Number</label>
                <div className="relative">
                  <input type="tel" value={phone} onChange={e => validatePhone(e.target.value)} placeholder="+232 XXXXXXXX" required className="w-full px-4 py-3 rounded-xl text-sm bg-secondary border-none focus:outline-none focus:ring-2 focus:ring-ring pr-10" />
                  {phoneValid !== null && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2">
                      {phoneValid ? <CheckCircle2 className="h-4 w-4 text-foreground" /> : <AlertCircle className="h-4 w-4 text-destructive" />}
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1.5">Must be Sierra Leone format: +232 followed by 8 digits</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Bio</label>
                <textarea value={bio} onChange={e => setBio(e.target.value)} placeholder="Tell us about your art and background..." rows={3} required className="w-full px-4 py-3 rounded-xl text-sm bg-secondary border-none focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Profile Image</label>
                <label className="border-2 border-dashed border-border rounded-2xl p-8 text-center cursor-pointer hover:border-foreground/30 transition-colors block">
                  <Upload className="h-6 w-6 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    {profileImage ? profileImage.name : "Click to upload profile photo"}
                  </p>
                  <input type="file" accept="image/*" onChange={e => setProfileImage(e.target.files?.[0] || null)} className="hidden" />
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">ID Verification (Optional)</label>
                <label className="border-2 border-dashed border-border rounded-2xl p-8 text-center cursor-pointer hover:border-foreground/30 transition-colors block">
                  <Upload className="h-6 w-6 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    {idDocument ? idDocument.name : "Upload national ID for faster approval"}
                  </p>
                  <input type="file" accept="image/*,.pdf" onChange={e => setIdDocument(e.target.files?.[0] || null)} className="hidden" />
                </label>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button type="submit" disabled={loading} className="w-full bg-foreground text-background py-3.5 rounded-full font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50">
          {loading ? "Creating account..." : userType === "buyer" ? "Create Buyer Account" : "Apply as Artist"}
        </button>
      </form>

      <p className="text-center text-sm text-muted-foreground mt-8">
        Already have an account?{" "}
        <Link to="/login" className="text-foreground font-medium hover:opacity-70 transition-opacity">Sign in</Link>
      </p>
    </div>
  );
}
