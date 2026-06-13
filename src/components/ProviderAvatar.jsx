import { cn, getAvatarUrl } from "@/lib/utils";

function getInitials(name) {
  if (!name) return "?";
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

export default function ProviderAvatar({ avatar, name, size = "md", className }) {
  const sizes = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base",
    xl: "h-16 w-16 text-xl",
    "2xl": "h-20 w-20 text-2xl",
  };

  const avatarUrl = getAvatarUrl(avatar);

  if (avatarUrl) {
    return (
      <div className={cn("shrink-0 overflow-hidden rounded-full border-2 border-emerald-200", sizes[size], className)}>
        <img src={avatarUrl} alt={name || "Avatar"} className="h-full w-full object-cover" />
      </div>
    );
  }

  return (
    <div className={cn("flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-600 to-emerald-500 font-bold text-white", sizes[size], className)}>
      {getInitials(name)}
    </div>
  );
}
