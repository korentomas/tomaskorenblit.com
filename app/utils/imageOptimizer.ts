import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';

const CACHE_DIR = path.join(process.cwd(), 'public', 'optimized-images');

export async function optimizeImage(
  imagePath: string,
  options: {
    width?: number;
    quality?: number;
    format?: 'webp' | 'jpeg' | 'png';
  } = {}
) {
  const {
    width = 800,
    quality = 80,
    format = 'webp'
  } = options;

  // Ensure cache directory exists
  await fs.mkdir(CACHE_DIR, { recursive: true });

  const originalPath = path.join(process.cwd(), 'public', imagePath);
  const filename = path.basename(imagePath, path.extname(imagePath));
  const optimizedFilename = `${filename}-${width}w-${quality}q.${format}`;
  const optimizedPath = path.join(CACHE_DIR, optimizedFilename);

  try {
    // Check if optimized version already exists
    await fs.access(optimizedPath);
    return `/optimized-images/${optimizedFilename}`;
  } catch {
    // If not, create optimized version
    await sharp(originalPath)
      .resize(width, null, {
        withoutEnlargement: true,
        fit: 'inside'
      })
      .toFormat(format, { quality })
      .toFile(optimizedPath);

    return `/optimized-images/${optimizedFilename}`;
  }
} 