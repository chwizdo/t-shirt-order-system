import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD34KJ19zqZs5nhhTydo_JP3XIrcS9Uuxc",
  authDomain: "t-shirt-order-system.firebaseapp.com",
  projectId: "t-shirt-order-system",
  storageBucket: "t-shirt-order-system.appspot.com",
  messagingSenderId: "7450264096",
  appId: "1:7450264096:web:3dc298dc9aeedf3d6c7245",
  measurementId: "G-T5N0RJZQXE",
};

class Firebase {
  constructor() {
    this.app = initializeApp(firebaseConfig);
    this.analytics = getAnalytics(this.app);
    this.auth = getAuth(this.app);
    this.db = getFirestore(this.app);
  }

  //   createUserWithEmailAndPassword(email, password) {
  //     return this.auth.createUserWithEmailAndPassword(email, password);
  //   }

  async signInWithEmailAndPassword(email, password) {
    try {
      await signInWithEmailAndPassword(this.auth, email, password);
    } catch (e) {
      console.log(e.code);
      console.log(e.message);
    }
  }

  async signOut() {
    await signOut(this.auth);
  }

  //   serverTimeStamp() {
  //     return app.firestore.FieldValue.serverTimestamp();
  //   }
}

export default Firebase;
