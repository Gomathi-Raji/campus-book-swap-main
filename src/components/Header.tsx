import { Link, useLocation, useNavigate } from "react-router-dom";
import { BookOpen, Plus, LogOut, Menu, X, Shield } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin, logout, isAuthenticated } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { label: "Home", to: "/" },
    { label: "Post Book", to: "/post-book", icon: <Plus className="w-3.5 h-3.5" /> },
    { label: "My Books", to: "/my-books" },
  ];

  // Add admin link if user is admin
  if (isAdmin) {
    navItems.push({ label: "Admin", to: "/admin", icon: <Shield className="w-3.5 h-3.5" /> });
  }

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Get user initials
  const getUserInitials = () => {
    if (!user?.name) return "U";
    const names = user.name.split(" ");
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return names[0].substring(0, 2).toUpperCase();
  };

  // Get display name
  const getDisplayName = () => {
    if (!user?.name) return "User";
    const names = user.name.split(" ");
    if (names.length >= 2) {
      return `${names[0]} ${names[1][0]}.`;
    }
    return names[0];
  };

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 gradient-hero rounded-xl flex items-center justify-center shadow-button">
              <BookOpen className="w-4.5 h-4.5 text-primary-foreground" style={{ width: 18, height: 18 }} />
            </div>
            <div className="hidden sm:block">
              <span className="text-sm font-bold text-primary">BookXchange</span>
              <span className="block text-[10px] text-muted-foreground leading-none">Smart Campus</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  location.pathname === item.to
                    ? "bg-primary text-primary-foreground shadow-button"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <div className="hidden md:flex items-center gap-2">
                <div className="flex items-center gap-2 pr-3 border-r border-border">
                  <div className="w-8 h-8 gradient-hero rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-primary-foreground">{getUserInitials()}</span>
                  </div>
                  <span className="text-sm font-medium text-foreground">{getDisplayName()}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm text-muted-foreground hover:text-destructive rounded-xl hover:bg-destructive/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 gradient-hero text-primary-foreground text-sm font-semibold rounded-xl shadow-button hover:opacity-90 transition-all"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-xl hover:bg-muted transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {menuOpen && (
          <div className="md:hidden py-3 border-t border-border space-y-1 animate-fade-in-up">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  location.pathname === item.to
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full px-4 py-2.5 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium gradient-hero text-primary-foreground"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
