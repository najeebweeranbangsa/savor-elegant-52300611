import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Tables } from "@/integrations/supabase/types";

type Reservation = Tables<"reservations">;

const AdminReservationsPrintPage = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("reservations")
      .select("*")
      .eq("status", "approved")
      .order("reservation_date", { ascending: true })
      .then(({ data }) => {
        setReservations(data || []);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Screen-only controls */}
      <div className="print:hidden p-4 flex items-center gap-3 border-b border-border">
        <Link to="/admin/reservations">
          <Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button>
        </Link>
        <Button size="sm" onClick={() => window.print()}>Print Page</Button>
      </div>

      {/* Printable content */}
      <div className="p-6 md:p-10 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-1">Approved Reservations</h1>
        <p className="text-muted-foreground text-sm mb-6 print:text-black">
          Printed on {new Date().toLocaleDateString()}
        </p>

        {loading ? (
          <p className="text-muted-foreground">Loading…</p>
        ) : reservations.length === 0 ? (
          <p className="text-muted-foreground">No approved reservations found.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Guests</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reservations.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.full_name}</TableCell>
                  <TableCell>{r.reservation_date}</TableCell>
                  <TableCell>{r.reservation_time}</TableCell>
                  <TableCell>{r.guests}</TableCell>
                  <TableCell>{r.phone}</TableCell>
                  <TableCell>{r.email}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{r.notes || "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default AdminReservationsPrintPage;
