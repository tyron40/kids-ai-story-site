export async function urlToFile(url: string) {
  const response = await fetch(url)
  const data = await response.blob()

  return new File([data], "result.png", {
    type: "image/png",
  })
}

export function toBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result)
      } else {
        reject(new Error('Failed to convert file to base64'))
      }
    }
    reader.onerror = (error) => reject(error)
  })
}

export async function urlToBase64(url: string): Promise<string> {
  const file = await urlToFile(url)
  return await toBase64(file)
}

export async function getImageData(image: File | string): Promise<string | null> {
  if (!image) return null;

  try {
    // If image is a File object
    if (typeof image === "object") {
      return (await toBase64(image)) as string;
    }

    // If image is already a base64 string with data:image prefix
    if (image.startsWith('data:image/')) {
      return image;
    }

    // If image is a raw base64 string (from camera)
    if (image.match(/^[A-Za-z0-9+/=]+$/)) {
      return `data:image/png;base64,${image}`;
    }

    // If image is a URL
    if (image.startsWith('http')) {
      return await urlToBase64(image);
    }

    return image;
  } catch (error) {
    console.error('Error processing image data:', error);
    return null;
  }
}
