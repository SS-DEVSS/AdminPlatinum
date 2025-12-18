import NoData from "@/components/NoData";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Product } from "@/models/product";
import { Document as DocumentType } from "@/models/technicalSheet";
import { PlusCircle, Trash, FileText } from "lucide-react";
import { useState } from "react";
// Temporarily disabled
// import { useS3FileManager } from "@/hooks/useS3FileManager";
import axiosClient from "@/services/axiosInstance";
import { useToast } from "@/hooks/use-toast";

type DocumentsCardProps = {
  product?: Product | null;
  onDocumentsChange?: (documents: DocumentType[]) => void;
};

const DocumentsCard = ({ product, onDocumentsChange }: DocumentsCardProps) => {
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [documentTitle, setDocumentTitle] = useState<string>("");
  const [showInputDocuments, setShowInputDocuments] = useState<boolean>(false);
  const [formInfo, setFormInfo] = useState<{ documents: DocumentType[] }>({
    documents: product?.documents ? (product.documents as unknown as DocumentType[]) : ([] as DocumentType[]),
  });

  // Notify parent when documents change
  const updateDocuments = (newDocuments: DocumentType[]) => {
    setFormInfo({ documents: newDocuments });
    onDocumentsChange?.(newDocuments);
  };
  // Temporarily disabled
  // const { uploading } = useS3FileManager();
  const { toast } = useToast();
  const client = axiosClient();

  const handleAddClickDocuments = () => {
    setShowInputDocuments(!showInputDocuments);
    setDocumentFile(null);
    setDocumentTitle("");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDocumentFile(file);
      // Set title from filename if title is empty
      if (!documentTitle) {
        setDocumentTitle(file.name.replace(/\.[^/.]+$/, "")); // Remove extension
      }
    }
  };

  const handleAddDocuments = async () => {
    if (!documentFile) {
      toast({
        title: "Error",
        variant: "destructive",
        description: "Por favor selecciona un archivo",
      });
      return;
    }

    try {
      // Upload document to backend
      const formData = new FormData();
      formData.append('file', documentFile);

      const response = await client.post('/files/documents', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const { url } = response.data;

      const newDocument: DocumentType = {
        id: crypto.randomUUID(),
        title: documentTitle || documentFile.name,
        document_url: url,
      };

      const updatedDocuments = [...formInfo.documents, newDocument];
      updateDocuments(updatedDocuments);

      setDocumentFile(null);
      setDocumentTitle("");
      setShowInputDocuments(false);

      toast({
        title: "Documento subido",
        variant: "success",
        description: "El documento se ha subido correctamente",
      });
    } catch (error: any) {
      console.error("Error uploading document:", error);
      toast({
        title: "Error",
        variant: "destructive",
        description: error.response?.data?.error || error.message || "Error al subir el documento",
      });
    }
  };

  const handleRemoveDocuments = async (id: string) => {
    const document = formInfo.documents.find(doc => doc.id === id);
    
    // If document has a URL, try to delete it from S3
    if (document?.document_url) {
      try {
        // Extract key from URL if possible, or use the URL
        // The backend DELETE endpoint expects an ID, but we might need to extract it
        // For now, just remove from local state
        // TODO: Implement proper deletion if backend supports it
      } catch (error) {
        console.error("Error deleting document from S3:", error);
      }
    }

    const updatedDocuments = formInfo.documents.filter((doc) => doc.id !== id);
    updateDocuments(updatedDocuments);
  };

  return (
    <Card className="w-full flex flex-col mt-5 opacity-60">
      <CardHeader>
        <CardTitle>Documentos</CardTitle>
        <CardDescription>
          Ingrese documentos relevantes para el producto.
          <span className="block mt-1 text-xs text-muted-foreground italic">
            (Funcionalidad temporalmente deshabilitada)
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        {formInfo.documents.length === 0 && showInputDocuments === false ? (
          <NoData>
            <p className="text-[#94A3B8] font-medium">
              No hay documentos asociados
            </p>
          </NoData>
        ) : (
          <section className="flex gap-4 flex-wrap">
            {formInfo.documents.map((document) => (
              <div key={document.id} className="w-full border rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-gray-500" />
                  <div className="flex-1">
                    <Label className="font-medium">{document.title}</Label>
                    {document.document_url && (
                      <a
                        href={document.document_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline block mt-1"
                      >
                        Ver documento
                      </a>
                    )}
                  </div>
                  <Button
                    onClick={() => handleRemoveDocuments(document.id)}
                    size="icon"
                    variant="ghost"
                    disabled
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </section>
        )}
        {showInputDocuments && (
          <div className="flex flex-col gap-3 mt-4">
            <div className="flex gap-2">
              <div className="flex-1">
                <Label htmlFor="document-title">Título del documento</Label>
                <Input
                  id="document-title"
                  type="text"
                  className="w-full mt-1"
                  placeholder="Nombre del documento"
                  value={documentTitle}
                  onChange={(e) => setDocumentTitle(e.target.value)}
                  disabled
                />
              </div>
            </div>
            <div>
              <Label htmlFor="document-file">Archivo</Label>
              <Input
                id="document-file"
                type="file"
                className="w-full mt-1"
                accept=".pdf,.doc,.docx,.xls,.xlsx"
                onChange={handleFileChange}
                disabled
              />
              {documentFile && (
                <p className="text-sm text-muted-foreground mt-1">
                  Archivo seleccionado: {documentFile.name}
                </p>
              )}
            </div>
            <div className="flex justify-end gap-2 mt-2">
              <Button variant="outline" onClick={handleAddClickDocuments} disabled>
                Cancelar
              </Button>
              <Button 
                onClick={handleAddDocuments}
                disabled
              >
                Agregar
              </Button>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="mt-auto border-t p-2 grid items-center">
        <Button
          size="sm"
          variant="ghost"
          className="gap-1 hover:bg-slate-100 hover:text-black py-5"
          onClick={handleAddClickDocuments}
          disabled
        >
          <PlusCircle className="h-3.5 w-3.5 mr-2" />
          Agregar Documento
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DocumentsCard;
