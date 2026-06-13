import { useState } from "react";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import ProviderAvatar from "@/components/ProviderAvatar";
import { useAuth } from "@/lib/AuthContext";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, Briefcase, Calendar, DollarSign, Star,
  User, Settings, Bell, LogOut, Menu, Lock,
} from "lucide-react";
import PendingApprovalScreen from "./PendingApprovalScreen";

const NAV_SECTIONS = [
  {
    label: "OVERVIEW",
    items: [
      { label: "Dashboard", icon: LayoutDashboard, path: "/provider/dashboard" },
    ],
  },
  {
    label: "MY WORK",
    items: [
      { label: "Available Jobs", icon: Briefcase, path: "/provider/jobs" },
      { label: "My Schedule", icon: Calendar, path: "/provider/schedule" },
      { label: "Earnings", icon: DollarSign, path: "/provider/earnings" },
    ],
  },
  {
    label: "REPUTATION",
    items: [
      { label: "My Reviews", icon: Star, path: "/provider/reviews" },
    ],
  },
  {
    label: "ACCOUNT",
    items: [
      { label: "My Profile", icon: User, path: "/provider/profile" },
      { label: "Settings", icon: Settings, path: "/provider/settings" },
    ],
  },
];

const BREADCRUMB_MAP = {
  "/provider/dashboard": "Dashboard",
  "/provider/jobs": "Available Jobs",
  "/provider/schedule": "My Schedule",
  "/provider/earnings": "Earnings",
  "/provider/reviews": "My Reviews",
  "/provider/profile": "My Profile",
  "/provider/settings": "Settings",
};

function Sidebar({ mobileOpen, setMobileOpen }) {
  const { user, signOut, providerStatus, providerApplication } = useAuth();
  const navigate = useNavigate();
  const isApproved = user?.role === "provider" || providerStatus === "approved";

  const handleSignOut = () => {
    signOut();
    setMobileOpen(false);
    navigate("/");
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
            <div className="text-xs font-semibold text-white/50 uppercase tracking-widest">Provider Portal</div>
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
                    end={item.path === "/provider/dashboard"}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                        isActive && isApproved
                          ? "bg-emerald-700 text-white"
                          : !isApproved && item.path !== "/provider/dashboard"
                          ? "text-white/40 pointer-events-none"
                          : "text-white/70 hover:bg-white/10 hover:text-white"
                      )
                    }
                    style={({ isActive }) =>
                      isActive && isApproved ? { borderLeft: "3px solid #d97706" } : {}
                    }
                  >
                    {!isApproved && item.path !== "/provider/dashboard" ? (
                      <Lock className="h-4 w-4 shrink-0" />
                    ) : (
                      <item.icon className="h-4 w-4 shrink-0" />
                    )}
                    <span className="flex-1">{item.label}</span>
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Bottom */}
        <div className="border-t border-white/10 px-4 py-4">
          <div className="flex items-center gap-3">
            <ProviderAvatar avatar={providerApplication?.avatar} name={user?.name} size="sm" className="!border-amber-300" />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-white truncate">{user?.name ?? "Provider"}</div>
              <div className="text-xs text-white/50 truncate">Service Provider</div>
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
  const { user, providerApplication } = useAuth();
  const pageName = BREADCRUMB_MAP[location.pathname] ?? "Dashboard";

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-gray-200 bg-white px-4 shadow-soft">
      <button className="lg:hidden rounded-lg p-1.5 hover:bg-gray-100" onClick={() => setMobileOpen(true)}>
        <Menu className="h-5 w-5 text-gray-600" />
      </button>

      <div className="flex items-center gap-1.5 text-sm text-gray-500">
        <span className="font-medium text-gray-900">Provider</span>
        <span>/</span>
        <span>{pageName}</span>
      </div>

      <div className="ml-auto flex items-center gap-3">
        <button className="relative rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
        </button>
        <ProviderAvatar avatar={providerApplication?.avatar} name={user?.name} size="sm" className="!border-amber-300" />
      </div>
    </header>
  );
}

export default function ProviderLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, providerStatus } = useAuth();
  const isProvider = user?.role === "provider";

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar setMobileOpen={setMobileOpen} />
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          {isProvider || providerStatus === "approved" ? <Outlet /> : <PendingApprovalScreen />}
        </main>
      </div>
    </div>
  );
}
