import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, AlertCircle, CheckCircle2, Upload, Palette, ShoppingBag, ArrowRight, ArrowLeft, UserPlus } from "lucide-react";
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
      <div className="min-h-[calc(100vh-72px)] flex items-center justify-center px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="w-full max-w-lg"
        >
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-secondary mb-6">
              <UserPlus className="h-7 w-7 text-foreground" />
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-3">Join ArtVault</h1>
            <p className="text-muted-foreground text-sm">Choose your account type to get started</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10">
            <button
              onClick={() => { setUserType("buyer"); setStep("form"); }}
              className="group apple-card p-10 text-center border-2 border-transparent hover:border-foreground/10"
            >
              <div className="mx-auto w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mb-5 group-hover:bg-foreground group-hover:text-background transition-all duration-500">
                <ShoppingBag className="h-8 w-8" />
              </div>
              <h3 className="font-display text-lg font-bold mb-2">Buyer</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Browse, discover, and purchase authentic Sierra Leonean art from verified artists
              </p>
            </button>

            <button
              onClick={() => { setUserType("artist"); setStep("form"); }}
              className="group apple-card p-10 text-center border-2 border-transparent hover:border-foreground/10"
            >
              <div className="mx-auto w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mb-5 group-hover:bg-foreground group-hover:text-background transition-all duration-500">
                <Palette className="h-8 w-8" />
              </div>
              <h3 className="font-display text-lg font-bold mb-2">Artist</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Showcase and sell your art to a global audience. Sierra Leonean nationals only
              </p>
              <span className="inline-block mt-4 text-[10px] font-bold uppercase tracking-wider bg-secondary px-3 py-1.5 rounded-xl">
                🇸🇱 Sierra Leone Only
              </span>
            </button>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-foreground font-semibold hover:opacity-60 transition-opacity">Sign in</Link>
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-72px)] flex items-center justify-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="w-full max-w-[420px]"
      >
        <div className="flex items-center gap-3 mb-10">
          <button onClick={() => setStep("type")} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back
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
          <div className="bg-secondary rounded-2xl p-4 mb-8 flex items-start gap-3">
            <AlertCircle className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              Artist registration requires a valid Sierra Leone phone number (+232). Your application will be reviewed by our team.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold mb-2.5">Full Name</label>
            <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Enter your full name" required className="apple-input" />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2.5">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" required className="apple-input" />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2.5">Password</label>
            <div className="relative">
              <input type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="Min 8 characters" required minLength={8} className="apple-input pr-12" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {userType === "buyer" && (
            <>
              <div>
                <label className="block text-sm font-semibold mb-2.5">Phone Number (Optional)</label>
                <input type="tel" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} placeholder="+1234567890" className="apple-input" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2.5">Country</label>
                <select value={country} onChange={e => setCountry(e.target.value)} required className="apple-input">
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
                <label className="block text-sm font-semibold mb-2.5">Shipping Address</label>
                <textarea value={shippingAddress} onChange={e => setShippingAddress(e.target.value)} placeholder="Your shipping address" rows={2} required className="apple-input resize-none" />
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
                  <label className="block text-sm font-semibold mb-2.5">Nationality</label>
                  <div className="apple-input bg-secondary/80">Sierra Leone 🇸🇱</div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2.5">Phone Number</label>
                  <div className="relative">
                    <input type="tel" value={phone} onChange={e => validatePhone(e.target.value)} placeholder="+232 XXXXXXXX" required className="apple-input pr-12" />
                    {phoneValid !== null && (
                      <span className="absolute right-4 top-1/2 -translate-y-1/2">
                        {phoneValid ? <CheckCircle2 className="h-4 w-4 text-foreground" /> : <AlertCircle className="h-4 w-4 text-destructive" />}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Must be Sierra Leone format: +232 followed by 8 digits</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2.5">Bio</label>
                  <textarea value={bio} onChange={e => setBio(e.target.value)} placeholder="Tell us about your art and background..." rows={3} required className="apple-input resize-none" />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2.5">Profile Image</label>
                  <label className="border-2 border-dashed border-border rounded-2xl p-8 text-center cursor-pointer hover:border-foreground/20 transition-all duration-300 block">
                    <Upload className="h-6 w-6 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      {profileImage ? profileImage.name : "Click to upload profile photo"}
                    </p>
                    <input type="file" accept="image/*" onChange={e => setProfileImage(e.target.files?.[0] || null)} className="hidden" />
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2.5">ID Verification (Optional)</label>
                  <label className="border-2 border-dashed border-border rounded-2xl p-8 text-center cursor-pointer hover:border-foreground/20 transition-all duration-300 block">
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

          <button type="submit" disabled={loading} className="apple-btn-primary flex items-center justify-center gap-2">
            {loading ? (
              <span className="inline-block h-4 w-4 border-2 border-background/30 border-t-background rounded-full animate-spin" />
            ) : (
              <>{userType === "buyer" ? "Create Buyer Account" : "Apply as Artist"} <ArrowRight className="h-4 w-4" /></>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-10">
          Already have an account?{" "}
          <Link to="/login" className="text-foreground font-semibold hover:opacity-60 transition-opacity">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
}
