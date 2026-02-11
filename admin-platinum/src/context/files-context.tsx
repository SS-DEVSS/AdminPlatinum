import { createContext, useContext, useState, ReactNode } from 'react';
import { fileService, File, ListFilesResponse } from '@/services/fileService';
import { useToast } from '@/hooks/use-toast';

interface FilesContextType {
  files: File[];
  loading: boolean;
  error: string | null;
  total: number;
  totalPages: number;
  currentPage: number;
  filterType: 'all' | 'image' | 'document';
  getFiles: (type?: 'image' | 'document', page?: number, limit?: number, searchQuery?: string) => Promise<void>;
  uploadFiles: (
    files: File[],
    type: 'image' | 'document',
    onProgress?: (progress: number) => void
  ) => Promise<void>;
  deleteFile: (fileId: string, type: 'image' | 'document') => Promise<void>;
  bulkDeleteFiles: (fileIds: string[]) => Promise<void>;
  clearFiles: () => void;
  setFilterType: (type: 'all' | 'image' | 'document') => void;
}

const FilesContext = createContext<FilesContextType | undefined>(undefined);

export const FilesProvider = ({ children }: { children: ReactNode }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterType, setFilterType] = useState<'all' | 'image' | 'document'>('all');
  const { toast } = useToast();

  const getFiles = async (
    type?: 'image' | 'document',
    page: number = 1,
    limit: number = 20,
    searchQuery?: string
  ) => {
    try {
      setLoading(true);
      setError(null);
      const result = await fileService.getFiles(type, page, limit, searchQuery);
      setFiles(result.files);
      setTotal(result.total);
      setTotalPages(result.totalPages);
      setCurrentPage(result.currentPage);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.error || err.message || 'Error al cargar los archivos';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const uploadFiles = async (
    filesToUpload: File[],
    type: 'image' | 'document',
    onProgress?: (progress: number) => void
  ) => {
    try {
      setLoading(true);
      setError(null);
      await fileService.uploadFiles(filesToUpload, type, onProgress);
      toast({
        title: 'Éxito',
        description: `${filesToUpload.length} archivo(s) subido(s) correctamente`,
      });
      // Refresh file list - use current filter type
      const currentType = filterType === 'all' ? undefined : filterType;
      await getFiles(currentType, currentPage);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.error || err.message || 'Error al subir los archivos';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteFile = async (fileId: string, type: 'image' | 'document') => {
    try {
      setLoading(true);
      setError(null);
      await fileService.deleteFile(fileId, type);
      toast({
        title: 'Éxito',
        description: 'Archivo eliminado correctamente',
      });
      // Refresh file list - use current filter type
      const currentType = filterType === 'all' ? undefined : filterType;
      await getFiles(currentType, currentPage);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.error || err.message || 'Error al eliminar el archivo';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const bulkDeleteFiles = async (fileIds: string[]) => {
    try {
      setLoading(true);
      setError(null);
      const result = await fileService.bulkDeleteFiles(fileIds);
      toast({
        title: 'Éxito',
        description: `${result.deletedCount} archivo(s) eliminado(s) correctamente`,
      });
      if (result.errors.length > 0) {
        toast({
          title: 'Advertencia',
          description: `Algunos archivos no se pudieron eliminar: ${result.errors.join(', ')}`,
          variant: 'destructive',
        });
      }
      // Refresh file list - use current filter type
      const currentType = filterType === 'all' ? undefined : filterType;
      await getFiles(currentType, currentPage);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.error || err.message || 'Error al eliminar los archivos';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearFiles = () => {
    setFiles([]);
    setTotal(0);
    setTotalPages(0);
    setCurrentPage(1);
  };

  return (
    <FilesContext.Provider
      value={{
        files,
        loading,
        error,
        total,
        totalPages,
        currentPage,
        filterType,
        getFiles,
        uploadFiles,
        deleteFile,
        bulkDeleteFiles,
        clearFiles,
        setFilterType,
      }}
    >
      {children}
    </FilesContext.Provider>
  );
};

export const useFilesContext = () => {
  const context = useContext(FilesContext);
  if (context === undefined) {
    throw new Error('useFilesContext must be used within a FilesProvider');
  }
  return context;
};
