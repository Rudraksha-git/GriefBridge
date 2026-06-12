import exifr from 'exifr';
import { pipeline, RawImage } from '@xenova/transformers';

let captionerPromise = null;

function getCaptioner() {
  if (!captionerPromise) {
    captionerPromise = pipeline('image-to-text', 'Xenova/vit-gpt2-image-captioning');
  }
  return captionerPromise;
}

/**
 * Extracts date-taken and GPS location from an image's EXIF data.
 */
export async function extractImageMetadata(imageBuffer) {
  try {
    const exif = await exifr.parse(imageBuffer, {
      gps: true,
      pick: ['DateTimeOriginal', 'CreateDate', 'latitude', 'longitude'],
    });

    if (!exif) return { takenAt: null, location: null };

    return {
      takenAt: exif.DateTimeOriginal || exif.CreateDate || null,
      location: exif.latitude && exif.longitude ? { lat: exif.latitude, lng: exif.longitude } : null,
    };
  } catch {
    // Fails safely if WhatsApp/screenshots stripped the EXIF data
    return { takenAt: null, location: null };
  }
}

/**
 * Uses a local Vision Transformer to caption the image offline.
 */
export async function captionImage(imageBuffer) {
  try {
    const model = await getCaptioner();
    
    // Convert the Node.js Buffer into Xenova's native RawImage format
    const image = await RawImage.read(imageBuffer);

    // Run the model (no API keys, no internet needed after first download)
    const result = await model(image);
    
    // Returns something like: "a family sitting around a dinner table"
    return result[0]?.generated_text || "A photograph from the family archive.";
  } catch (error) {
    console.error("Local Image Captioning Error:", error);
    return "A photograph from the family archive.";
  }
}

/**
 * Full pipeline for one image: caption + EXIF metadata in parallel.
 * Returns a memory-ready object.
 */
export async function processImage(imageBuffer, filename, mimeType = 'image/jpeg') {
  const [metadata, caption] = await Promise.all([
    extractImageMetadata(imageBuffer),
    captionImage(imageBuffer),
  ]);

  return {
    type: 'image',
    sourceFile: filename,
    content: caption,
    metadata: {
      takenAt: metadata.takenAt,
      location: metadata.location,
    },
  };
}