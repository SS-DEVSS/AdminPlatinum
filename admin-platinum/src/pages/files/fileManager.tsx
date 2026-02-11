import { useEffect, useState } from 'react';
import { useFilesContext } from '@/context/files-context';
import Layout from '@/components/Layouts/Layout';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronLeft, ChevronRight, Loader2, Upload, Search, Grid3x3, List, X, ArrowUpDown } from 'lucide-react';
import FileList from '@/components/files/FileList';
import FileUploadModal from '@/components/files/FileUploadModal';

type FilterType = 'all' | 'image' | 'document';
type ViewType = 'cards' | 'table';

const FileManager = () => {
  const {
    files,
    loading,
    total,
    totalPages,
    currentPage,
    filterType,
    getFiles,
    setFilterType: setContextFilterType,
  } = useFilesContext();

  const [page, setPage] = useState(1);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [viewType, setViewType] = useState<ViewType>('cards');
  const [sortBy, setSortBy] = useState<'name' | 'createdAt'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const limit = 20;

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      const previousSearch = debouncedSearch;
      setDebouncedSearch(searchQuery);
      // Reset page to 1 when search actually changes
      if (searchQuery !== previousSearch) {
        setPage(1);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, debouncedSearch]);

  useEffect(() => {
    const type = filterType === 'all' ? undefined : filterType;
    const search = debouncedSearch && debouncedSearch.trim() ? debouncedSearch.trim() : undefined;
    // Only fetch if we have a search query or if debouncedSearch is empty (to show all files)
    if (search !== undefined || debouncedSearch === '') {
      getFiles(type, page, limit, search, sortBy, sortOrder);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterType, page, debouncedSearch, sortBy, sortOrder]);

  const handleFilterChange = (value: string) => {
    setContextFilterType(value as FilterType);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRefresh = () => {
    const type = filterType === 'all' ? undefined : filterType;
    getFiles(type, page, limit, debouncedSearch || undefined, sortBy, sortOrder);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setDebouncedSearch('');
    setPage(1);
  };

  const handleSortChange = (value: string) => {
    const [field, order] = value.split('-');
    setSortBy(field as 'name' | 'createdAt');
    setSortOrder(order as 'asc' | 'desc');
    setPage(1);
  };

  return (
    <Layout>
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-semibold leading-none tracking-tight">
            Administrador de Archivos
          </h1>
          {total !== undefined && (
            <p className="text-sm text-muted-foreground mt-1">
              {total} archivo(s) en total
            </p>
          )}
        </div>
        <Button onClick={() => setUploadModalOpen(true)}>
          <Upload className="h-4 w-4 mr-2" />
          Subir Archivos
        </Button>
      </header>

      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre de archivo..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-10"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-transparent"
                  onClick={handleClearSearch}
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </Button>
              )}
            </div>
            <Select
              value={`${sortBy}-${sortOrder}`}
              onValueChange={handleSortChange}
            >
              <SelectTrigger className="w-[220px]">
                <div className="flex items-center gap-2 whitespace-nowrap">
                  <ArrowUpDown className="h-4 w-4 flex-shrink-0" />
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt-desc">Fecha (Más reciente)</SelectItem>
                <SelectItem value="createdAt-asc">Fecha (Más antiguo)</SelectItem>
                <SelectItem value="name-asc">Nombre (A-Z)</SelectItem>
                <SelectItem value="name-desc">Nombre (Z-A)</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterType} onValueChange={handleFilterChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="image">Imágenes</SelectItem>
                <SelectItem value="document">Documentos</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex border rounded-md">
              <Button
                variant={viewType === 'cards' ? 'default' : 'ghost'}
                size="sm"
                className="rounded-r-none"
                onClick={() => setViewType('cards')}
              >
                <Grid3x3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewType === 'table' ? 'default' : 'ghost'}
                size="sm"
                className="rounded-l-none"
                onClick={() => setViewType('table')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Actualizar'
              )}
            </Button>
          </div>
        </div>

        {loading && files.length === 0 ? (
          <div className="py-12 text-center">
            <Loader2 className="h-8 w-8 mx-auto animate-spin text-muted-foreground" />
            <p className="text-muted-foreground mt-2">Cargando archivos...</p>
          </div>
        ) : (
          <>
            <FileList
              files={files}
              onFileDeleted={handleRefresh}
              viewType={viewType}
              hasSearchQuery={!!debouncedSearch}
            />

            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6 pt-4 border-t">
                <div className="text-sm text-muted-foreground">
                  Página {currentPage} de {totalPages}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1 || loading}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Anterior
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages || loading}
                  >
                    Siguiente
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <FileUploadModal
        open={uploadModalOpen}
        onOpenChange={setUploadModalOpen}
        onUploadComplete={handleRefresh}
      />
    </Layout>
  );
};

export default FileManager;
