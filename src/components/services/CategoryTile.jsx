import { useState } from "react";
import { Link } from "react-router-dom";

export default function CategoryTile({ category }) {
  const [imgError, setImgError] = useState(false);

  return (
    <Link
      to={`/category/${category.slug}`}
      className="group flex flex-col items-center gap-2 rounded-2xl border border-gray-200 bg-white p-3 text-center shadow-soft transition-all duration-200 hover:shadow-elevated hover:border-emerald-300 hover:-translate-y-0.5 overflow-hidden"
    >
      <div className="relative flex h-12 w-12 items-center justify-center rounded-xl overflow-hidden bg-emerald-50 transition-all group-hover:bg-emerald-100">
        {category.image_url && !imgError ? (
          <img
            src={category.image_url}
            alt={category.label}
            onError={() => setImgError(true)}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        ) : (
          <span className="text-2xl transition-transform duration-200 group-hover:scale-110">
            {category.icon}
          </span>
        )}
      </div>
      <span className="text-xs font-medium leading-tight text-gray-700 group-hover:text-emerald-700 transition-colors">
        {category.label}
      </span>
    </Link>
  );
}
