import { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Archive, ArchiveRestore } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Category = Tables<"menu_categories"> & { archived?: boolean };
type MenuItem = Tables<"menu_items"> & { archived?: boolean };

const AdminMenuPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [catName, setCatName] = useState("");
  const [catDialogOpen, setCatDialogOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<Category | null>(null);
  const [showArchived, setShowArchived] = useState(false);

  const [itemDialogOpen, setItemDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [itemForm, setItemForm] = useState({ name: "", description: "", price: "", category_id: "" });

  const fetchData = async () => {
    const [c, i] = await Promise.all([
      supabase.from("menu_categories").select("*").order("sort_order"),
      supabase.from("menu_items").select("*").order("sort_order"),
    ]);
    setCategories(c.data || []);
    setItems(i.data || []);
  };

  useEffect(() => { fetchData(); }, []);

  const visibleCategories = categories.filter((c) => showArchived ? (c as any).archived : !(c as any).archived);

  // Category CRUD
  const saveCategory = async () => {
    if (!catName.trim()) return;
    if (editingCat) {
      await supabase.from("menu_categories").update({ name: catName }).eq("id", editingCat.id);
    } else {
      await supabase.from("menu_categories").insert({ name: catName, sort_order: categories.length });
    }
    setCatName("");
    setEditingCat(null);
    setCatDialogOpen(false);
    toast.success("Category saved");
    fetchData();
  };

  const deleteCategory = async (id: string) => {
    if (!confirm("Delete this category and all its items?")) return;
    await supabase.from("menu_categories").delete().eq("id", id);
    toast.success("Category deleted");
    fetchData();
  };

  const toggleArchiveCategory = async (cat: Category) => {
    const newVal = !(cat as any).archived;
    await supabase.from("menu_categories").update({ archived: newVal } as any).eq("id", cat.id);
    // Also archive/unarchive all items in this category
    await supabase.from("menu_items").update({ archived: newVal } as any).eq("category_id", cat.id);
    toast.success(newVal ? "Category archived" : "Category restored");
    fetchData();
  };

  const toggleArchiveItem = async (item: MenuItem) => {
    const newVal = !(item as any).archived;
    await supabase.from("menu_items").update({ archived: newVal } as any).eq("id", item.id);
    toast.success(newVal ? "Item archived" : "Item restored");
    fetchData();
  };

  // Item CRUD
  const openItemDialog = (item?: MenuItem) => {
    if (item) {
      setEditingItem(item);
      setItemForm({ name: item.name, description: item.description || "", price: String(item.price), category_id: item.category_id });
    } else {
      setEditingItem(null);
      setItemForm({ name: "", description: "", price: "", category_id: categories[0]?.id || "" });
    }
    setItemDialogOpen(true);
  };

  const saveItem = async () => {
    const payload = {
      name: itemForm.name,
      description: itemForm.description,
      price: parseFloat(itemForm.price),
      category_id: itemForm.category_id,
    };
    if (editingItem) {
      await supabase.from("menu_items").update(payload).eq("id", editingItem.id);
    } else {
      await supabase.from("menu_items").insert({ ...payload, sort_order: items.length });
    }
    setItemDialogOpen(false);
    toast.success("Item saved");
    fetchData();
  };

  const deleteItem = async (id: string) => {
    if (!confirm("Delete this menu item?")) return;
    await supabase.from("menu_items").delete().eq("id", id);
    toast.success("Item deleted");
    fetchData();
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-3xl font-bold">Menu Management</h1>
        <div className="flex gap-2">
          <Button
            variant={showArchived ? "default" : "outline"}
            size="sm"
            onClick={() => setShowArchived(!showArchived)}
          >
            <Archive size={16} className="mr-1" />
            {showArchived ? "Viewing Archived" : "Show Archived"}
          </Button>
          <Dialog open={catDialogOpen} onOpenChange={setCatDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" onClick={() => { setCatName(""); setEditingCat(null); }}>
                <Plus size={16} className="mr-1" /> Category
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>{editingCat ? "Edit" : "Add"} Category</DialogTitle></DialogHeader>
              <Input placeholder="Category name" value={catName} onChange={(e) => setCatName(e.target.value)} />
              <Button onClick={saveCategory}>Save</Button>
            </DialogContent>
          </Dialog>
          <Button size="sm" onClick={() => openItemDialog()}>
            <Plus size={16} className="mr-1" /> Menu Item
          </Button>
        </div>
      </div>

      {/* Categories & Items */}
      {visibleCategories.map((cat) => {
        const catItems = items.filter((i) => i.category_id === cat.id && (showArchived ? (i as any).archived : !(i as any).archived));
        return (
          <div key={cat.id} className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <h2 className="font-display text-xl font-semibold text-primary">{cat.name}</h2>
              {(cat as any).archived && <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded">Archived</span>}
              <button onClick={() => { setEditingCat(cat); setCatName(cat.name); setCatDialogOpen(true); }} className="text-muted-foreground hover:text-foreground">
                <Pencil size={14} />
              </button>
              <button onClick={() => toggleArchiveCategory(cat)} className="text-muted-foreground hover:text-foreground" title={(cat as any).archived ? "Restore category" : "Archive category"}>
                {(cat as any).archived ? <ArchiveRestore size={14} /> : <Archive size={14} />}
              </button>
              <button onClick={() => deleteCategory(cat.id)} className="text-muted-foreground hover:text-destructive">
                <Trash2 size={14} />
              </button>
            </div>
            <div className="space-y-2">
              {catItems.map((item) => (
                <div key={item.id} className={`flex items-center justify-between bg-card p-3 rounded border border-border ${(item as any).archived ? "opacity-60" : ""}`}>
                  <div>
                    <span className="font-medium">{item.name}</span>
                    <span className="text-muted-foreground text-sm ml-2">${Number(item.price).toFixed(2)}</span>
                    {(item as any).archived && <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded ml-2">Archived</span>}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => openItemDialog(item)} className="text-muted-foreground hover:text-foreground"><Pencil size={14} /></button>
                    <button onClick={() => toggleArchiveItem(item)} className="text-muted-foreground hover:text-foreground" title={(item as any).archived ? "Restore" : "Archive"}>
                      {(item as any).archived ? <ArchiveRestore size={14} /> : <Archive size={14} />}
                    </button>
                    <button onClick={() => deleteItem(item.id)} className="text-muted-foreground hover:text-destructive"><Trash2 size={14} /></button>
                  </div>
                </div>
              ))}
              {catItems.length === 0 && (
                <p className="text-muted-foreground text-sm italic">
                  {showArchived ? "No archived items in this category" : "No items in this category"}
                </p>
              )}
            </div>
          </div>
        );
      })}

      {visibleCategories.length === 0 && (
        <p className="text-muted-foreground">
          {showArchived ? "No archived categories." : "No categories yet. Add one to get started."}
        </p>
      )}

      {/* Item Dialog */}
      <Dialog open={itemDialogOpen} onOpenChange={setItemDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editingItem ? "Edit" : "Add"} Menu Item</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <Input placeholder="Item name" value={itemForm.name} onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })} />
            <Textarea placeholder="Description" value={itemForm.description} onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })} />
            <Input placeholder="Price" type="number" step="0.01" value={itemForm.price} onChange={(e) => setItemForm({ ...itemForm, price: e.target.value })} />
            <Select value={itemForm.category_id} onValueChange={(v) => setItemForm({ ...itemForm, category_id: v })}>
              <SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger>
              <SelectContent>
                {categories.filter(c => !(c as any).archived).map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
            <Button onClick={saveItem} className="w-full">Save</Button>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminMenuPage;
