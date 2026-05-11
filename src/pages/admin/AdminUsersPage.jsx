import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ChevronLeft, ChevronRight, UserCheck, UserX } from "lucide-react";
import { cn } from "@/lib/utils";
import { fetchMockUsers, updateUserStatus } from "@/lib/api";

const USERS_PER_PAGE = 3;

export default function AdminUsersPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => { fetchMockUsers().then(setUsers); }, []);

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / USERS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * USERS_PER_PAGE, page * USERS_PER_PAGE);

  const handleToggle = async (id, currentStatus) => {
    const newStatus = currentStatus === "active" ? "suspended" : "active";
    await updateUserStatus(id, newStatus);
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, status: newStatus } : u)));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="mt-1 text-sm text-gray-500">Manage all registered users</p>
        </div>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
          {users.length} total
        </span>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          className="input-field pl-9"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        />
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-soft">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              <th className="px-5 py-3">Avatar</th>
              <th className="px-5 py-3">Name</th>
              <th className="px-5 py-3">Email</th>
              <th className="px-5 py-3">Phone</th>
              <th className="px-5 py-3">Joined</th>
              <th className="px-5 py-3">Bookings</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 && (
              <tr><td colSpan={8} className="px-5 py-12 text-center text-gray-400">No users found</td></tr>
            )}
            {paginated.map((u) => (
              <tr
                key={u.id}
                className={cn(
                  "border-b border-gray-50 hover:bg-gray-50",
                  u.status === "suspended" && "bg-red-50/40"
                )}
              >
                <td className="px-5 py-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-emerald-600 to-emerald-500 text-xs font-bold text-white">
                    {u.name[0]?.toUpperCase()}
                  </div>
                </td>
                <td className="px-5 py-3 font-medium">{u.name}</td>
                <td className="px-5 py-3 text-gray-500">{u.email}</td>
                <td className="px-5 py-3 text-gray-500">{u.phone}</td>
                <td className="px-5 py-3 text-gray-500">{u.joined_at}</td>
                <td className="px-5 py-3 font-semibold">{u.total_bookings}</td>
                <td className="px-5 py-3">
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-1 text-xs font-semibold",
                      u.status === "active"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-red-50 text-red-600"
                    )}
                  >
                    {u.status === "active" ? "Active" : "Suspended"}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => navigate("/admin/bookings")}
                      className="btn-secondary text-xs px-3 py-1"
                    >
                      View Bookings
                    </button>
                    <button
                      onClick={() => handleToggle(u.id, u.status)}
                      className={cn(
                        "rounded-lg px-3 py-1 text-xs font-semibold transition",
                        u.status === "active"
                          ? "border border-red-300 text-red-600 hover:bg-red-50"
                          : "border border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                      )}
                    >
                      {u.status === "active" ? "Suspend" : "Restore"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 text-sm">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="btn-secondary px-3 py-1.5 disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-gray-500">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="btn-secondary px-3 py-1.5 disabled:opacity-40"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
