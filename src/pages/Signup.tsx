import { Link, useNavigate } from "react-router-dom";
import { BookOpen, Eye, EyeOff, Mail, Lock, User, AlertCircle, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function Signup() {
  const navigate = useNavigate();
  const { signup, isAuthenticated } = useAuth();
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Redirect if already authenticated
  if (isAuthenticated) {
    navigate("/");
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validate name
    if (form.name.trim().length < 2) {
      setError("Name must be at least 2 characters");
      setLoading(false);
      return;
    }

    const result = signup(form.name, form.email, form.password);

    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } else {
      setError(result.error || "Registration failed");
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-background">
        <div className="text-center animate-scale-in">
          <div className="w-20 h-20 gradient-green rounded-full flex items-center justify-center mx-auto mb-4 shadow-button-green">
            <CheckCircle2 className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Account Created!</h2>
          <p className="text-muted-foreground">Redirecting to home page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-background">
      <div className="w-full max-w-md animate-scale-in">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8 justify-center">
          <div className="w-10 h-10 gradient-hero rounded-2xl flex items-center justify-center shadow-button">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-bold text-primary text-lg leading-none">BookXchange</p>
            <p className="text-muted-foreground text-xs">Smart Campus Platform</p>
          </div>
        </div>

        <div className="bg-card rounded-3xl shadow-card-hover border border-border p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground">Create Account</h2>
            <p className="text-muted-foreground text-sm mt-1">Join your campus book community</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-6 p-4 bg-muted rounded-2xl">
            {[
              { value: "2,400+", label: "Books Listed" },
              { value: "850+", label: "Students" },
              { value: "₹12L+", label: "Saved" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-sm font-bold text-primary">{s.value}</p>
                <p className="text-[10px] text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-destructive" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  required
                  placeholder="Your full name"
                  value={form.name}
                  onChange={(e) => { setForm({ ...form, name: e.target.value }); setError(""); }}
                  className="w-full pl-10 pr-4 py-3 border border-border rounded-xl bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all placeholder:text-muted-foreground"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">College Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="email"
                  required
                  placeholder="you@college.edu"
                  value={form.email}
                  onChange={(e) => { setForm({ ...form, email: e.target.value }); setError(""); }}
                  className="w-full pl-10 pr-4 py-3 border border-border rounded-xl bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all placeholder:text-muted-foreground"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type={showPass ? "text" : "password"}
                  required
                  placeholder="Min. 8 characters"
                  value={form.password}
                  onChange={(e) => { setForm({ ...form, password: e.target.value }); setError(""); }}
                  className="w-full pl-10 pr-12 py-3 border border-border rounded-xl bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all placeholder:text-muted-foreground"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 gradient-hero text-primary-foreground font-semibold rounded-xl shadow-button hover:opacity-90 active:scale-[0.98] transition-all text-sm mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-primary font-semibold hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          By creating an account, you agree to our{" "}
          <a href="#" className="text-primary hover:underline">Terms</a> &{" "}
          <a href="#" className="text-primary hover:underline">Privacy Policy</a>
        </p>
      </div>
    </div>
  );
}
