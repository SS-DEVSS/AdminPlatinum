/**
 * Convierte una imagen a formato WebP
 * @param file - Archivo de imagen a convertir
 * @param quality - Calidad de compresión (0-1), por defecto 0.85
 * @returns Promise<File> - Archivo WebP convertido
 */
export const convertImageToWebP = async (
  file: File,
  quality: number = 0.85
): Promise<File> => {
  return new Promise((resolve, reject) => {
    // Verificar que sea una imagen
    if (!file.type.startsWith('image/')) {
      reject(new Error('El archivo no es una imagen'));
      return;
    }

    // Si ya es WebP, retornarlo sin convertir
    if (file.type === 'image/webp') {
      resolve(file);
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // Crear canvas
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;

        // Dibujar imagen en canvas
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('No se pudo crear el contexto del canvas'));
          return;
        }

        ctx.drawImage(img, 0, 0);

        // Convertir a WebP
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Error al convertir la imagen a WebP'));
              return;
            }

            // Crear nuevo File con extensión .webp
            const originalName = file.name.replace(/\.[^/.]+$/, '');
            const webpFile = new File([blob], `${originalName}.webp`, {
              type: 'image/webp',
              lastModified: Date.now(),
            });

            resolve(webpFile);
          },
          'image/webp',
          quality
        );
      };

      img.onerror = () => {
        reject(new Error('Error al cargar la imagen'));
      };

      img.src = e.target?.result as string;
    };

    reader.onerror = () => {
      reject(new Error('Error al leer el archivo'));
    };

    reader.readAsDataURL(file);
  });
};

