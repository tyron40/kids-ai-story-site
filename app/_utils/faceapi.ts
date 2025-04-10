// utils/faceapi.ts
import * as faceapi from "face-api.js"

let modelsLoaded = false

export async function loadFaceModels() {
  if (modelsLoaded) return

  const MODEL_URL = "/models"
  try {
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
      faceapi.nets.ageGenderNet.loadFromUri(MODEL_URL),
      faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
    ])
    modelsLoaded = true
  } catch (error) {
    console.error("Error loading face detection models:", error)
    throw new Error("Failed to load face detection models")
  }
}

async function resizeImage(file: File): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const MAX_SIZE = 800
      let width = img.width
      let height = img.height

      if (width > height && width > MAX_SIZE) {
        height *= MAX_SIZE / width
        width = MAX_SIZE
      } else if (height > MAX_SIZE) {
        width *= MAX_SIZE / height
        height = MAX_SIZE
      }

      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        reject(new Error('Failed to get canvas context'))
        return
      }
      
      ctx.drawImage(img, 0, 0, width, height)
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Failed to create blob'))
          return
        }
        const resizedFile = new File([blob], file.name, {
          type: file.type,
          lastModified: Date.now(),
        })
        resolve(resizedFile)
      }, file.type)
    }
    img.onerror = () => reject(new Error('Failed to load image'))
    img.src = URL.createObjectURL(file)
  })
}

export async function analyzeFace(file: File) {
  try {
    await loadFaceModels()
    
    // Resize image before processing
    const resizedFile = await resizeImage(file)
    const img = await faceapi.bufferToImage(resizedFile)
    
    // Clean up object URL after image is loaded
    URL.revokeObjectURL(img.src)

    const result = await faceapi
      .detectSingleFace(img, new faceapi.TinyFaceDetectorOptions())
      .withAgeAndGender()
      .withFaceExpressions()

    if (!result) return null

    return {
      age: Math.round(result.age),
      gender: result.gender,
      expressions: result.expressions,
    }
  } catch (error) {
    console.error("Face analysis failed:", error)
    throw new Error("Failed to analyze face")
  }
}
