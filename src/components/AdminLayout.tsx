import { ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { LayoutDashboard, UtensilsCrossed, FileText, CalendarDays, BookOpen, Users, LogOut, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.webp";

const links = [
  { label: "Dashboard", to: "/admin", icon: LayoutDashboard },
  { label: "Menu", to: "/admin/menu", icon: UtensilsCrossed },
  { label: "Blog", to: "/admin/blog", icon: FileText },
  { label: "Events", to: "/admin/events", icon: CalendarDays },
  { label: "Reservations", to: "/admin/reservations", icon: BookOpen },
  { label: "Users", to: "/admin/users", icon: Users },
];

const AdminLayout = ({ children }: { children: ReactNode }) => {
  const { signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-60 bg-card border-r border-border flex flex-col shrink-0 hidden md:flex">
        <div className="p-4 border-b border-border">
          <img src={logo} alt="404" className="h-10" />
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {links.map((l) => {
            const Icon = l.icon;
            const active = location.pathname === l.to;
            return (
              <Link
                key={l.to}
                to={l.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                <Icon size={18} />
                {l.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-border space-y-1">
          <Link to="/" className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-secondary">
            <ArrowLeft size={18} /> Back to Site
          </Link>
          <button onClick={handleSignOut} className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-secondary w-full">
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-card border-b border-border px-4 py-3 flex items-center justify-between">
        <img src={logo} alt="404" className="h-8" />
        <div className="flex gap-2">
          {links.map((l) => {
            const Icon = l.icon;
            const active = location.pathname === l.to;
            return (
              <Link key={l.to} to={l.to} className={`p-2 rounded-md ${active ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>
                <Icon size={18} />
              </Link>
            );
          })}
          <button onClick={handleSignOut} className="p-2 text-muted-foreground"><LogOut size={18} /></button>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 p-4 md:p-8 pt-16 md:pt-8 overflow-auto">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
