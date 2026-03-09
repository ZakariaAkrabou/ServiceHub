import multer from 'multer';
import cloudinary from '../config/cloudinary.js';

const storage = multer.memoryStorage();
const upload = multer({ storage });

export const uploadMiddleware = (req, res, next) => {
  upload.single('image')(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: 'Upload error: ' + err.message });
    }

    if (!req.file) return next();

    try {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'servicehub/services' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });

      req.file.cloudinaryUrl = result.secure_url;
      next();
    } catch (uploadError) {
      return res.status(500).json({ message: 'Cloudinary error: ' + uploadError.message });
    }
  });
};