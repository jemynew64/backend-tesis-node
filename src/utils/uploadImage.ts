// utils/uploadImage.ts
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

type Uploadable = string | Buffer;

export const uploadImageToCloudinary = async (
  file: Uploadable,
  filenameOrFolder: string = "challenge-options",
  folderOverride?: string
): Promise<string> => {
  if (typeof file === "string") {
    // Se asume que es una URL o ruta
    return (
      await cloudinary.uploader.upload(file, {
        folder: folderOverride || filenameOrFolder,
        resource_type: "image",
      })
    ).secure_url;
  }

  // Si es buffer, entonces usaremos upload_stream
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folderOverride || "challenge-options",
        public_id: filenameOrFolder.split(".")[0],
        resource_type: "image",
      },
      (err, result) => {
        if (err || !result) return reject(err);
        resolve(result.secure_url);
      }
    );

    uploadStream.end(file);
  });
};
