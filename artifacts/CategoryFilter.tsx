import { useState } from "react";
import { useListCategories, getListCategoriesQueryKey, useCreateCategory } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { CheckSquare, Square, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface Props {
  selectedCategories: Set<number>;
  onChange: (selected: Set<number>) => void;
}

export default function CategoryFilter({ selectedCategories, onChange }: Props) {
  const { data: categories = [] } = useListCategories();
  const createCategory = useCreateCategory();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [badgeLabel, setBadgeLabel] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState<"blue" | "yellow" | "red" | "pink" | "orange">("blue");

  const allSelected = categories.length > 0 && selectedCategories.size === categories.length;

  const toggleAll = () => {
    if (allSelected) {
      onChange(new Set());
    } else {
      onChange(new Set(categories.map(c => c.id)));
    }
  };

  const toggleCategory = (id: number) => {
    const next = new Set(selectedCategories);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    onChange(next);
  };

  const handleCreate = () => {
    if (!name || !badgeLabel) return;
    createCategory.mutate({ data: { name, badgeLabel, description, color } }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListCategoriesQueryKey() });
        setOpen(false);
        setName("");
        setBadgeLabel("");
        setDescription("");
        toast({ title: "Category Created" });
      }
    });
  };

  const colorMap = {
    blue: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-800",
    yellow: "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/50 dark:text-yellow-300 dark:border-yellow-800",
    red: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/50 dark:text-red-300 dark:border-red-800",
    pink: "bg-pink-100 text-pink-800 border-pink-200 dark:bg-pink-900/50 dark:text-pink-300 dark:border-pink-800",
    orange: "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/50 dark:text-orange-300 dark:border-orange-800",
  };

  return (
    <div className="space-y-2 bg-card border border-border p-2 rounded-xl shadow-sm">
      <button
        onClick={toggleAll}
        className={cn(
          "w-full h-12 flex items-center px-4 rounded-lg transition-colors border",
          allSelected ? "bg-primary text-primary-foreground border-primary" : "bg-muted/50 hover:bg-muted border-transparent text-foreground"
        )}
      >
        {allSelected ? <CheckSquare className="w-5 h-5 mr-3 opacity-90" /> : <Square className="w-5 h-5 mr-3 opacity-50" />}
        <span className="font-medium">All Categories</span>
      </button>

      <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 px-1 snap-x hide-scrollbar">
        {categories.map(category => {
          const isSelected = selectedCategories.has(category.id);
          return (
            <button
              key={category.id}
              onClick={() => toggleCategory(category.id)}
              className={cn(
                "flex-shrink-0 h-10 px-4 rounded-lg flex items-center border transition-all snap-start",
                isSelected ? colorMap[category.color] : "bg-background border-border text-muted-foreground hover:bg-muted"
              )}
            >
              {isSelected ? <CheckSquare className="w-4 h-4 mr-2" /> : <Square className="w-4 h-4 mr-2" />}
              <span className="font-medium text-sm whitespace-nowrap">{category.name}</span>
            </button>
          );
        })}
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <button className="flex-shrink-0 h-10 px-3 rounded-lg border border-dashed border-border bg-background text-muted-foreground hover:bg-muted flex items-center justify-center transition-colors">
              <Plus className="w-4 h-4" />
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New Category</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Coerced Confession" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Badge Label</label>
                <Input value={badgeLabel} onChange={e => setBadgeLabel(e.target.value)} placeholder="e.g. Confession" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Color</label>
                <div className="flex gap-2">
                  {(["blue", "yellow", "red", "pink", "orange"] as const).map(c => (
                    <button
                      key={c}
                      onClick={() => setColor(c)}
                      className={cn(
                        "w-8 h-8 rounded-full border-2 transition-all",
                        colorMap[c].split(' ')[0], // just use bg class
                        color === c ? "border-primary scale-110 shadow-sm" : "border-transparent opacity-70 hover:opacity-100"
                      )}
                    />
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description (optional)</label>
                <Textarea value={description} onChange={e => setDescription(e.target.value)} />
              </div>
              <Button onClick={handleCreate} className="w-full">Create Category</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}