// utils/uploadImage.ts
import { v2 as cloudinary } from 'cloudinary';
import { UploadApiResponse } from 'cloudinary';

// Configuración
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

/**
 * Sube una imagen a Cloudinary y devuelve la URL.
 * @param imagePath Path local o URL de la imagen
 * @returns URL pública de la imagen subida
 */
export const uploadImageToCloudinary = async (
  imagePath: string,
  folder: string = 'challenge-options'
): Promise<string> => {
  try {
    const result: UploadApiResponse = await cloudinary.uploader.upload(imagePath, {
      folder,
      resource_type: 'image',
    });

    return result.secure_url;
  } catch (error) {
    console.error('Error al subir imagen:', error);
    throw new Error('No se pudo subir la imagen a Cloudinary.');
  }
};
