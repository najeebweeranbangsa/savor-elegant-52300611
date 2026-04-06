import { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { UtensilsCrossed, FileText, CalendarDays, BookOpen } from "lucide-react";

const AdminDashboard = () => {
  const [stats, setStats] = useState({ menu: 0, blog: 0, events: 0, reservations: 0 });
  const [firstName, setFirstName] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const [m, b, e, r] = await Promise.all([
        supabase.from("menu_items").select("id", { count: "exact", head: true }),
        supabase.from("blog_posts").select("id", { count: "exact", head: true }),
        supabase.from("events").select("id", { count: "exact", head: true }),
        supabase.from("reservations").select("id", { count: "exact", head: true }),
      ]);
      setStats({
        menu: m.count ?? 0,
        blog: b.count ?? 0,
        events: e.count ?? 0,
        reservations: r.count ?? 0,
      });

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("first_name")
          .eq("id", user.id)
          .single();
        setFirstName(profile?.first_name || user.user_metadata?.first_name || "");
      }
    };
    fetchData();
  }, []);

  const cards = [
    { label: "Menu Items", value: stats.menu, icon: UtensilsCrossed },
    { label: "Blog Posts", value: stats.blog, icon: FileText },
    { label: "Events", value: stats.events, icon: CalendarDays },
    { label: "Reservations", value: stats.reservations, icon: BookOpen },
  ];

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold">
          {firstName ? `Welcome back, ${firstName}!` : "Dashboard"}
        </h1>
        {firstName && <p className="text-muted-foreground text-sm mt-1">Here's your dashboard overview</p>}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.label} className="bg-card p-6 rounded-lg border border-border">
              <div className="flex items-center gap-3 mb-2">
                <Icon size={20} className="text-primary" />
                <span className="text-muted-foreground text-sm">{c.label}</span>
              </div>
              <p className="font-display text-3xl font-bold">{c.value}</p>
            </div>
          );
        })}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
