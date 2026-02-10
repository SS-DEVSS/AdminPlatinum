export type ImportJobType = 'products' | 'references' | 'applications';
export type ImportJobStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface ImportJob {
  id: string;
  type: ImportJobType;
  status: ImportJobStatus;
  fileName: string;
  categoryId: string | null;
  progress: number;
  totalRows: number;
  processedRows: number;
  created: number;
  updated: number;
  skipped: number;
  failed: number;
  errors: string[];
  warnings: string[];
  result: any | null;
  startedAt: Date | null;
  completedAt: Date | null;
  userId: string | null;
  fileS3Key: string | null;
  originalFileName: string;
  localFilePath: string | null;
  createdAt: Date;
  updatedAt: Date;
  runtime?: {
    lastHeartbeatAt: Date | null;
    secondsSinceHeartbeat: number;
    isStale: boolean;
    staleAfterSeconds: number;
  };
}

export interface ImportJobsResponse {
  jobs: ImportJob[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

