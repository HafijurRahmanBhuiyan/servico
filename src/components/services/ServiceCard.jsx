import { useState } from "react";
import { Link } from "react-router-dom";
import { Star, Clock } from "lucide-react";
import { formatPrice, formatNum } from "@/lib/utils";

export default function ServiceCard({ service }) {
  const [imgError, setImgError] = useState(false);

  return (
    <Link
      to={`/service/${service.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-soft transition-all duration-300 hover:shadow-elevated hover:-translate-y-1.5"
    >
      {/* Image / Icon area */}
      <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-emerald-50 via-teal-50 to-gray-100">
        {service.image_url && !imgError ? (
          <img
            src={service.image_url}
            alt={service.title}
            onError={() => setImgError(true)}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="text-7xl transition-transform duration-300 group-hover:scale-110 drop-shadow-sm">
              {service.icon}
            </span>
          </div>
        )}

        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {service.is_popular && (
          <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-amber-400 px-2.5 py-1 text-xs font-bold text-white shadow-sm">
            🔥 Popular
          </span>
        )}

        {service.duration && (
          <span className="absolute right-3 bottom-3 flex items-center gap-1 rounded-full bg-white/90 backdrop-blur-sm px-2.5 py-1 text-xs font-medium text-gray-700 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Clock className="h-3 w-3 text-emerald-500" />
            {service.duration}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-semibold leading-snug text-gray-900 group-hover:text-primary transition-colors">
          {service.title}
        </h3>
        {service.subtitle && (
          <p className="mt-0.5 text-xs text-gray-400 leading-relaxed">{service.subtitle}</p>
        )}

        <div className="mt-auto pt-3 flex items-center justify-between border-t border-gray-100">
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span className="font-semibold text-gray-700">{service.rating}</span>
            <span className="text-gray-400">({formatNum(service.review_count)})</span>
          </div>
          <span className="text-sm font-bold text-primary">{formatPrice(service.price)}</span>
        </div>
      </div>
    </Link>
  );
}
