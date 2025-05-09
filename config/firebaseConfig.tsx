// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getStorage } from "firebase/storage"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "ai-kids-story-generator-f167e.firebaseapp.com",
  projectId: "ai-kids-story-generator-f167e",
  storageBucket: "ai-kids-story-generator-f167e.appspot.com", // Fixed storage bucket URL
  messagingSenderId: "251077249218",
  appId: "1:251077249218:web:9194a818ac09c43b51135b",
  measurementId: "G-WJ6EYJJCW2"
}

// Initialize Firebase only on client side
let app
let storage

if (typeof window !== 'undefined') {
  try {
    app = initializeApp(firebaseConfig)
    storage = getStorage(app)
  } catch (error) {
    console.error('Error initializing Firebase:', error)
  }
}

export { storage }
