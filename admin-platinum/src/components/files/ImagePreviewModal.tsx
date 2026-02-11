import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { File } from '@/context/files-context';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { Download, Calendar, FileText, HardDrive, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImagePreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  file: File | null;
}

const ImagePreviewModal = ({ open, onOpenChange, file }: ImagePreviewModalProps) => {
  if (!file) return null;

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{file.name}</DialogTitle>
          <DialogDescription>Vista previa y metadatos del archivo</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Image Preview */}
          {file.type === 'image' ? (
            <div className="flex justify-center bg-gray-50 rounded-lg p-4">
              <img
                src={file.url}
                alt={file.name}
                className="max-w-full max-h-[500px] object-contain rounded-lg"
              />
            </div>
          ) : (
            <div className="flex justify-center items-center bg-gray-50 rounded-lg p-12">
              <FileText className="h-24 w-24 text-gray-400" />
            </div>
          )}

          {/* Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <FileText className="h-4 w-4" />
                <span className="font-medium">Nombre:</span>
              </div>
              <p className="text-sm font-medium pl-6">{file.name}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <ImageIcon className="h-4 w-4" />
                <span className="font-medium">Tipo:</span>
              </div>
              <p className="text-sm font-medium pl-6 capitalize">
                {file.type === 'image' ? 'Imagen' : 'Documento'}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <HardDrive className="h-4 w-4" />
                <span className="font-medium">Tamaño:</span>
              </div>
              <p className="text-sm font-medium pl-6">{formatFileSize(file.size)}</p>
            </div>

            {file.mimeType && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  <span className="font-medium">Tipo MIME:</span>
                </div>
                <p className="text-sm font-medium pl-6">{file.mimeType}</p>
              </div>
            )}

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span className="font-medium">Subido:</span>
              </div>
              <p className="text-sm font-medium pl-6">
                {formatDistanceToNow(new Date(file.createdAt), {
                  addSuffix: true,
                  locale: es,
                })}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span className="font-medium">Fecha exacta:</span>
              </div>
              <p className="text-sm font-medium pl-6">{formatDate(file.createdAt)}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => window.open(file.url, '_blank')}
            >
              <Download className="h-4 w-4 mr-2" />
              Descargar
            </Button>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cerrar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImagePreviewModal;
