import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";

const LINKS = {
  Company: [
    { to: "/about", label: "About us" },
    { to: "/contact", label: "Contact" },
    { to: "/become-provider", label: "Become a Pro" },
  ],
  Services: [
    { to: "/category/ac-repair", label: "AC Repair" },
    { to: "/category/cleaning", label: "Home Cleaning" },
    { to: "/category/beauty", label: "Beauty & Spa" },
    { to: "/category/electrical", label: "Electrical" },
    { to: "/services", label: "All Services" },
  ],
  Support: [
    { to: "/contact", label: "Help Center" },
    { to: "/contact", label: "Report Issue" },
    { to: "/contact", label: "Refund Policy" },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-500 font-black text-white text-lg">
                S
              </div>
              <span className="text-lg font-black text-gray-900">Servico</span>
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-gray-500 max-w-xs">
              Bangladesh's most trusted home services marketplace. Verified pros, fixed prices, guaranteed quality.
            </p>
            <div className="mt-4 flex gap-3">
              {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 text-gray-400 transition hover:border-emerald-300 hover:text-emerald-600">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {Object.entries(LINKS).map(([group, items]) => (
            <div key={group}>
              <h4 className="mb-3 text-sm font-bold text-gray-900">{group}</h4>
              <ul className="space-y-2">
                {items.map(({ to, label }) => (
                  <li key={label}>
                    <Link to={to} className="text-sm text-gray-500 hover:text-primary transition">{label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-gray-100 pt-6 sm:flex-row">
          <p className="text-xs text-gray-400">© {new Date().getFullYear()} Servico. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="text-xs text-gray-400 hover:text-primary">Privacy Policy</a>
            <a href="#" className="text-xs text-gray-400 hover:text-primary">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
