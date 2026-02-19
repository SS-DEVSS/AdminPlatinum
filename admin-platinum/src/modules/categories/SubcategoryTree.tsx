/** Tree UI for subcategories of a category: add/edit/delete nodes, link to products. */
import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { FolderTree, Plus, ChevronRight, ChevronDown, Trash2, Package, Pencil } from "lucide-react";
import { useSubcategories, CreateSubcategoryPayload } from "@/hooks/useSubcategories";
import type { SubcategoryTreeNode } from "../../models/subcategory";

type SubcategoryTreeProps = {
  categoryId: string;
  categoryName: string;
  onRefresh?: () => void;
};

function TreeNode({
  node,
  depth,
  categoryId,
  onAddChild,
  onEdit,
  onDelete,
  onCreated,
}: {
  node: SubcategoryTreeNode;
  depth: number;
  categoryId: string;
  onAddChild: (parentId: string) => void;
  onEdit: (node: SubcategoryTreeNode) => void;
  onDelete: (id: string) => void;
  onCreated: () => void;
}) {
  const [open, setOpen] = useState(true);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className="border-l border-muted ml-2 mt-1" style={{ marginLeft: `${depth * 12}px` }}>
      <div className="flex items-center gap-2 py-1.5 rounded hover:bg-muted/50 group">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="p-0.5 rounded"
          aria-label={open ? "Colapsar" : "Expandir"}
        >
          {hasChildren ? (
            open ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )
          ) : (
            <span className="w-4 inline-block" />
          )}
        </button>
        <span className="font-medium text-sm flex-1 truncate">{node.name}</span>
        {(node.productCount ?? 0) > 0 && (
          <Link
            to={`/dashboard/productos?categoryId=${categoryId}&subcategoryId=${node.id}`}
            className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1"
            title={`Ver ${node.productCount} producto(s)`}
          >
            <Package className="h-3.5 w-3.5" />
            {node.productCount} producto(s)
          </Link>
        )}
        <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0 border-muted-foreground/30"
            onClick={() => onEdit(node)}
            title="Editar"
          >
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 px-2.5 border-muted-foreground/30"
            onClick={() => onAddChild(node.id)}
            title="Agregar subcategoría"
          >
            <Plus className="h-3.5 w-3.5 mr-1" />
            Subcategoría
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0 border-destructive/50 text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={() => onDelete(node.id)}
            title="Eliminar"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
      {open && hasChildren && (
        <div className="ml-2">
          {node.children!.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              depth={depth + 1}
              categoryId={categoryId}
              onAddChild={onAddChild}
              onEdit={onEdit}
              onDelete={onDelete}
              onCreated={onCreated}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function SubcategoryTree({
  categoryId,
  categoryName,
  onRefresh,
}: SubcategoryTreeProps) {
  const { getTree, create, update, remove, loading } = useSubcategories();
  const [tree, setTree] = useState<SubcategoryTreeNode[]>([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [createParent, setCreateParent] = useState<"root" | string>("root");
  const [createName, setCreateName] = useState("");
  const [createDescription, setCreateDescription] = useState("");
  const [editOpen, setEditOpen] = useState(false);
  const [editNode, setEditNode] = useState<SubcategoryTreeNode | null>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const loadTree = useCallback(async () => {
    const data = await getTree(categoryId);
    setTree(Array.isArray(data) ? data : []);
    onRefresh?.();
  }, [categoryId, getTree]);

  useEffect(() => {
    if (!categoryId) return;
    loadTree();
  }, [categoryId, loadTree]);

  const handleAddRoot = () => {
    setCreateParent("root");
    setCreateName("");
    setCreateDescription("");
    setCreateOpen(true);
  };

  const handleAddChild = (parentId: string) => {
    setCreateParent(parentId);
    setCreateName("");
    setCreateDescription("");
    setCreateOpen(true);
  };

  const handleCreateSubmit = async () => {
    if (!createName.trim()) return;
    const payload: CreateSubcategoryPayload =
      createParent === "root"
        ? { name: createName.trim(), description: createDescription || null, categoryId: categoryId }
        : { name: createName.trim(), description: createDescription || null, parentId: createParent };
    const created = await create(payload);
    if (created) {
      setCreateOpen(false);
      await loadTree();
    }
  };

  const handleEdit = (node: SubcategoryTreeNode) => {
    setEditNode(node);
    setEditName(node.name);
    setEditDescription(node.description ?? "");
    setEditOpen(true);
  };

  const handleEditSubmit = async () => {
    if (!editNode || !editName.trim()) return;
    const updated = await update(editNode.id, {
      name: editName.trim(),
      description: editDescription.trim() || null,
    });
    if (updated) {
      setEditOpen(false);
      setEditNode(null);
      await loadTree();
    }
  };

  const handleDelete = async (id: string) => {
    const msg =
      "¿Eliminar esta subcategoría? Si tiene subcategorías hijas también se eliminarán. Los productos asignados quedarán sin subcategoría (ninguna).";
    if (!window.confirm(msg)) return;
    const ok = await remove(id);
    if (ok) await loadTree();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderTree className="h-5 w-5" />
            <CardTitle>Subcategorías</CardTitle>
          </div>
          <Button type="button" variant="outline" size="sm" className="h-8 border-muted-foreground/30" onClick={handleAddRoot}>
            <Plus className="h-4 w-4 mr-2" />
            Agregar subcategoría raíz
          </Button>
        </div>
        <CardDescription>
          Árbol de subcategorías de «{categoryName}». Puedes agregar subcategorías en cualquier nivel.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading && tree.length === 0 ? (
          <p className="text-sm text-muted-foreground">Cargando...</p>
        ) : tree.length === 0 ? (
          <p className="text-sm text-muted-foreground">No hay subcategorías. Agrega una como raíz.</p>
        ) : (
          <div className="space-y-0">
            {tree.map((node) => (
              <TreeNode
                key={node.id}
                node={node}
                depth={0}
                categoryId={categoryId}
                onAddChild={handleAddChild}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onCreated={loadTree}
              />
            ))}
          </div>
        )}
      </CardContent>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {createParent === "root" ? "Nueva subcategoría raíz" : "Nueva subcategoría"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="subcat-name">Nombre</Label>
              <Input
                id="subcat-name"
                value={createName}
                onChange={(e) => setCreateName(e.target.value)}
                placeholder="Nombre de la subcategoría"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="subcat-desc">Descripción (opcional)</Label>
              <Textarea
                id="subcat-desc"
                value={createDescription}
                onChange={(e) => setCreateDescription(e.target.value)}
                placeholder="Descripción"
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>
              Cancelar
            </Button>
            <Button type="button" onClick={handleCreateSubmit} disabled={!createName.trim() || loading}>
              Crear
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editOpen} onOpenChange={(open) => { setEditOpen(open); if (!open) setEditNode(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar subcategoría</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-subcat-name">Nombre</Label>
              <Input
                id="edit-subcat-name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Nombre de la subcategoría"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-subcat-desc">Descripción (opcional)</Label>
              <Textarea
                id="edit-subcat-desc"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="Descripción"
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => { setEditOpen(false); setEditNode(null); }}>
              Cancelar
            </Button>
            <Button type="button" onClick={handleEditSubmit} disabled={!editName.trim() || loading}>
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
