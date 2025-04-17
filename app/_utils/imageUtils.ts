const MAX_SIZE = 1024; // Maximum dimension
const QUALITY = 0.8; // JPEG quality
const SIZE_THRESHOLD = 500 * 1024; // 500KB threshold for optimization

async function optimizeImage(data: Blob): Promise<Blob> {
  // Skip optimization for small images
  if (data.size <= SIZE_THRESHOLD) {
    return data;
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let { width, height } = img;
      
      // Calculate new dimensions while maintaining aspect ratio
      if (width > height && width > MAX_SIZE) {
        height = Math.round((height * MAX_SIZE) / width);
        width = MAX_SIZE;
      } else if (height > MAX_SIZE) {
        width = Math.round((width * MAX_SIZE) / height);
        height = MAX_SIZE;
      }

      canvas.width = width;
      canvas.height = height;
      
      const ctx = canvas.getContext('2d', { alpha: false }); // Disable alpha for JPEGs
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }
      
      // Fill with white background for JPEGs
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, width, height);
      
      ctx.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob(
        (blob) => blob ? resolve(blob) : reject(new Error('Failed to create blob')),
        'image/jpeg',
        QUALITY
      );
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(data);
  });
}

async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to convert blob to base64'));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export async function getImageData(image: File | string): Promise<string | null> {
  if (!image) return null;

  try {
    let blob: Blob;

    if (typeof image === "object") {
      // Handle File object
      blob = image;
    } else if (image.startsWith('data:image/')) {
      // Handle base64 data URL
      const base64Data = image.split(',')[1];
      if (!base64Data) throw new Error('Invalid base64 data URL');
      
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      
      const byteArray = new Uint8Array(byteNumbers);
      blob = new Blob([byteArray], { type: 'image/jpeg' });
    } else if (image.match(/^[A-Za-z0-9+/=]+$/)) {
      // Handle raw base64 string (from camera)
      const byteCharacters = atob(image);
      const byteNumbers = new Array(byteCharacters.length);
      
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      
      const byteArray = new Uint8Array(byteNumbers);
      blob = new Blob([byteArray], { type: 'image/jpeg' });
    } else if (image.startsWith('http')) {
      // Handle URL
      const response = await fetch(image);
      if (!response.ok) throw new Error('Failed to fetch image URL');
      blob = await response.blob();
    } else {
      throw new Error('Invalid image format');
    }

    // Optimize the blob
    const optimizedBlob = await optimizeImage(blob);
    return await blobToBase64(optimizedBlob);

  } catch (error) {
    console.error('Error processing image:', error);
    return null;
  }
}
