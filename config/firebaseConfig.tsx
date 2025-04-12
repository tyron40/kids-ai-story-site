// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getStorage } from "firebase/storage"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "ai-kids-story-generator-f167e.firebaseapp.com",
  projectId: "ai-kids-story-generator-f167e",
  storageBucket: "ai-kids-story-generator-f167e.firebasestorage.app",
  messagingSenderId: "251077249218",
  appId: "1:251077249218:web:9194a818ac09c43b51135b",
  measurementId: "G-WJ6EYJJCW2",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const storage = getStorage(app)
