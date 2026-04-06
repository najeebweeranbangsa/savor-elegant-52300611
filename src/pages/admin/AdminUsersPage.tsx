import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Trash2, Loader2, Users } from "lucide-react";
import { format } from "date-fns";

interface AppUser {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  first_name: string;
  last_name: string;
  roles: string[];
}

const AdminUsersPage = () => {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await supabase.functions.invoke("manage-users", {
        method: "GET",
      });
      if (res.error) throw res.error;
      setUsers(res.data || []);
    } catch (err: any) {
      toast.error(err.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (userId: string) => {
    setDeleting(userId);
    try {
      const res = await supabase.functions.invoke("manage-users", {
        method: "DELETE",
        body: { userId },
      });
      if (res.error) throw res.error;
      if (res.data?.error) throw new Error(res.data.error);
      toast.success("User deleted");
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    } catch (err: any) {
      toast.error(err.message || "Failed to delete user");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-3xl font-bold">Users</h1>
          <Badge variant="secondary" className="text-sm">
            <Users size={14} className="mr-1" /> {users.length} users
          </Badge>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="border border-border rounded-lg overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Last Sign In</TableHead>
                  <TableHead className="w-[60px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell className="font-medium">
                      {u.first_name || u.last_name
                        ? `${u.first_name} ${u.last_name}`.trim()
                        : "—"}
                    </TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>
                      {u.roles.length > 0 ? (
                        u.roles.map((r) => (
                          <Badge key={r} variant={r === "admin" ? "default" : "secondary"} className="mr-1">
                            {r}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-muted-foreground text-sm">user</span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {format(new Date(u.created_at), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {u.last_sign_in_at
                        ? format(new Date(u.last_sign_in_at), "MMM d, yyyy")
                        : "Never"}
                    </TableCell>
                    <TableCell>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" disabled={u.roles.includes("admin")}>
                            <Trash2 size={16} />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete user?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete <strong>{u.email}</strong> and all their data. This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(u.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              {deleting === u.id ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete"}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
                {users.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                      No users found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminUsersPage;
