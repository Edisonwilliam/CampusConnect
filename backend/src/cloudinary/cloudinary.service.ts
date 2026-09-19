import { Injectable, Inject } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  constructor(@Inject('CLOUDINARY') private cloudinaryInstance) {}

  async uploadImage(
    file: Express.Multer.File,
    folder: string = 'campus-connect',
  ): Promise<{ url: string; publicId: string }> {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: folder,
          resource_type: 'auto',
        },
        (error, result) => {
          if (error) {
            reject(new Error(`Upload failed: ${error.message}`));
          } else {
            resolve({
              url: result.secure_url,
              publicId: result.public_id,
            });
          }
        },
      );

      stream.end(file.buffer);
    });
  }

  async deleteImage(publicId: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      throw new Error(`Delete failed: ${error.message}`);
    }
  }
}