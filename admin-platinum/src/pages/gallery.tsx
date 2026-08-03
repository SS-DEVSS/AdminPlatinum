import { useEffect, useState } from "react";
import Layout from "@/components/Layouts/Layout";
import MyDropzone from "@/components/Dropzone";
import NoData from "@/components/NoData";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useDeleteModal } from "@/context/delete-context";
import { useGallery } from "@/hooks/useGallery";
import { useS3FileManager } from "@/hooks/useS3FileManager";
import { toast } from "@/hooks/use-toast";
import { GalleryImage } from "@/models/galleryImage";
import FilePickerModal from "@/components/files/FilePickerModal";
import {
  IMAGE_UPLOAD_ACCEPT_LABEL,
  IMAGE_UPLOAD_MAX_LABEL,
} from "@/utils/imageUpload";
import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  FolderOpen,
  Trash2,
} from "lucide-react";

async function uploadToKey(
  uploadFile: ReturnType<typeof useS3FileManager>["uploadFile"],
  file: File
): Promise<string> {
  return new Promise((resolve, reject) => {
    void uploadFile(file, (key) => resolve(key), {}).catch(reject);
  });
}

const resolveUrl = (img: GalleryImage): string => {
  const raw = img.imageUrl || "";
  if (!raw) return "";
  if (raw.startsWith("http://") || raw.startsWith("https://")) return raw;
  return `${import.meta.env.VITE_AWS_S3_BUCKET_PUBLIC_URL}${raw}`;
};

const Gallery = () => {
  const { loading, images, addImage, reorderImages, deleteImage } = useGallery();
  const { openModal } = useDeleteModal();
  const s3 = useS3FileManager();

  const [file, setFile] = useState<File | null>(null);
  const [pickedUrl, setPickedUrl] = useState<string | null>(null);
  const [filePickerOpen, setFilePickerOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // Subir un archivo y elegir del administrador de archivos son mutuamente excluyentes.
  useEffect(() => {
    if (file) setPickedUrl(null);
  }, [file]);

  const hasPending = Boolean(file || pickedUrl);
  const canSave = hasPending && !saving && !s3.uploading && !loading;

  const resetPending = () => {
    setFile(null);
    setPickedUrl(null);
  };

  const handleAdd = async () => {
    if (!hasPending) return;
    setSaving(true);
    try {
      const path = file ? await uploadToKey(s3.uploadFile, file) : pickedUrl!;
      const ok = await addImage({ path });
      if (ok) resetPending();
    } catch {
      toast({
        title: "Error al subir",
        description:
          "No se pudo subir la imagen. Revisa la conexión e inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const moveImage = (index: number, delta: number) => {
    const j = index + delta;
    if (j < 0 || j >= images.length) return;
    const next = [...images];
    const tmp = next[index];
    next[index] = next[j];
    next[j] = tmp;
    void reorderImages(next.map((img) => img.id));
  };

  return (
    <Layout>
      <section className="max-w-[1000px] mx-auto">
        <h1 className="text-2xl font-semibold mb-4">Galería</h1>

        <Card>
          <CardHeader>
            <CardTitle>Agregar imagen a la galería</CardTitle>
            <CardDescription>
              Sube una imagen o elígela del administrador de archivos; se
              mostrará en la galería de la landing.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-muted-foreground">
                Formatos: {IMAGE_UPLOAD_ACCEPT_LABEL}. Tamaño máximo:{" "}
                {IMAGE_UPLOAD_MAX_LABEL}.
              </p>
              <Button
                variant="outline"
                size="sm"
                type="button"
                className="w-full shrink-0 sm:w-auto"
                onClick={() => setFilePickerOpen(true)}
              >
                <FolderOpen className="h-4 w-4 mr-2" />
                Buscar en archivos
              </Button>
            </div>

            <MyDropzone
              className="p-8"
              type="image"
              file={file}
              fileSetter={setFile}
              currentImageUrl={pickedUrl && !file ? pickedUrl : undefined}
              imageOverlayRemove
            />

            <div className="flex flex-wrap gap-2 justify-end border-t pt-3">
              <Button
                variant="outline"
                type="button"
                onClick={resetPending}
                disabled={saving || !hasPending}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                disabled={!canSave}
                onClick={() => void handleAdd()}
              >
                {saving ? "Guardando…" : "Agregar a la galería"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Imágenes de la galería</CardTitle>
            <CardDescription>
              Reordena con las flechas o elimina con la papelera. Este es el
              orden en que se verán en la landing.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading && images.length === 0 ? (
              <div className="flex justify-center items-center py-12">
                <div className="flex flex-col items-center gap-2">
                  <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                  <p className="text-sm text-muted-foreground">Cargando...</p>
                </div>
              </div>
            ) : images.length ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {images.map((img, index) => (
                  <div
                    key={img.id}
                    className="group relative overflow-hidden rounded-lg border bg-white"
                  >
                    <div className="aspect-square w-full bg-gray-100">
                      <img
                        src={resolveUrl(img)}
                        alt=""
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="flex items-center justify-between gap-1 border-t p-1.5">
                      <div className="flex gap-1">
                        <Button
                          type="button"
                          size="icon"
                          variant="outline"
                          className="h-8 w-8 shrink-0"
                          disabled={index === 0 || loading}
                          aria-label="Mover antes"
                          onClick={() => moveImage(index, -1)}
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          size="icon"
                          variant="outline"
                          className="h-8 w-8 shrink-0"
                          disabled={index >= images.length - 1 || loading}
                          aria-label="Mover después"
                          onClick={() => moveImage(index, 1)}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                      <Button
                        type="button"
                        size="icon"
                        variant="outline"
                        className="h-8 w-8 shrink-0 text-destructive hover:text-destructive"
                        aria-label="Eliminar imagen"
                        onClick={() =>
                          openModal({
                            title: "imagen de la galería",
                            description:
                              "Se quitará esta imagen de la galería de la landing. Esta acción no se puede deshacer.",
                            handleDelete: () => {
                              void deleteImage(img.id);
                            },
                          })
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <NoData>
                <AlertTriangle className="text-[#4E5154]" />
                <p className="text-[#4E5154]">No hay imágenes en la galería</p>
                <p className="text-[#94A3B8] font-semibold text-sm">
                  Agrega una usando el formulario superior
                </p>
              </NoData>
            )}
          </CardContent>
        </Card>

        <FilePickerModal
          open={filePickerOpen}
          onOpenChange={setFilePickerOpen}
          onSelectFile={(url) => {
            setPickedUrl(url);
            setFile(null);
          }}
          filterType="image"
        />
      </section>
    </Layout>
  );
};

export default Gallery;
