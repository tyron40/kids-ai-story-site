// utils/faceapi.ts
import * as faceapi from "face-api.js"

export async function loadFaceModels() {
  const MODEL_URL = "/models"
  await Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
    faceapi.nets.ageGenderNet.loadFromUri(MODEL_URL),
    faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
    faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
  ])
}

export async function analyzeFace(file: File) {
  await loadFaceModels()
  const img = await faceapi.bufferToImage(file)

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
}
