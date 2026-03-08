import { useEffect, useState, useRef } from "react";
import AdminLayout from "@/components/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Upload, X } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";
import RichTextEditor from "@/components/RichTextEditor";

type BlogPost = Tables<"blog_posts">;

const AdminBlogPage = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [form, setForm] = useState({ title: "", excerpt: "", content: "", image_url: "", published: false });
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchPosts = async () => {
    const { data } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false });
    setPosts(data || []);
  };

  useEffect(() => { fetchPosts(); }, []);

  const openDialog = (post?: BlogPost) => {
    if (post) {
      setEditing(post);
      setForm({ title: post.title, excerpt: post.excerpt || "", content: post.content || "", image_url: post.image_url || "", published: post.published });
    } else {
      setEditing(null);
      setForm({ title: "", excerpt: "", content: "", image_url: "", published: false });
    }
    setDialogOpen(true);
  };

  const handleFeaturedImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `featured/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { error } = await supabase.storage.from("blog-images").upload(path, file);
    if (error) {
      toast.error("Failed to upload image");
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from("blog-images").getPublicUrl(path);
    setForm((prev) => ({ ...prev, image_url: data.publicUrl }));
    setUploading(false);
    toast.success("Image uploaded");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const save = async () => {
    const payload = { ...form, published_at: form.published ? new Date().toISOString() : null } as any;
    if (editing) {
      await supabase.from("blog_posts").update(payload).eq("id", editing.id);
    } else {
      await supabase.from("blog_posts").insert(payload);
    }
    setDialogOpen(false);
    toast.success("Post saved");
    fetchPosts();
  };

  const deletePost = async (id: string) => {
    if (!confirm("Delete this post?")) return;
    await supabase.from("blog_posts").delete().eq("id", id);
    toast.success("Post deleted");
    fetchPosts();
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-3xl font-bold">Blog Management</h1>
        <Button size="sm" onClick={() => openDialog()}><Plus size={16} className="mr-1" /> New Post</Button>
      </div>

      <div className="space-y-3">
        {posts.map((post) => (
          <div key={post.id} className="flex items-center justify-between bg-card p-4 rounded border border-border">
            <div className="flex items-center gap-3">
              {post.image_url && (
                <img src={post.image_url} alt="" className="w-12 h-12 rounded object-cover" />
              )}
              <div>
                <h3 className="font-semibold">{post.title}</h3>
                <p className="text-muted-foreground text-sm">{post.published ? "Published" : "Draft"} · {new Date(post.created_at).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => openDialog(post)} className="text-muted-foreground hover:text-foreground"><Pencil size={14} /></button>
              <button onClick={() => deletePost(post.id)} className="text-muted-foreground hover:text-destructive"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
        {posts.length === 0 && <p className="text-muted-foreground">No blog posts yet.</p>}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing ? "Edit" : "New"} Blog Post</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <Input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <Input placeholder="Excerpt (short summary)" value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} />

            {/* Featured Image Upload */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Featured Image</label>
              {form.image_url ? (
                <div className="relative inline-block">
                  <img src={form.image_url} alt="Featured" className="w-full max-h-48 object-cover rounded-md" />
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, image_url: "" })}
                    className="absolute top-2 right-2 bg-background/80 rounded-full p-1 hover:bg-destructive hover:text-destructive-foreground transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-border rounded-md p-6 text-center cursor-pointer hover:border-primary transition-colors"
                >
                  <Upload size={24} className="mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    {uploading ? "Uploading..." : "Click to upload featured image"}
                  </p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFeaturedImageUpload}
              />
            </div>

            {/* Rich Text Editor */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Content</label>
              <RichTextEditor
                content={form.content}
                onChange={(html) => setForm({ ...form, content: html })}
              />
            </div>

            <div className="flex items-center gap-2">
              <Switch checked={form.published} onCheckedChange={(v) => setForm({ ...form, published: v })} />
              <span className="text-sm">Published</span>
            </div>
            <Button onClick={save} className="w-full">Save</Button>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminBlogPage;
