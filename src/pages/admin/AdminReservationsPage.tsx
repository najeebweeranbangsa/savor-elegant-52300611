import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "@/components/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Printer, Check, X } from "lucide-react";
import { toast } from "sonner";
import type { Tables } from "@/integrations/supabase/types";

type Reservation = Tables<"reservations">;

const AdminReservationsPage = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);

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

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-3xl font-bold">Reservations</h1>
        <Link to="/admin/reservations/print">
          <Button variant="outline" size="sm"><Printer className="w-4 h-4 mr-2" /> Print Approved</Button>
        </Link>
      </div>
      <div className="space-y-3">
        {reservations.map((r) => (
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
        ))}
        {reservations.length === 0 && <p className="text-muted-foreground">No reservations yet.</p>}
      </div>
    </AdminLayout>
  );
};

export default AdminReservationsPage;
