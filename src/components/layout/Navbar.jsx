import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X, User, LogOut, ChevronDown } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { to: "/services", label: "Services" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);

  const handleSignOut = () => {
    signOut();
    setDropOpen(false);
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/90 backdrop-blur-md shadow-soft">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-500 font-black text-white text-lg shadow-glow">
            S
          </div>
          <span className="text-lg font-black tracking-tight text-gray-900">Servico</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1 ml-6">
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink key={to} to={to}
              className={({ isActive }) =>
                cn("px-3 py-2 rounded-lg text-sm font-medium transition",
                  isActive ? "bg-emerald-50 text-primary" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50")
              }>
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Link to="/become-provider"
            className="hidden sm:inline-flex items-center rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100">
            Become a Pro
          </Link>

          {user ? (
            <div className="relative">
              <button onClick={() => setDropOpen(!dropOpen)}
                className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium transition hover:bg-gray-50">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white text-xs font-bold">
                  {user.name?.[0]?.toUpperCase() ?? "U"}
                </div>
                <span className="hidden sm:block max-w-[100px] truncate">{user.name}</span>
                <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
              </button>
              {dropOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-2xl border border-gray-200 bg-white shadow-elevated py-1">
                  <Link to="/dashboard/bookings" onClick={() => setDropOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                    <User className="h-4 w-4" /> My Bookings
                  </Link>
                  <button onClick={handleSignOut}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50">
                    <LogOut className="h-4 w-4" /> Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="btn-secondary px-4 py-2 text-sm">Sign in</Link>
              <Link to="/register" className="btn-primary px-4 py-2 text-sm hidden sm:inline-flex">Sign up</Link>
            </div>
          )}

          {/* Mobile hamburger */}
          <button className="md:hidden p-2 rounded-lg hover:bg-gray-100" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 pb-4 pt-2">
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink key={to} to={to} onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                cn("block px-3 py-2.5 rounded-lg text-sm font-medium",
                  isActive ? "bg-emerald-50 text-primary" : "text-gray-700")
              }>
              {label}
            </NavLink>
          ))}
          <Link to="/become-provider" onClick={() => setMobileOpen(false)}
            className="block px-3 py-2.5 text-sm font-semibold text-emerald-700">
            Become a Pro
          </Link>
          {!user && (
            <Link to="/register" onClick={() => setMobileOpen(false)}
              className="mt-2 block btn-primary text-center py-2.5">
              Sign up free
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
