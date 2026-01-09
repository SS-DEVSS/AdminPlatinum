import { useState } from "react";
import { useImportJobs } from "@/hooks/useImportJobs";
import { ImportJobType, ImportJobStatus } from "@/models/importJob";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle2, Clock, XCircle, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight } from "lucide-react";

const getStatusBadge = (status: ImportJobStatus) => {
  const statusConfig = {
    pending: { label: "Pendiente", variant: "secondary" as const, icon: Clock },
    processing: { label: "En Progreso", variant: "default" as const, icon: Loader2 },
    completed: { label: "Completado", variant: "default" as const, icon: CheckCircle2 },
    failed: { label: "Fallido", variant: "destructive" as const, icon: XCircle },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className="flex items-center gap-1 w-fit">
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
};

const getTypeLabel = (type: ImportJobType) => {
  const labels = {
    products: "Productos",
    references: "Referencias",
    applications: "Aplicaciones",
  };
  return labels[type];
};

const formatDate = (date: Date | string | null) => {
  if (!date) return "N/A";
  const d = new Date(date);
  return d.toLocaleString("es-ES", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

interface ImportJobsDashboardProps {
  onJobClick?: (jobId: string) => void;
}

const ImportJobsDashboard = ({ onJobClick }: ImportJobsDashboardProps) => {
  const [typeFilter, setTypeFilter] = useState<ImportJobType | "all">("all");
  const [statusFilter, setStatusFilter] = useState<ImportJobStatus | "all">("all");
  const [page, setPage] = useState(1);
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const limit = 20;

  const { jobs, loading, error, pagination, refresh } = useImportJobs({
    type: typeFilter !== "all" ? typeFilter : undefined,
    status: statusFilter !== "all" ? statusFilter : undefined,
    page,
    limit,
  });

  const selectedJobData = jobs.find((j) => j.id === selectedJob);

  const handleJobClick = (jobId: string) => {
    setSelectedJob(jobId);
    if (onJobClick) {
      onJobClick(jobId);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div className="space-y-4">
      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>Filtra los jobs de importación por tipo y estado</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Tipo de Importación</label>
              <Select
                value={typeFilter}
                onValueChange={(value) => {
                  setTypeFilter(value as ImportJobType | "all");
                  setPage(1);
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="products">Productos</SelectItem>
                  <SelectItem value="references">Referencias</SelectItem>
                  <SelectItem value="applications">Aplicaciones</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Estado</label>
              <Select
                value={statusFilter}
                onValueChange={(value) => {
                  setStatusFilter(value as ImportJobStatus | "all");
                  setPage(1);
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="pending">Pendiente</SelectItem>
                  <SelectItem value="processing">En Progreso</SelectItem>
                  <SelectItem value="completed">Completado</SelectItem>
                  <SelectItem value="failed">Fallido</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de Jobs */}
      <Card>
        <CardHeader>
          <CardTitle>Jobs de Importación</CardTitle>
          <CardDescription>
            {pagination.total} job{pagination.total !== 1 ? "s" : ""} encontrado
            {pagination.total !== 1 ? "s" : ""}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="ml-2">Cargando...</span>
            </div>
          ) : error ? (
            <div className="flex items-center gap-2 text-destructive py-8">
              <AlertCircle className="h-5 w-5" />
              <span>{error}</span>
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No se encontraron jobs de importación
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Archivo</TableHead>
                      <TableHead>Resultados</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {jobs.map((job) => (
                      <TableRow key={job.id} className="cursor-pointer hover:bg-muted/50">
                        <TableCell className="font-medium">
                          {getTypeLabel(job.type)}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            {getStatusBadge(job.status)}
                            {(job.errors.length > 0 || job.warnings.length > 0) && (
                              <div className="text-xs text-muted-foreground">
                                {job.errors.length > 0 && (
                                  <span className="text-red-600">
                                    {job.errors.length} error{job.errors.length > 1 ? 'es' : ''}
                                  </span>
                                )}
                                {job.errors.length > 0 && job.warnings.length > 0 && ' • '}
                                {job.warnings.length > 0 && (
                                  <span className="text-yellow-600">
                                    {job.warnings.length} advertencia{job.warnings.length > 1 ? 's' : ''}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate" title={job.originalFileName || job.fileName}>
                          {job.originalFileName || job.fileName}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm space-y-1">
                            {job.status === "completed" && (
                              <>
                                <div className="text-green-600">
                                  ✓ Creados: {job.created}
                                </div>
                                <div className="text-blue-600">
                                  ↻ Actualizados: {job.updated}
                                </div>
                                {job.skipped > 0 && (
                                  <div className="text-yellow-600">
                                    ⊘ Omitidos: {job.skipped}
                                  </div>
                                )}
                              </>
                            )}
                            {job.status === "failed" && job.failed > 0 && (
                              <div className="text-red-600">
                                ✗ Fallidos: {job.failed}
                              </div>
                            )}
                            {job.errors.length > 0 && (
                              <div className="text-red-600">
                                ⚠ Errores: {job.errors.length}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">
                          {formatDate(job.createdAt)}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleJobClick(job.id)}
                          >
                            Ver Detalles
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Paginación */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-muted-foreground">
                    Página {pagination.page} de {pagination.totalPages}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Anterior
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page === pagination.totalPages}
                    >
                      Siguiente
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Dialog de Detalles */}
      <Dialog open={!!selectedJob} onOpenChange={(open) => !open && setSelectedJob(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalles del Job de Importación</DialogTitle>
            <DialogDescription>
              Información completa del job de importación
            </DialogDescription>
          </DialogHeader>
          {selectedJobData && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Tipo</label>
                  <p className="text-sm font-medium">{getTypeLabel(selectedJobData.type)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Estado</label>
                  <div className="mt-1">{getStatusBadge(selectedJobData.status)}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Archivo</label>
                  <p className="text-sm">{selectedJobData.originalFileName || selectedJobData.fileName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Progreso</label>
                  <p className="text-sm">{selectedJobData.progress}%</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Fecha de Creación</label>
                  <p className="text-sm">{formatDate(selectedJobData.createdAt)}</p>
                </div>
                {selectedJobData.startedAt && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Fecha de Inicio</label>
                    <p className="text-sm">{formatDate(selectedJobData.startedAt)}</p>
                  </div>
                )}
                {selectedJobData.completedAt && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Fecha de Finalización</label>
                    <p className="text-sm">{formatDate(selectedJobData.completedAt)}</p>
                  </div>
                )}
              </div>

              <div className="border-t pt-4">
                <label className="text-sm font-medium text-muted-foreground mb-2 block">
                  Estadísticas
                </label>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Total de filas: </span>
                    <span className="font-medium">{selectedJobData.totalRows}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Procesadas: </span>
                    <span className="font-medium">{selectedJobData.processedRows}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Creadas: </span>
                    <span className="font-medium text-green-600">{selectedJobData.created}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Actualizadas: </span>
                    <span className="font-medium text-blue-600">{selectedJobData.updated}</span>
                  </div>
                  {selectedJobData.skipped > 0 && (
                    <div>
                      <span className="text-muted-foreground">Omitidas: </span>
                      <span className="font-medium text-yellow-600">{selectedJobData.skipped}</span>
                    </div>
                  )}
                  {selectedJobData.failed > 0 && (
                    <div>
                      <span className="text-muted-foreground">Fallidas: </span>
                      <span className="font-medium text-red-600">{selectedJobData.failed}</span>
                    </div>
                  )}
                </div>
              </div>

              {selectedJobData.errors.length > 0 && (
                <div className="border-t pt-4">
                  <label className="text-sm font-medium text-destructive mb-2 block">
                    Errores ({selectedJobData.errors.length})
                  </label>
                  <div className="bg-destructive/10 rounded-md p-3 max-h-48 overflow-y-auto">
                    <ul className="space-y-1 text-sm">
                      {selectedJobData.errors.map((error, index) => (
                        <li key={index} className="text-destructive">
                          • {error}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {selectedJobData.warnings.length > 0 && (
                <div className="border-t pt-4">
                  <label className="text-sm font-medium text-yellow-600 mb-2 block">
                    Advertencias ({selectedJobData.warnings.length})
                  </label>
                  <div className="bg-yellow-50 rounded-md p-3 max-h-48 overflow-y-auto">
                    <ul className="space-y-1 text-sm">
                      {selectedJobData.warnings.map((warning, index) => (
                        <li key={index} className="text-yellow-800">
                          • {warning}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ImportJobsDashboard;

