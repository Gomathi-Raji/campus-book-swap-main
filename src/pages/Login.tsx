import { Link, useNavigate } from "react-router-dom";
import { BookOpen, Eye, EyeOff, Mail, Lock, AlertCircle } from "lucide-react";
import { useState } from "react";
import heroBooks from "@/assets/hero-books.jpg";
import { useAuth } from "@/context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect if already authenticated
  if (isAuthenticated) {
    navigate("/");
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = login(form.email, form.password);

    if (result.success) {
      navigate("/");
    } else {
      setError(result.error || "Login failed");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 gradient-hero relative overflow-hidden flex-col justify-between p-12">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-white text-lg leading-none">BookXchange</p>
              <p className="text-white/70 text-xs">Smart Campus Platform</p>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white leading-tight mb-4">
            Buy & Sell<br />
            Academic Books<br />
            On Campus
          </h1>
          <p className="text-white/80 text-base leading-relaxed max-w-sm">
            Save money on textbooks. Connect with fellow students and find the books you need for a fraction of the price.
          </p>
        </div>

        <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl h-64">
          <img src={heroBooks} alt="Books" className="w-full h-full object-cover opacity-80" />
        </div>

        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/3 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/3 -translate-x-1/3" />
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-background">
        <div className="w-full max-w-md animate-scale-in">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-3 mb-8 justify-center">
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
              <h2 className="text-2xl font-bold text-foreground">Welcome back!</h2>
              <p className="text-muted-foreground text-sm mt-1">Sign in to your student account</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-destructive" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            {/* Demo Credentials */}
            <div className="mb-4 p-3 bg-primary-light border border-primary/20 rounded-xl">
              <p className="text-xs font-medium text-primary mb-1">Demo Credentials:</p>
              <p className="text-xs text-muted-foreground">User: riya@campus.edu / password123</p>
              <p className="text-xs text-muted-foreground">Admin: admin@campus.edu / admin123</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Email Address</label>
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
                    placeholder="••••••••"
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
                <div className="text-right mt-1.5">
                  <a href="#" className="text-xs text-primary hover:underline font-medium">Forgot password?</a>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 gradient-hero text-primary-foreground font-semibold rounded-xl shadow-button hover:opacity-90 active:scale-[0.98] transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link to="/signup" className="text-primary font-semibold hover:underline">
                  Create Account
                </Link>
              </p>
            </div>
          </div>

          <p className="text-center text-xs text-muted-foreground mt-6">
            By signing in, you agree to our{" "}
            <a href="#" className="text-primary hover:underline">Terms</a> &{" "}
            <a href="#" className="text-primary hover:underline">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
}
