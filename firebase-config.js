// إعدادات الربط بمشروع Firebase (Just-a-girl)
const firebaseConfig = {
  apiKey: "AIzaSyBYcjNMku4yc6ekL8ZaaXe8Bg6Linbi4Mo",
  authDomain: "just-a-girl-6313e.firebaseapp.com",
  projectId: "just-a-girl-6313e",
  storageBucket: "just-a-girl-6313e.firebasestorage.app",
  messagingSenderId: "571477381444",
  appId: "1:571477381444:web:0cbbcc2de547680728c711",
  measurementId: "G-PKZ9DPQ16R"
};

firebase.initializeApp(firebaseConfig);

window.fbDb = firebase.firestore();
window.fbAuth = firebase.auth();
