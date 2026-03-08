import { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import type { Tables } from "@/integrations/supabase/types";

type Reservation = Tables<"reservations">;

const AdminReservationsPage = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);

  useEffect(() => {
    supabase.from("reservations").select("*").order("created_at", { ascending: false }).then(({ data }) => {
      setReservations(data || []);
    });
  }, []);

  return (
    <AdminLayout>
      <h1 className="font-display text-3xl font-bold mb-6">Reservations</h1>
      <div className="space-y-3">
        {reservations.map((r) => (
          <div key={r.id} className="bg-card p-4 rounded border border-border">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold">{r.full_name}</h3>
                <p className="text-muted-foreground text-sm">{r.email} · {r.phone}</p>
                <p className="text-sm mt-1">{r.reservation_date} at {r.reservation_time} · {r.guests} guest{r.guests !== 1 ? "s" : ""}</p>
                {r.notes && <p className="text-muted-foreground text-sm mt-1 italic">{r.notes}</p>}
              </div>
              <Badge variant={r.status === "pending" ? "secondary" : "default"}>{r.status}</Badge>
            </div>
          </div>
        ))}
        {reservations.length === 0 && <p className="text-muted-foreground">No reservations yet.</p>}
      </div>
    </AdminLayout>
  );
};

export default AdminReservationsPage;
