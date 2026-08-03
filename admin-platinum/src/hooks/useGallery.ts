import { GalleryImage } from "@/models/galleryImage";
import axiosClient from "@/services/axiosInstance";
import { useEffect, useState } from "react";
import { toast } from "./use-toast";

/**
 * Módulo de Galería (imágenes personalizables de la landing).
 *
 * CONTRATO DE API que el backend debe implementar (aún no existe):
 *   GET    /gallery?page=1&pageSize=500   -> { images: GalleryImage[] }
 *   POST   /gallery/                      body: { path: string }  (key de S3 o URL completa)
 *   PUT    /gallery/reorder               body: { orderedIds: string[] }
 *   DELETE /gallery/:id
 *
 * Está calcado del módulo de Banners; si el backend usa otras rutas/campos,
 * solo hay que ajustarlos aquí.
 */

export type AddGalleryImagePayload = {
  /** Key de S3 (de una subida) o URL completa (elegida del administrador de archivos). */
  path: string;
};

export const useGallery = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

  const client = axiosClient();

  useEffect(() => {
    getAllImages();
  }, []);

  const getAllImages = async () => {
    try {
      setLoading(true);
      const { data } = await client.get(`/gallery?page=1&pageSize=500`);
      setImages(data.images ?? data.gallery ?? []);
    } catch (error: unknown) {
      console.error("[useGallery] getAllImages:", error);
    } finally {
      setLoading(false);
    }
  };

  const addImage = async (payload: AddGalleryImagePayload): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await client.post(`/gallery/`, payload, {
        headers: { "Content-Type": "application/json" },
      });
      toast({
        title: "Imagen agregada a la galería.",
        variant: "success",
        description:
          response.data?.message ?? "Ya está disponible en la landing.",
      });
      await getAllImages();
      return true;
    } catch (error: any) {
      const msg =
        error?.response?.data?.error ??
        error?.response?.data?.message ??
        error?.message ??
        "No se pudo agregar la imagen.";
      toast({
        title: "Error al agregar imagen",
        variant: "destructive",
        description: msg,
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const reorderImages = async (orderedIds: string[]) => {
    try {
      setLoading(true);
      await client.put(
        `/gallery/reorder`,
        { orderedIds },
        { headers: { "Content-Type": "application/json" } }
      );
      toast({
        title: "Orden actualizado",
        variant: "success",
        description: "La galería del sitio usará este orden.",
      });
      await getAllImages();
    } catch (error: any) {
      const msg =
        error?.response?.data?.error ??
        error?.response?.data?.message ??
        error?.message ??
        "No se pudo guardar el orden.";
      toast({
        title: "Error al reordenar",
        variant: "destructive",
        description: msg,
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteImage = async (id: GalleryImage["id"]) => {
    try {
      setLoading(true);
      const response = await client.delete(`/gallery/${id}`);
      toast({
        title: "Imagen eliminada de la galería.",
        variant: "success",
        description: response.data?.message ?? "Se eliminó el registro.",
      });
      await getAllImages();
    } catch (error: any) {
      const msg =
        error?.response?.data?.error ?? error?.message ?? "Error al eliminar.";
      toast({
        title: "Error al eliminar imagen",
        variant: "destructive",
        description: msg,
      });
    } finally {
      setLoading(false);
    }
  };

  return { loading, images, addImage, reorderImages, deleteImage, getAllImages };
};
