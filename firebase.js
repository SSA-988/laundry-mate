import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDybvEl6Izf5cVErhynU11NMqeb2VflC_s",
  authDomain: "laundry-74840.firebaseapp.com",
  projectId: "laundry-74840",
  storageBucket: "laundry-74840.appspot.com",
  messagingSenderId: "704071544716",
  appId: "1:704071544716:web:4dd40cb72fab835eb1b0a9",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore();

export { auth, db };
