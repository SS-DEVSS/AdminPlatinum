import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDeleteModal } from "@/context/delete-context";
import { Link } from "react-router-dom";
import { AttributeValue, Item, Variant } from "@/models/product";
import { useProducts } from "@/hooks/useProducts";
import { Category } from "@/models/category";
import { useState, useEffect, useMemo } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCategories } from "@/hooks/useCategories";

interface DataTableProps {
  category?: Category | null;
  searchFilter?: string;
}

const DataTable = ({ category, searchFilter }: DataTableProps) => {
  const [mappedData, setMappedData] = useState<Variant[]>([]);

  let { attributes } = category || {};
  const { openModal } = useDeleteModal();
  const { products, deleteProduct } = useProducts();
  const { categories } = useCategories();

  if (!attributes && categories.length > 0) {
    // attributes = categories[0].attributes;
    attributes = categories[0].attributes;
  }

  const handleDeleteProduct = async (id: Item["id"]) => {
    await deleteProduct(id);
  };

  const flattenVariants = (items: Item[]): Variant[] => {
    if (items.length) {
      return items.flatMap((item: Item): Variant[] => {
        const variants = item.variants;

        // If no variants (e.g. SINGLE product), map the item itself as a row
        if (!variants || variants.length === 0) {
          // Create a pseudo-variant from the main item
          return [{
            id: item.id,
            idProduct: item.id,
            sku: "",
            name: item.name,
            price: 0,
            stockQuantity: 0,
            notes: [],
            technicalSheets: [],
            images: [],
            kitItems: [],
            attributeValues: []
          } as Variant];
        }

        return variants.map((variant: Variant): Variant => ({
          ...variant,
          attributeValues: []
        }));
      });
    }
    return [];
  };

  const columns = useMemo(() => {
    const initialColumns = [
      {
        accessorKey: "images",
        header: "",
        cell: ({ row }: { row: any }) => (
          <div className="w-20 h-20 bg-slate-300 rounded-lg">
            {row.getValue("images") && row.getValue("images")[0] ? (
              <img
                className="m-auto aspect-square p-2"
                src={row.getValue("images")[0].url}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">
                No Img
              </div>
            )}
          </div>
        ),
      },
      {
        accessorKey: "sku",
        header: "Sku",
        cell: ({ row }: { row: any }) => <div>{row.getValue("sku")}</div>,
      },
      {
        accessorKey: "name",
        header: "Nombre",
        cell: ({ row }: { row: any }) => <div>{row.getValue("name")}</div>,
      },
      {
        accessorKey: "type",
        header: "Tipo",
        cell: ({ row }: { row: any }) => {
          return (
            <div>
              {row.getValue("type") === "SINGLE" ? "Componente" : "Kit"}
            </div>
          );
        },
      },
    ];

    const actionColumn = [
      {
        id: "actions",
        enableHiding: false,
        cell: ({ row }: { row: any }) => {
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-black">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                <Link to={`/producto/${row.original.id}`}>
                  <DropdownMenuItem>Editar</DropdownMenuItem>
                </Link>
                <DropdownMenuItem
                  onClick={() => {
                    openModal({
                      title: "Borrar Producto",
                      description:
                        "Estas seguro que deseas eliminar este producto?",
                      handleDelete: () => handleDeleteProduct(row.original.id),
                    });
                  }}
                >
                  Eliminar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ];

    const getColumns = (attributeType: string) => {
      const getAttributeValues = (row: any, attribute: any) => {
        let attributeCollection = [];
        const productAttributeValues = row.original?.productAttributeValues || [];
        const attributeValues = row.original?.attributeValues || [];

        attributeCollection = [productAttributeValues, attributeValues];
        return attributeCollection
          .flat()
          .filter((attrValue: AttributeValue | undefined) => attrValue != null)
          .find(
            (attrValue: AttributeValue) =>
              attrValue?.idAttribute === attribute.id
          );
      };

      const getDisplayValue = (value: AttributeValue | undefined) =>
        value?.valueString ||
        value?.valueNumber ||
        value?.valueBoolean?.toString() ||
        value?.valueDate?.toDateString() ||
        "N/A";

      return (
        (attributes as any)?.[attributeType]?.map((attribute: any) => {
          return {
            accessorKey: attribute.id,
            header: attribute.name,
            cell: ({ row }: { row: any }) => {
              const value = getAttributeValues(row, attribute);
              return <div>{getDisplayValue(value)}</div>;
            },
          };
        }) || []
      );
    };

    const dynamicColumnsProduct = getColumns("product");
    const dynamicColumnsVariant = getColumns("variant");

    return [
      ...initialColumns,
      ...dynamicColumnsProduct,
      ...dynamicColumnsVariant,
      ...actionColumn,
    ];
  }, [attributes]);

  useEffect(() => {
    const filteredProducts = products.filter(
      (product: Item) => product.category.id === category?.id
    );
    const flattenedData = flattenVariants(filteredProducts);
    setMappedData(flattenedData ?? []);
  }, [products, category]);

  const searchFilteredProducts = useMemo(() => {
    const test = mappedData.filter(
      (variant: Variant) =>
        variant.name.toLowerCase().includes(searchFilter!.toLowerCase()) ||
        variant.sku.toLowerCase().includes(searchFilter!.toLowerCase())
    );
    return test;
  }, [searchFilter]);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable<Variant>({
    data: searchFilter ? searchFilteredProducts : mappedData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="mt-6">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No existen resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
