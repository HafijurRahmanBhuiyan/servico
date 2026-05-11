import { useState } from "react";
import { Outlet, Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, BarChart2, Users, Briefcase, Star, Wrench, Grid,
  Calendar, CreditCard, Tag, Settings, Bell, LogOut, Menu, X,
} from "lucide-react";

const NAV_SECTIONS = [
  {
    label: "OVERVIEW",
    items: [
      { label: "Dashboard", icon: LayoutDashboard, path: "/admin" },
      { label: "Analytics", icon: BarChart2, path: "/admin/analytics", badge: "Coming soon" },
    ],
  },
  {
    label: "PEOPLE",
    items: [
      { label: "Users", icon: Users, path: "/admin/users" },
      { label: "Service Providers", icon: Briefcase, path: "/admin/providers" },
      { label: "Reviews", icon: Star, path: "/admin/reviews" },
    ],
  },
  {
    label: "CATALOGUE",
    items: [
      { label: "Services", icon: Wrench, path: "/admin/services" },
      { label: "Categories", icon: Grid, path: "/admin/categories" },
    ],
  },
  {
    label: "TRANSACTIONS",
    items: [
      { label: "Bookings", icon: Calendar, path: "/admin/bookings" },
      { label: "Payments", icon: CreditCard, path: "/admin/payments" },
      { label: "Promo Codes", icon: Tag, path: "/admin/promos" },
    ],
  },
  {
    label: "SYSTEM",
    items: [
      { label: "Site Settings", icon: Settings, path: "/admin/settings" },
    ],
  },
];

const BREADCRUMB_MAP = {
  "/admin": "Dashboard",
  "/admin/users": "Users",
  "/admin/providers": "Service Providers",
  "/admin/reviews": "Reviews",
  "/admin/services": "Services",
  "/admin/categories": "Categories",
  "/admin/bookings": "Bookings",
  "/admin/payments": "Payments",
  "/admin/promos": "Promo Codes",
  "/admin/settings": "Site Settings",
};

function Sidebar({ mobileOpen, setMobileOpen }) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut();
    setMobileOpen(false);
    navigate("/admin/login");
  };

  return (
    <>
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-[#064e3b] transition-transform duration-300 lg:static lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-400 font-black text-white text-lg shadow-glow">
            S
          </div>
          <div>
            <div className="text-lg font-black tracking-tight text-white">Servico</div>
            <div className="text-xs font-semibold text-white/50 uppercase tracking-widest">Admin Portal</div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6 no-scrollbar">
          {NAV_SECTIONS.map((section) => (
            <div key={section.label}>
              <div className="px-3 mb-2 text-xs font-semibold text-white/50 uppercase tracking-widest">
                {section.label}
              </div>
              <div className="space-y-1">
                {section.items.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === "/admin"}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                        isActive
                          ? "bg-emerald-700 text-white"
                          : "text-white/70 hover:bg-white/10 hover:text-white"
                      )
                    }
                    style={({ isActive }) =>
                      isActive ? { borderLeft: "3px solid #d97706" } : {}
                    }
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    <span className="flex-1">{item.label}</span>
                    {item.badge && (
                      <span className="rounded-full bg-amber-400/20 px-2 py-0.5 text-[10px] font-semibold text-amber-300">
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Bottom */}
        <div className="border-t border-white/10 px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white">
              {user?.name?.[0]?.toUpperCase() ?? "A"}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-white truncate">{user?.name ?? "Admin"}</div>
              <div className="text-xs text-white/50 truncate">{user?.email}</div>
            </div>
            <button onClick={handleSignOut} className="rounded-lg p-2 text-red-400 hover:bg-white/10 hover:text-red-300 transition" title="Sign out">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

function TopBar({ setMobileOpen }) {
  const location = useLocation();
  const { user } = useAuth();
  const pageName = BREADCRUMB_MAP[location.pathname] ?? "Admin";

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-gray-200 bg-white px-4 shadow-soft">
      <button className="lg:hidden rounded-lg p-1.5 hover:bg-gray-100" onClick={() => setMobileOpen(true)}>
        <Menu className="h-5 w-5 text-gray-600" />
      </button>

      <div className="flex items-center gap-1.5 text-sm text-gray-500">
        <span className="font-medium text-gray-900">Admin</span>
        <span>/</span>
        <span>{pageName}</span>
      </div>

      <div className="ml-auto flex items-center gap-3">
        <button className="relative rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
        </button>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">
          {user?.name?.[0]?.toUpperCase() ?? "A"}
        </div>
      </div>
    </header>
  );
}

export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar setMobileOpen={setMobileOpen} />
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
