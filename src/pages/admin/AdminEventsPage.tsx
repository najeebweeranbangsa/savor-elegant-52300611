import { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Event = Tables<"events">;

const AdminEventsPage = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Event | null>(null);
  const [form, setForm] = useState({ title: "", description: "", date: "", time: "", location: "404 Sports Bar" });

  const fetchEvents = async () => {
    const { data } = await supabase.from("events").select("*").order("created_at", { ascending: false });
    setEvents(data || []);
  };

  useEffect(() => { fetchEvents(); }, []);

  const openDialog = (event?: Event) => {
    if (event) {
      setEditing(event);
      setForm({ title: event.title, description: event.description || "", date: event.date, time: event.time || "", location: event.location || "404 Sports Bar" });
    } else {
      setEditing(null);
      setForm({ title: "", description: "", date: "", time: "", location: "404 Sports Bar" });
    }
    setDialogOpen(true);
  };

  const save = async () => {
    if (editing) {
      await supabase.from("events").update(form).eq("id", editing.id);
    } else {
      await supabase.from("events").insert(form);
    }
    setDialogOpen(false);
    toast.success("Event saved");
    fetchEvents();
  };

  const deleteEvent = async (id: string) => {
    if (!confirm("Delete this event?")) return;
    await supabase.from("events").delete().eq("id", id);
    toast.success("Event deleted");
    fetchEvents();
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-3xl font-bold">Events Management</h1>
        <Button size="sm" onClick={() => openDialog()}><Plus size={16} className="mr-1" /> New Event</Button>
      </div>

      <div className="space-y-3">
        {events.map((event) => (
          <div key={event.id} className="flex items-center justify-between bg-card p-4 rounded border border-border">
            <div>
              <h3 className="font-semibold">{event.title}</h3>
              <p className="text-muted-foreground text-sm">{event.date} · {event.time}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => openDialog(event)} className="text-muted-foreground hover:text-foreground"><Pencil size={14} /></button>
              <button onClick={() => deleteEvent(event.id)} className="text-muted-foreground hover:text-destructive"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
        {events.length === 0 && <p className="text-muted-foreground">No events yet.</p>}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? "Edit" : "New"} Event</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <Input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <Textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <Input placeholder="Date (e.g. Every Saturday or March 14, 2026)" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            <Input placeholder="Time (e.g. 8PM – 11PM)" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
            <Input placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            <Button onClick={save} className="w-full">Save</Button>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminEventsPage;
