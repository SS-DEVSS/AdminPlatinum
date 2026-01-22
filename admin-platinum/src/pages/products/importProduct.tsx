import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Layout from "@/components/Layouts/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, File, BarChart3 } from "lucide-react";
import { useCategoryContext } from "@/context/categories-context";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useDropzone } from "react-dropzone";
import { useToast } from "@/hooks/use-toast";
import { useImportContext } from "@/context/import-context";

type ImportType = "products" | "references" | "applications";

const ImportProduct = () => {
  const navigate = useNavigate();
  const { categories } = useCategoryContext();
  const { toast } = useToast();
  const { startImport, importState } = useImportContext();

  const [importType, setImportType] = useState<ImportType | "">("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      if (selectedFile.type === "text/csv" || selectedFile.name.endsWith(".csv")) {
        setFile(selectedFile);
      } else {
        toast({
          title: "Error",
          description: "Por favor, selecciona un archivo CSV válido.",
          variant: "destructive",
        });
      }
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
    },
    maxFiles: 1,
  });

  const handleSubmit = async () => {
    if (!importType || !categoryId || !file) {
      toast({
        title: "Error",
        description: "Por favor, completa todos los campos requeridos.",
        variant: "destructive",
      });
      return;
    }

    // Start import using context (this allows navigation)
    await startImport(file, importType, categoryId);

    // Clear form
    setImportType("");
    setCategoryId("");
    setFile(null);
    
    // Allow navigation - user can navigate away and the import will continue
    // The toast will show the result when it completes
  };

  return (
    <Layout>
      <header className="flex justify-between">
        <div className="flex items-center gap-4">
          <Link to="/productos">
            <Card className="p-2">
              <ChevronLeft className="h-4 w-4" />
            </Card>
          </Link>
          <p className="text-2xl font-semibold leading-none tracking-tight">
            Importar Productos
          </p>
        </div>
        <Link to="/producto/importar/dashboard">
          <Button variant="outline" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Ver Dashboard
          </Button>
        </Link>
      </header>

      <section className="flex flex-col justify-center gap-4 mt-8">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Importar desde CSV</CardTitle>
            <CardDescription>
              Selecciona el tipo de importación, la categoría y sube tu archivo CSV.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-3">
              <Label htmlFor="importType">
                <span className="text-red-500">*</span> Tipo de Importación
              </Label>
              <Select value={importType} onValueChange={(value) => setImportType(value as ImportType)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecciona el tipo de importación" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Tipos de Importación</SelectLabel>
                    <SelectItem value="products">Productos</SelectItem>
                    <SelectItem value="references">Referencias</SelectItem>
                    <SelectItem value="applications">Aplicaciones</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-3">
              <Label htmlFor="category">
                <span className="text-red-500">*</span> Categoría
              </Label>
              <Select
                value={categoryId}
                onValueChange={setCategoryId}
                disabled={!importType}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Categorías</SelectLabel>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id || ""}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-3">
              <Label htmlFor="file">
                <span className="text-red-500">*</span> Archivo CSV
              </Label>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isDragActive
                    ? "bg-[#F5F9FD] border-[#0bbff4]"
                    : file
                    ? "bg-green-50 border-green-400"
                    : "border-[#94A3B8] hover:border-[#0bbff4]"
                }`}
              >
                <input {...getInputProps()} />
                {file ? (
                  <div className="space-y-2">
                    <File className="h-12 w-12 mx-auto text-green-600" />
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Haz clic para seleccionar otro archivo
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <File className="h-12 w-12 mx-auto text-muted-foreground" />
                    <p className="text-muted-foreground">
                      {isDragActive
                        ? "Suelta el archivo aquí"
                        : "Arrastra y suelta el archivo CSV aquí"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      o haz clic para seleccionar un archivo
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                onClick={() => navigate("/productos")}
                variant="outline"
                disabled={importState.isImporting}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!importType || !categoryId || !file || importState.isImporting}
              >
                {importState.isImporting ? "Importando..." : "Importar"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </Layout>
  );
};

export default ImportProduct;

