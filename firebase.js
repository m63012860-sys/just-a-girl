

import { initializeApp } from "https://www.gstatic.com/firebasejs/13.2.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/13.2.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/13.2.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAQm0s0mZDDdxvw4zM6y125sK9cA-PZwJo",
  authDomain: "just-a-girl-622a4.firebaseapp.com",
  projectId: "just-a-girl-622a4",
  storageBucket: "just-a-girl-622a4.firebasestorage.app",
  messagingSenderId: "375542341340",
  appId: "1:375542341340:web:70b8010c6f10244769de19",
  measurementId: "G-JNBVJ3YRX0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Authentication
const auth = getAuth(app);

// Firestore Database
const db = getFirestore(app);

export { app, auth, db };
