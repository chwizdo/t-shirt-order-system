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
import {
  doc,
  getFirestore,
  collection,
  getDocs,
  getDoc,
  Timestamp,
} from "firebase/firestore";

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

  // Get a list of all sleeve choices.
  async getChoices(choice) {
    const choiceDocs = (await getDocs(collection(this.db, choice))).docs;
    const choices = {};
    for (const choiceDoc of choiceDocs) {
      choices[choiceDoc.id] = { name: choiceDoc.data().name || null };
    }
    return choices;
  }

  // Get order summaries to populate home page.
  async getSummaries() {
    const orderDocs = (await getDocs(collection(this.db, "orders"))).docs;
    const summaries = {};
    for (const orderDoc of orderDocs) {
      summaries[orderDoc.id] = {
        customer: await this.getOrderNestedValue(orderDoc, "customerRef"),
        date: this.getOrderDate(orderDoc),
        id: this.getOrderSingleValue(orderDoc, "id"),
        status: await this.getOrderNestedValue(orderDoc, "statusRef"),
      };
    }
    return summaries;
  }

  // Get a single full order details.
  async getOrder(orderId) {
    const orderDoc = await getDoc(doc(this.db, "orders", orderId));
    return {
      [orderDoc.id]: {
        customer: await this.getOrderNestedValue(orderDoc, "customerRef"),
        date: this.getOrderDate(orderDoc),
        design: this.getOrderSingleValue(orderDoc, "design"),
        designer: await this.getOrderNestedValue(orderDoc, "designerRef"),
        id: this.getOrderSingleValue(orderDoc, "id"),
        material: await this.getOrderNestedValue(orderDoc, "materialRef"),
        remark: this.getOrderSingleValue(orderDoc, "remark"),
        status: await this.getOrderNestedValue(orderDoc, "statusRef"),
      },
    };
  }

  // Get designer from order document.
  // Returns null if designer document doesn't exist.
  async getOrderNestedValue(orderDoc, key) {
    if (!orderDoc.data()[key]) return null;
    const nestedDoc = await getDoc(orderDoc.data()[key]);
    if (!nestedDoc.exists) return null;
    return { [nestedDoc.id]: { name: nestedDoc.data().name || null } };
  }

  // Get creation date from order document.
  // Returns null if creation date doesn't exist.
  getOrderDate(orderDoc) {
    const date = this.getOrderSingleValue(orderDoc, "date");
    return date ? new Date(date.seconds * 1000) : null;
  }

  // Get an order property from order document.
  // Returns null if order property doesn't exist.
  getOrderSingleValue(orderDoc, key) {
    return orderDoc.data()[key] || null;
  }

  // serverTimeStamp() {
  //   return app.firestore.FieldValue.serverTimestamp();
  // }
}

export default Firebase;
