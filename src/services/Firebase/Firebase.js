import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
} from "firebase/auth";
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

  async signUp(name, email, password) {
    try {
      // TODO Check invitation code, mark as used.
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      await updateProfile(userCredential.user, { displayName: name });
      return null;
    } catch (e) {
      return this.formatErrorCode(e.code);
    }
  }

  async login(email, password) {
    try {
      await signInWithEmailAndPassword(this.auth, email, password);
    } catch (e) {
      return this.formatErrorCode(e.code);
    }
  }

  async logout() {
    try {
      await signOut(this.auth);
    } catch (e) {
      return this.formatErrorCode(e.code);
    }
  }

  async updateName(user, name) {
    try {
      await updateProfile(user, { displayName: name });
    } catch (e) {
      return this.formatErrorCode(e.code);
    }
  }

  async resetPassword(email) {
    try {
      await sendPasswordResetEmail(this.auth, email);
    } catch (e) {
      return this.formatErrorCode(e.code);
    }
  }

  formatErrorCode(errorCode) {
    const errorMessage = errorCode.split("auth/")[1].replaceAll("-", " ");
    return errorMessage.charAt(0).toUpperCase() + errorMessage.slice(1);
  }

  //   serverTimeStamp() {
  //     return app.firestore.FieldValue.serverTimestamp();
  //   }
}

export default Firebase;
