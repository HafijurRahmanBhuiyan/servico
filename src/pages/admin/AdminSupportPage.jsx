import { useState, useEffect } from "react";
import { MessageSquare, Mail, Phone, Send, Trash2, X, User } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  fetchSupportMessages,
  replyToSupportMessage,
  deleteSupportMessage,
} from "@/lib/api";

const STATUS_FILTERS = ["All", "Open", "Replied", "Closed"];
const STATUS_MAP = { Open: "open", Replied: "replied", Closed: "closed" };

const SUBJECT_LABELS = {
  general: "General inquiry",
  booking: "Booking issue",
  provider: "Provider support",
  complaint: "Complaint",
  other: "Other",
};

export default function AdminSupportPage() {
  const [messages, setMessages] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [selected, setSelected] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [replyLoading, setReplyLoading] = useState(false);

  useEffect(() => {
    fetchSupportMessages().then(setMessages);
  }, []);

  const filtered = messages.filter((m) => {
    if (statusFilter === "All") return true;
    return m.status === STATUS_MAP[statusFilter];
  });

  const handleReply = async () => {
    if (!replyText.trim() || !selected) return;
    setReplyLoading(true);
    const result = await replyToSupportMessage(selected.id, replyText, "replied");
    setReplyLoading(false);

    if (!result.error) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === selected.id
            ? { ...m, admin_reply: replyText, status: "replied", replied_at: new Date().toISOString() }
            : m
        )
      );
      setSelected({ ...selected, admin_reply: replyText, status: "replied" });
      setReplyText("");
    }
  };

  const handleClose = async (id) => {
    await replyToSupportMessage(id, selected?.admin_reply || "", "closed");
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: "closed" } : m))
    );
    if (selected?.id === id) setSelected({ ...selected, status: "closed" });
  };

  const handleDelete = async (id) => {
    await deleteSupportMessage(id);
    setMessages((prev) => prev.filter((m) => m.id !== id));
    if (selected?.id === id) setSelected(null);
  };

  const formatDate = (d) => {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Support Messages</h1>
        <p className="mt-1 text-sm text-gray-500">Manage customer support requests</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-500">Status:</span>
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-semibold transition",
                statusFilter === s
                  ? "bg-emerald-600 text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-soft">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              <th className="px-5 py-3">User</th>
              <th className="px-5 py-3">Subject</th>
              <th className="px-5 py-3">Message</th>
              <th className="px-5 py-3">Date</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-gray-400">
                  No support messages found
                </td>
              </tr>
            )}
            {filtered.map((m) => (
              <tr
                key={m.id}
                className={cn(
                  "border-b border-gray-50 hover:bg-gray-50 cursor-pointer",
                  m.status === "closed" && "opacity-60"
                )}
                onClick={() => { setSelected(m); setReplyText(""); }}
              >
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">
                      {m.user_name?.[0]?.toUpperCase() || "U"}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{m.user_name}</div>
                      <div className="text-xs text-gray-400">{m.user_email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3 text-gray-600">
                  {SUBJECT_LABELS[m.subject] || m.subject}
                </td>
                <td className="px-5 py-3 text-gray-500 max-w-[200px] truncate">
                  {m.message}
                </td>
                <td className="px-5 py-3 text-gray-500">{formatDate(m.created_at)}</td>
                <td className="px-5 py-3">
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-1 text-xs font-semibold",
                      m.status === "open" && "bg-amber-50 text-amber-700",
                      m.status === "replied" && "bg-emerald-50 text-emerald-700",
                      m.status === "closed" && "bg-gray-100 text-gray-600"
                    )}
                  >
                    {m.status.charAt(0).toUpperCase() + m.status.slice(1)}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <a
                      href={`mailto:${m.user_email}?subject=Servico Support: ${SUBJECT_LABELS[m.subject] || m.subject}`}
                      className="rounded-lg p-1.5 text-gray-400 hover:bg-blue-50 hover:text-blue-500"
                      title="Email user"
                    >
                      <Mail className="h-4 w-4" />
                    </a>
                    {m.user_phone && (
                      <a
                        href={`tel:${m.user_phone}`}
                        className="rounded-lg p-1.5 text-gray-400 hover:bg-green-50 hover:text-green-600"
                        title="Call user"
                      >
                        <Phone className="h-4 w-4" />
                      </a>
                    )}
                    <button
                      onClick={() => handleDelete(m.id)}
                      className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail / Reply Panel */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="flex w-full max-w-2xl flex-col rounded-2xl bg-white shadow-elevated max-h-[85vh]">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <h2 className="text-lg font-bold text-gray-900">
                Support #{selected.id}
              </h2>
              <button
                onClick={() => setSelected(null)}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {/* User info */}
              <div className="flex items-center gap-4 rounded-xl bg-gray-50 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
                  {selected.user_name?.[0]?.toUpperCase() || "U"}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">{selected.user_name}</div>
                  <div className="text-sm text-gray-500">{selected.user_email}</div>
                  {selected.user_phone && (
                    <div className="text-sm text-gray-400">{selected.user_phone}</div>
                  )}
                </div>
                <div className="flex gap-2">
                  <a
                    href={`mailto:${selected.user_email}?subject=Servico Support: ${SUBJECT_LABELS[selected.subject] || selected.subject}`}
                    className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <Mail className="h-3.5 w-3.5" /> Email
                  </a>
                  {selected.user_phone && (
                    <a
                      href={`tel:${selected.user_phone}`}
                      className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                    >
                      <Phone className="h-3.5 w-3.5" /> Call
                    </a>
                  )}
                </div>
              </div>

              {/* Subject & Status */}
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  {SUBJECT_LABELS[selected.subject] || selected.subject}
                </span>
                <span
                  className={cn(
                    "rounded-full px-2.5 py-1 text-xs font-semibold",
                    selected.status === "open" && "bg-amber-50 text-amber-700",
                    selected.status === "replied" && "bg-emerald-50 text-emerald-700",
                    selected.status === "closed" && "bg-gray-100 text-gray-600"
                  )}
                >
                  {selected.status.charAt(0).toUpperCase() + selected.status.slice(1)}
                </span>
                <span className="ml-auto text-xs text-gray-400">
                  {formatDate(selected.created_at)}
                </span>
              </div>

              {/* User message */}
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <div className="text-xs font-semibold text-gray-400 mb-1">Customer Message</div>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{selected.message}</p>
              </div>

              {/* Admin reply (if exists) */}
              {selected.admin_reply && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                  <div className="text-xs font-semibold text-emerald-600 mb-1">Your Reply</div>
                  <p className="text-sm text-emerald-800 whitespace-pre-wrap">{selected.admin_reply}</p>
                  <div className="mt-2 text-xs text-emerald-500">
                    Replied {formatDate(selected.replied_at)}
                  </div>
                </div>
              )}
            </div>

            {/* Reply input */}
            {selected.status !== "closed" && (
              <div className="border-t border-gray-100 px-6 py-4 space-y-3">
                <textarea
                  rows={3}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your reply..."
                  className="input-field resize-none text-sm"
                />
                <div className="flex items-center gap-2 justify-end">
                  <button
                    onClick={() => handleClose(selected.id)}
                    className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50"
                  >
                    Close without reply
                  </button>
                  <button
                    onClick={handleReply}
                    disabled={!replyText.trim() || replyLoading}
                    className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
                  >
                    <Send className="h-3.5 w-3.5" />
                    {replyLoading ? "Sending..." : "Send Reply"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
