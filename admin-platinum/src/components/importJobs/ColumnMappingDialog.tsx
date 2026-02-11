import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { translateAttributeName } from "@/utils/attributeTranslations";

interface Attribute {
  id: string;
  name: string;
  csvName?: string | null;
  required?: boolean;
}

interface CoreAttribute {
  id: string;
  name: string;
  csvName: string;
  type: 'core';
}

interface ColumnMappingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  headers: string[];
  attributes: Attribute[];
  coreAttributes?: CoreAttribute[];
  suggestedMappings: { [csvColumn: string]: string };
  requiredAttributes: string[];
  onConfirm: (mapping: { [csvColumn: string]: string | null }) => void;
  initialMapping?: { [csvColumn: string]: string | null };
}

const ColumnMappingDialog = ({
  open,
  onOpenChange,
  headers,
  attributes,
  coreAttributes = [],
  suggestedMappings,
  requiredAttributes,
  onConfirm,
  initialMapping
}: ColumnMappingDialogProps) => {
  const [mapping, setMapping] = useState<{ [csvColumn: string]: string | null }>({});

  useEffect(() => {
    if (open) {
      // Use initial mapping if provided, otherwise use suggested mappings
      if (initialMapping) {
        setMapping({ ...initialMapping });
      } else {
        const newMapping: { [csvColumn: string]: string | null } = {};
        headers.forEach((header) => {
          newMapping[header] = suggestedMappings[header] || null;
        });
        setMapping(newMapping);
      }
    }
  }, [open, headers, suggestedMappings, initialMapping]);

  const handleMappingChange = (csvColumn: string, attributeId: string | null) => {
    setMapping((prev) => ({
      ...prev,
      [csvColumn]: attributeId,
    }));
  };

  const handleConfirm = () => {
    onConfirm(mapping);
    onOpenChange(false);
  };

  const isRequiredMapped = (attributeId: string | null) => {
    if (!attributeId) return false;
    return requiredAttributes.includes(attributeId);
  };

  const allRequiredMapped = requiredAttributes.every((reqAttrId) =>
    Object.values(mapping).includes(reqAttrId)
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Mapeo de Columnas</DialogTitle>
          <DialogDescription>
            Asigna cada columna del CSV a un atributo. Puedes mapear a atributos de categoría o a campos base
            (SKU, Nombre, Descripción, etc.). Las columnas marcadas con asterisco (*) son requeridas.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {!allRequiredMapped && (
            <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-md">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <span className="text-sm text-amber-800">
                Por favor, asigna todos los atributos requeridos antes de continuar.
              </span>
            </div>
          )}

          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40%]">Columna CSV</TableHead>
                  <TableHead className="w-[60%]">Atributo de Categoría</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {headers.map((header) => {
                  const currentAttributeId = mapping[header] || null;
                  const isRequired = isRequiredMapped(currentAttributeId);

                  return (
                    <TableRow key={header}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{header}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={currentAttributeId || ""}
                          onValueChange={(value) =>
                            handleMappingChange(header, value === "none" ? null : value)
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">-- No mapear --</SelectItem>

                            {/* Core Attributes Section */}
                            {coreAttributes.length > 0 && (
                              <>
                                <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                                  Campos Base
                                </div>
                                {coreAttributes.map((coreAttr) => {
                                  const coreId = `core:${coreAttr.id}`;
                                  const isMapped = Object.values(mapping).includes(coreId);
                                  const isCurrent = mapping[header] === coreId;
                                  const translatedName = translateAttributeName(coreAttr.name, true);

                                  return (
                                    <SelectItem
                                      key={coreId}
                                      value={coreId}
                                      disabled={isMapped && !isCurrent}
                                    >
                                      <div className="flex items-center gap-2">
                                        <span>{translatedName}</span>
                                        {isMapped && !isCurrent && (
                                          <span className="text-xs text-muted-foreground">
                                            (ya mapeado)
                                          </span>
                                        )}
                                      </div>
                                    </SelectItem>
                                  );
                                })}
                                <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground border-t mt-1 pt-1">
                                  Atributos de Categoría
                                </div>
                              </>
                            )}

                            {/* Category Attributes Section */}
                            {attributes.map((attr) => {
                              const isMapped = Object.values(mapping).includes(attr.id);
                              const isCurrent = mapping[header] === attr.id;
                              const isRequiredAttr = requiredAttributes.includes(attr.id);
                              const translatedName = translateAttributeName(attr.name, false);

                              return (
                                <SelectItem
                                  key={attr.id}
                                  value={attr.id}
                                  disabled={isMapped && !isCurrent}
                                >
                                  <div className="flex items-center gap-2">
                                    <span>{translatedName}</span>
                                    {isRequiredAttr && (
                                      <span className="text-red-500">*</span>
                                    )}
                                    {isMapped && !isCurrent && (
                                      <span className="text-xs text-muted-foreground">
                                        (ya mapeado)
                                      </span>
                                    )}
                                  </div>
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                        {currentAttributeId && (
                          <div className="mt-1 flex items-center gap-1">
                            {isRequired && (
                              <Badge variant="default" className="text-xs">
                                Requerido
                              </Badge>
                            )}
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button onClick={handleConfirm} disabled={!allRequiredMapped}>
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Confirmar Mapeo
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ColumnMappingDialog;
