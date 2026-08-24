export interface GalleryImage {
  id: string;
  /** URL pública ya resuelta por el backend (para mostrar). */
  imageUrl: string;
  /** Posición dentro de la galería (menor primero). */
  sortOrder: number;
}
