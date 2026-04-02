import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "@/components/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Printer, Check, X, CalendarDays, List, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import type { Tables } from "@/integrations/supabase/types";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  parseISO,
  isToday,
} from "date-fns";

type Reservation = Tables<"reservations">;

const AdminReservationsPage = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [view, setView] = useState<"list" | "calendar">("calendar");
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const fetchReservations = async () => {
    const { data } = await supabase.from("reservations").select("*").order("created_at", { ascending: false });
    setReservations(data || []);
  };

  useEffect(() => { fetchReservations(); }, []);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("reservations").update({ status }).eq("id", id);
    if (error) {
      toast.error("Failed to update status");
    } else {
      toast.success(`Reservation ${status}`);
      fetchReservations();
    }
  };

  const statusColor = (s: string) => {
    if (s === "approved") return "default";
    if (s === "rejected") return "destructive";
    return "secondary";
  };

  // Group reservations by date for calendar
  const reservationsByDate = useMemo(() => {
    const map: Record<string, Reservation[]> = {};
    reservations.forEach((r) => {
      const key = r.reservation_date;
      if (!map[key]) map[key] = [];
      map[key].push(r);
    });
    return map;
  }, [reservations]);

  // Calendar days grid
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const start = startOfWeek(monthStart);
    const end = endOfWeek(monthEnd);
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  const filteredReservations = selectedDate
    ? reservations.filter((r) => r.reservation_date === format(selectedDate, "yyyy-MM-dd"))
    : reservations;

  const ReservationCard = ({ r }: { r: Reservation }) => (
    <div key={r.id} className="bg-card p-4 rounded border border-border">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h3 className="font-semibold">{r.full_name}</h3>
          <p className="text-muted-foreground text-sm">{r.email} · {r.phone}</p>
          <p className="text-sm mt-1">{r.reservation_date} at {r.reservation_time} · {r.guests} guest{r.guests !== 1 ? "s" : ""}</p>
          {r.notes && <p className="text-muted-foreground text-sm mt-1 italic">{r.notes}</p>}
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={statusColor(r.status)}>{r.status}</Badge>
          {r.status === "pending" && (
            <>
              <Button size="icon" variant="ghost" className="text-green-600 hover:text-green-700 hover:bg-green-50" onClick={() => updateStatus(r.id, "approved")}>
                <Check className="w-4 h-4" />
              </Button>
              <Button size="icon" variant="ghost" className="text-destructive hover:bg-red-50" onClick={() => updateStatus(r.id, "rejected")}>
                <X className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );

  const getStatusDot = (status: string) => {
    if (status === "approved") return "bg-green-500";
    if (status === "rejected") return "bg-red-500";
    return "bg-yellow-500";
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-3xl font-bold">Reservations</h1>
        <div className="flex items-center gap-2">
          <div className="flex bg-card border border-border rounded-md overflow-hidden">
            <button
              onClick={() => { setView("calendar"); setSelectedDate(null); }}
              className={`px-3 py-1.5 text-sm flex items-center gap-1.5 transition-colors ${view === "calendar" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              <CalendarDays className="w-4 h-4" /> Calendar
            </button>
            <button
              onClick={() => { setView("list"); setSelectedDate(null); }}
              className={`px-3 py-1.5 text-sm flex items-center gap-1.5 transition-colors ${view === "list" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              <List className="w-4 h-4" /> List
            </button>
          </div>
          <Link to="/admin/reservations/print">
            <Button variant="outline" size="sm"><Printer className="w-4 h-4 mr-2" /> Print Approved</Button>
          </Link>
        </div>
      </div>

      {view === "calendar" && (
        <div className="space-y-4">
          {/* Month navigation */}
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <h2 className="font-display text-xl font-semibold">{format(currentMonth, "MMMM yyyy")}</h2>
            <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 border border-border rounded-lg overflow-hidden">
            {/* Day headers */}
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="bg-muted px-2 py-2 text-center text-xs font-medium text-muted-foreground border-b border-border">
                {day}
              </div>
            ))}

            {/* Day cells */}
            {calendarDays.map((day) => {
              const dateKey = format(day, "yyyy-MM-dd");
              const dayReservations = reservationsByDate[dateKey] || [];
              const inMonth = isSameMonth(day, currentMonth);
              const selected = selectedDate && isSameDay(day, selectedDate);
              const today = isToday(day);

              return (
                <button
                  key={dateKey}
                  onClick={() => setSelectedDate(selected ? null : day)}
                  className={`min-h-[80px] md:min-h-[100px] p-1.5 border-b border-r border-border text-left transition-colors flex flex-col ${
                    !inMonth ? "opacity-30" : ""
                  } ${selected ? "bg-primary/10 ring-1 ring-primary" : "hover:bg-muted/50"}`}
                >
                  <span className={`text-xs font-medium inline-flex items-center justify-center w-6 h-6 rounded-full ${
                    today ? "bg-primary text-primary-foreground" : ""
                  }`}>
                    {format(day, "d")}
                  </span>
                  {dayReservations.length > 0 && (
                    <div className="mt-1 space-y-0.5 flex-1 overflow-hidden">
                      {dayReservations.slice(0, 3).map((r) => (
                        <div key={r.id} className="flex items-center gap-1 text-[10px] leading-tight truncate">
                          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${getStatusDot(r.status)}`} />
                          <span className="truncate">{r.full_name}</span>
                        </div>
                      ))}
                      {dayReservations.length > 3 && (
                        <span className="text-[10px] text-muted-foreground">+{dayReservations.length - 3} more</span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Selected date detail */}
          {selectedDate && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-lg font-semibold">
                  {format(selectedDate, "EEEE, MMMM d, yyyy")}
                  <span className="text-muted-foreground font-normal ml-2 text-sm">
                    ({filteredReservations.length} reservation{filteredReservations.length !== 1 ? "s" : ""})
                  </span>
                </h3>
                <Button variant="ghost" size="sm" onClick={() => setSelectedDate(null)}>Clear</Button>
              </div>
              {filteredReservations.length === 0 ? (
                <p className="text-muted-foreground text-sm">No reservations for this date.</p>
              ) : (
                filteredReservations.map((r) => <ReservationCard key={r.id} r={r} />)
              )}
            </div>
          )}
        </div>
      )}

      {view === "list" && (
        <div className="space-y-3">
          {reservations.map((r) => <ReservationCard key={r.id} r={r} />)}
          {reservations.length === 0 && <p className="text-muted-foreground">No reservations yet.</p>}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminReservationsPage;
