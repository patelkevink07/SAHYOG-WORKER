/**
 * Client-side image compression using HTML5 Canvas.
 * Downscales images to max ~480px dimension and encodes to JPEG ~0.7 quality base64 data URL
 * to avoid bloating Firestore documents while ensuring crisp avatar display.
 */
export async function compressImageFile(
  file: File,
  maxEdge: number = 480,
  quality: number = 0.7
): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Selected file is not an image'));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Failed to load image element'));
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxEdge) {
            height = Math.round((height * maxEdge) / width);
            width = maxEdge;
          }
        } else {
          if (height > maxEdge) {
            width = Math.round((width * maxEdge) / height);
            height = maxEdge;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          // Fallback if 2D context unavailable
          resolve(reader.result as string);
          return;
        }

        // Fill background with white for transparent PNGs converted to JPEG
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);

        // Smooth image downsampling
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        try {
          const dataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(dataUrl);
        } catch {
          resolve(reader.result as string);
        }
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}
