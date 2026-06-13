import { useState, useEffect, useRef } from "react";
import { X, Send, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/AuthContext";
import { fetchMessages, sendMessage, markMessagesRead } from "@/lib/api";

export default function ChatBox({ booking, onClose }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!booking?.id) return;
    setLoading(true);
    setMessages([]);
    fetchMessages(booking.id).then((data) => {
      setMessages(Array.isArray(data) ? data : []);
      setLoading(false);
      markMessagesRead(booking.id);
    });
  }, [booking?.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!booking?.id) return;
    const interval = setInterval(async () => {
      const data = await fetchMessages(booking.id);
      if (Array.isArray(data)) setMessages(data);
    }, 3000);
    return () => clearInterval(interval);
  }, [booking?.id]);

  const handleSend = async () => {
    if (!input.trim() || !booking?.id) return;
    const msg = input.trim();
    setInput("");
    const sent = await sendMessage(booking.id, msg);
    if (sent && !sent.detail) {
      setMessages((prev) => [...prev, sent]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const isMyMessage = (m) => m.sender === user?.id;

  return (
    <div className="fixed bottom-6 right-6 z-50 w-80 sm:w-96 rounded-2xl bg-white shadow-elevated border border-gray-200 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between bg-gradient-to-r from-emerald-600 to-emerald-500 px-4 py-3 text-white">
        <div className="flex items-center gap-2 min-w-0">
          <MessageSquare className="h-4 w-4 shrink-0" />
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate">{booking?.service_title || booking?.service?.title || "Chat"}</p>
            <p className="text-[10px] opacity-80 truncate">{booking?.provider_name || booking?.customer_name || ""}</p>
          </div>
        </div>
        <button onClick={onClose} className="rounded-lg p-1 hover:bg-white/20 transition"><X className="h-4 w-4" /></button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[260px] max-h-[360px] bg-gray-50/50">
        {loading && (
          <div className="flex items-center justify-center h-full text-xs text-gray-400">Loading messages...</div>
        )}
        {!loading && messages.length === 0 && (
          <div className="flex items-center justify-center h-full text-xs text-gray-400">No messages yet. Say hello!</div>
        )}
        {messages.map((m) => {
          const mine = isMyMessage(m);
          return (
            <div key={m.id} className={cn("flex", mine ? "justify-end" : "justify-start")}>
              <div className={cn("max-w-[80%] rounded-2xl px-3.5 py-2 text-sm", mine ? "bg-emerald-600 text-white rounded-br-sm" : "bg-white border border-gray-200 text-gray-800 rounded-bl-sm shadow-sm")}>
                {!mine && <p className="text-[10px] font-semibold text-emerald-600 mb-0.5">{m.sender_name}</p>}
                <p className="whitespace-pre-wrap break-words">{m.message}</p>
                <p className={cn("text-[10px] mt-0.5", mine ? "text-emerald-200" : "text-gray-400")}>
                  {m.created_at ? new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-100 p-3 flex gap-2">
        <input
          className="input-field flex-1 text-sm"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          onClick={handleSend}
          disabled={!input.trim()}
          className="rounded-xl bg-emerald-600 p-2.5 text-white hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition shrink-0"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
