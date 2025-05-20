// src/lib/firebase.ts
import { initializeApp } from 'firebase/app'
import { getDatabase } from 'firebase/database'

const firebaseConfig = {
  apiKey: 'AIzaSyB9VoGSJtqFlIExA_8tEt516OkBUbu4G4A+',
  authDomain: 'TU_AUTH_DOMAIN',
  databaseURL: 'https://tarrawatch-b888f-default-rtdb.firebaseio.com/',
  projectId: 'TU_PROJECT_ID',
  storageBucket: 'TU_BUCKET.appspot.com',
  messagingSenderId: 'TU_MESSAGING_ID',
  appId: 'TU_APP_ID',
}

export const app = initializeApp(firebaseConfig)
export const database = getDatabase(app)