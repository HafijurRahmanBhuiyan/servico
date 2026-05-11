import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { fetchProviderBookings } from "@/lib/api";

function getWeekDates(baseDate) {
  const start = new Date(baseDate);
  start.setDate(start.getDate() - start.getDay() + 1);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    return d;
  });
}

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const defaultAvailability = {
  Mon: { available: true, from: "09:00", to: "18:00" },
  Tue: { available: true, from: "09:00", to: "18:00" },
  Wed: { available: true, from: "09:00", to: "18:00" },
  Thu: { available: true, from: "09:00", to: "18:00" },
  Fri: { available: true, from: "09:00", to: "18:00" },
  Sat: { available: false, from: "10:00", to: "16:00" },
  Sun: { available: false, from: "10:00", to: "16:00" },
};

const HOURS = Array.from({ length: 15 }, (_, i) => {
  const h = i + 8;
  return `${h.toString().padStart(2, "0")}:00`;
});

export default function ProviderSchedulePage() {
  const [bookings, setBookings] = useState([]);
  const [weekOffset, setWeekOffset] = useState(0);
  const [availability, setAvailability] = useState(defaultAvailability);
  const [toast, setToast] = useState(null);

  useEffect(() => { fetchProviderBookings("u2").then(setBookings); }, []);

  const today = new Date();
  const baseDate = new Date(today);
  baseDate.setDate(baseDate.getDate() + weekOffset * 7);
  const weekDates = getWeekDates(baseDate);

  const todayStr = today.toDateString();

  const todayBookings = bookings.filter((b) => b.status === "accepted" || b.status === "pending");

  const handleSave = () => {
    setToast("Availability saved!");
    setTimeout(() => setToast(null), 3000);
  };

  const toggleDay = (day) => {
    setAvailability((prev) => ({
      ...prev,
      [day]: { ...prev[day], available: !prev[day].available },
    }));
  };

  return (
    <div className="space-y-6">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-elevated">
          {toast}
        </div>
      )}

      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Schedule</h1>
        <p className="mt-1 text-sm text-gray-500">View your weekly jobs and manage availability</p>
      </div>

      {/* Week navigation */}
      <div className="flex items-center justify-between">
        <button onClick={() => setWeekOffset(weekOffset - 1)} className="btn-secondary px-3 py-1.5">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="text-sm font-semibold text-gray-700">
          {weekDates[0].toLocaleDateString("en-BD", { month: "short", day: "numeric" })} — {weekDates[6].toLocaleDateString("en-BD", { month: "short", day: "numeric", year: "numeric" })}
        </span>
        <button onClick={() => setWeekOffset(weekOffset + 1)} className="btn-secondary px-3 py-1.5">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-2">
        {weekDates.map((date, i) => {
          const dateStr = date.toDateString();
          const isToday = dateStr === todayStr;
          const dayName = DAYS[i];
          const dayBookings = todayBookings.filter((b) => {
            const bDate = new Date(b.date);
            return bDate.toDateString() === dateStr;
          });

          return (
            <div
              key={i}
              className={cn(
                "rounded-xl border p-2 min-h-[140px]",
                isToday ? "bg-emerald-50 border-emerald-200" : "bg-white border-gray-200"
              )}
            >
              <div className={cn("text-center pb-1 mb-1 border-b", isToday ? "border-emerald-200" : "border-gray-100")}>
                <div className="text-[10px] font-semibold text-gray-500 uppercase">{dayName}</div>
                <div className={cn("text-sm font-bold", isToday ? "text-emerald-700" : "text-gray-900")}>
                  {date.getDate()}
                </div>
              </div>
              <div className="space-y-1">
                {dayBookings.map((b) => (
                  <div key={b.id} className="rounded-lg border-l-4 border-emerald-500 bg-emerald-50 p-1.5 text-[10px] leading-tight">
                    <div className="font-medium text-gray-800 truncate">{b.time}</div>
                    <div className="text-gray-500 truncate">{b.service_title}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Availability settings */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-soft">
        <h2 className="text-sm font-bold text-gray-900 mb-4">Availability Settings</h2>
        <div className="space-y-3">
          {DAYS.map((day) => (
            <div key={day} className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => toggleDay(day)}
                className={cn(
                  "relative h-6 w-11 rounded-full transition shrink-0",
                  availability[day].available ? "bg-emerald-600" : "bg-gray-300"
                )}
              >
                <span className={cn(
                  "absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition",
                  availability[day].available && "translate-x-5"
                )} />
              </button>
              <span className={cn("text-sm font-medium w-10", availability[day].available ? "text-gray-900" : "text-gray-400")}>{day}</span>
              {availability[day].available && (
                <>
                  <select
                    className="input-field w-auto text-xs py-1"
                    value={availability[day].from}
                    onChange={(e) => setAvailability((prev) => ({ ...prev, [day]: { ...prev[day], from: e.target.value } }))}
                  >
                    {HOURS.map((h) => <option key={h} value={h}>{h}</option>)}
                  </select>
                  <span className="text-xs text-gray-400">to</span>
                  <select
                    className="input-field w-auto text-xs py-1"
                    value={availability[day].to}
                    onChange={(e) => setAvailability((prev) => ({ ...prev, [day]: { ...prev[day], to: e.target.value } }))}
                  >
                    {HOURS.map((h) => <option key={h} value={h}>{h}</option>)}
                  </select>
                </>
              )}
            </div>
          ))}
        </div>
        <button onClick={handleSave} className="btn-primary mt-4">
          <Check className="mr-1.5 h-4 w-4" /> Save Availability
        </button>
      </div>
    </div>
  );
}
