import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Users,
  UserCheck,
  UserX,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { fetchMockUsers, updateUserStatus } from "@/lib/api";

const USERS_PER_PAGE = 10;

// ─── Small helpers ────────────────────────────────────────────────────────────

function Avatar({ name }) {
  return (
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-600 to-emerald-500 text-xs font-bold text-white select-none">
      {name?.[0]?.toUpperCase() ?? "?"}
    </div>
  );
}

function StatusBadge({ status }) {
  const isActive = status === "active";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold",
        isActive ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          isActive ? "bg-emerald-500" : "bg-red-400"
        )}
      />
      {isActive ? "Active" : "Suspended"}
    </span>
  );
}

// "New" badge only shown for users who registered through the website
function NewBadge({ source }) {
  if (source !== "registered") return null;
  return (
    <span className="ml-1.5 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-600">
      New
    </span>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function AdminUsersPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // "all" | "active" | "suspended"
  const [page, setPage] = useState(1);
  const [togglingId, setTogglingId] = useState(null);

  // ── Load / reload the full merged user list ──────────────────────────────
  const loadUsers = useCallback(async () => {
    setLoading(true);
    const data = await fetchMockUsers();
    setUsers(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // ── Filtering ─────────────────────────────────────────────────────────────
  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (u.phone || "").includes(q);
    const matchesStatus =
      statusFilter === "all" || u.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / USERS_PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice(
    (safePage - 1) * USERS_PER_PAGE,
    safePage * USERS_PER_PAGE
  );

  // ── Stat counts ───────────────────────────────────────────────────────────
  const totalCount = users.length;
  const activeCount = users.filter((u) => u.status === "active").length;
  const suspendedCount = users.filter((u) => u.status === "suspended").length;
  const newCount = users.filter((u) => u.source === "registered").length;

  // ── Suspend / Restore ─────────────────────────────────────────────────────
  const handleToggle = async (id, currentStatus) => {
    const newStatus = currentStatus === "active" ? "suspended" : "active";
    setTogglingId(id);
    await updateUserStatus(id, newStatus);
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: newStatus } : u))
    );
    setTogglingId(null);
  };

  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="mt-0.5 text-sm text-gray-500">
            All registered users — website sign-ups appear at the top
          </p>
        </div>
        <button
          onClick={loadUsers}
          className="btn-secondary flex items-center gap-1.5 px-3 py-2 text-xs"
          title="Refresh list"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Refresh
        </button>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {/* Total */}
        <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-soft">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100">
            <Users className="h-5 w-5 text-gray-600" />
          </div>
          <div>
            <div className="text-2xl font-black text-gray-900">{totalCount}</div>
            <div className="text-xs font-medium text-gray-500">Total users</div>
          </div>
        </div>
        {/* Active */}
        <div className="flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 shadow-soft">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100">
            <UserCheck className="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <div className="text-2xl font-black text-emerald-700">{activeCount}</div>
            <div className="text-xs font-medium text-emerald-600">Active</div>
          </div>
        </div>
        {/* Suspended */}
        <div className="flex items-center gap-3 rounded-2xl border border-red-100 bg-red-50 p-4 shadow-soft">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100">
            <UserX className="h-5 w-5 text-red-500" />
          </div>
          <div>
            <div className="text-2xl font-black text-red-600">{suspendedCount}</div>
            <div className="text-xs font-medium text-red-500">Suspended</div>
          </div>
        </div>
        {/* New sign-ups */}
        <div className="flex items-center gap-3 rounded-2xl border border-blue-100 bg-blue-50 p-4 shadow-soft">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100">
            <Users className="h-5 w-5 text-blue-500" />
          </div>
          <div>
            <div className="text-2xl font-black text-blue-600">{newCount}</div>
            <div className="text-xs font-medium text-blue-500">New sign-ups</div>
          </div>
        </div>
      </div>

      {/* ── Filters row ── */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative min-w-48 flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            className="input-field pl-9"
            placeholder="Search by name, email or phone…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>

        {/* Status pills */}
        <div className="flex rounded-xl border border-gray-200 bg-white p-1 shadow-soft">
          {["all", "active", "suspended"].map((f) => (
            <button
              key={f}
              onClick={() => {
                setStatusFilter(f);
                setPage(1);
              }}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition",
                statusFilter === f
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              )}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Result count */}
        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-500">
          {filtered.length} user{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* ── Table ── */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-soft">
        {loading ? (
          // Loading skeleton
          <div className="divide-y divide-gray-100">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-4">
                <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-32 animate-pulse rounded bg-gray-200" />
                  <div className="h-2.5 w-48 animate-pulse rounded bg-gray-100" />
                </div>
                <div className="h-6 w-16 animate-pulse rounded-full bg-gray-100" />
              </div>
            ))}
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500">
                <th className="px-5 py-3">User</th>
                <th className="hidden px-5 py-3 sm:table-cell">Phone</th>
                <th className="hidden px-5 py-3 md:table-cell">Joined</th>
                <th className="hidden px-5 py-3 lg:table-cell">Bookings</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-16 text-center">
                    <div className="flex flex-col items-center gap-2 text-gray-400">
                      <Users className="h-8 w-8 text-gray-200" />
                      <span className="text-sm">
                        {search || statusFilter !== "all"
                          ? "No users match your filters"
                          : "No users yet"}
                      </span>
                    </div>
                  </td>
                </tr>
              )}
              {paginated.map((u) => (
                <tr
                  key={u.id}
                  className={cn(
                    "border-b border-gray-50 transition hover:bg-gray-50/60",
                    u.status === "suspended" && "bg-red-50/30"
                  )}
                >
                  {/* User: avatar + name + email */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <Avatar name={u.name} />
                      <div className="min-w-0">
                        <div className="flex items-center font-semibold text-gray-900">
                          <span className="truncate">{u.name}</span>
                          <NewBadge source={u.source} />
                        </div>
                        <div className="truncate text-xs text-gray-400">
                          {u.email}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Phone */}
                  <td className="hidden px-5 py-3.5 text-gray-500 sm:table-cell">
                    {u.phone || <span className="text-gray-300">—</span>}
                  </td>

                  {/* Joined date */}
                  <td className="hidden px-5 py-3.5 text-gray-500 md:table-cell">
                    {u.joined_at || <span className="text-gray-300">—</span>}
                  </td>

                  {/* Booking count */}
                  <td className="hidden px-5 py-3.5 font-semibold text-gray-700 lg:table-cell">
                    {u.total_bookings ?? 0}
                  </td>

                  {/* Status badge */}
                  <td className="px-5 py-3.5">
                    <StatusBadge status={u.status} />
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => navigate("/admin/bookings")}
                        className="btn-secondary px-2.5 py-1 text-xs"
                      >
                        Bookings
                      </button>
                      <button
                        disabled={togglingId === u.id}
                        onClick={() => handleToggle(u.id, u.status)}
                        className={cn(
                          "rounded-lg px-2.5 py-1 text-xs font-semibold transition disabled:opacity-40",
                          u.status === "active"
                            ? "border border-red-200 text-red-600 hover:bg-red-50"
                            : "border border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                        )}
                      >
                        {togglingId === u.id
                          ? "…"
                          : u.status === "active"
                          ? "Suspend"
                          : "Restore"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400 text-xs">
            Showing {(safePage - 1) * USERS_PER_PAGE + 1}–
            {Math.min(safePage * USERS_PER_PAGE, filtered.length)} of{" "}
            {filtered.length}
          </span>
          <div className="flex items-center gap-2">
            <button
              disabled={safePage === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="btn-secondary px-3 py-1.5 disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(
                  (n) =>
                    n === 1 ||
                    n === totalPages ||
                    Math.abs(n - safePage) <= 1
                )
                .reduce((acc, n, i, arr) => {
                  if (i > 0 && n - arr[i - 1] > 1) acc.push("…");
                  acc.push(n);
                  return acc;
                }, [])
                .map((item, idx) =>
                  item === "…" ? (
                    <span key={`ellipsis-${idx}`} className="px-1 text-gray-400">
                      …
                    </span>
                  ) : (
                    <button
                      key={item}
                      onClick={() => setPage(item)}
                      className={cn(
                        "h-8 w-8 rounded-lg text-xs font-semibold transition",
                        safePage === item
                          ? "bg-emerald-600 text-white"
                          : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                      )}
                    >
                      {item}
                    </button>
                  )
                )}
            </div>
            <button
              disabled={safePage === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="btn-secondary px-3 py-1.5 disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
