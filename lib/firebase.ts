// src/lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app"
import { getDatabase } from "firebase/database"

const firebaseConfig = {
  apiKey: "AIzaSyB9VoGSJtqFlIExA_8tEt516OkBUbu4G4A",
  authDomain: "tarrawatch-b888f.firebaseapp.com",
  databaseURL: "https://tarrawatch-b888f-default-rtdb.firebaseio.com",
  projectId: "tarrawatch-b888f",
  storageBucket: "tarrawatch-b888f.appspot.com",
  messagingSenderId: "348082025465",
  appId: "1:348082025465:web:66904f6f8056caae464328",
  measurementId: "G-XVV702VGEN",
}

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()
export const database = getDatabase(app)
