import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// import "firebase/auth";
// import "firebase/analytics";
// import "firebase/firestore";

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

    // app.initializeApp(firebaseConfig);
    // app.analytics();
    // this.auth = app.auth();
    // this.db = app.firestore();
  }

  //   createUserWithEmailAndPassword(email, password) {
  //     return this.auth.createUserWithEmailAndPassword(email, password);
  //   }

  //   doSignInWithEmailAndPassword(email, password) {
  //     return this.auth.signInWithEmailAndPassword(email, password);
  //   }

  //   doSignOut() {
  //     return this.auth.signOut();
  //   }

  //   serverTimeStamp() {
  //     return app.firestore.FieldValue.serverTimestamp();
  //   }
}

export default Firebase;

// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyD34KJ19zqZs5nhhTydo_JP3XIrcS9Uuxc",
//   authDomain: "t-shirt-order-system.firebaseapp.com",
//   projectId: "t-shirt-order-system",
//   storageBucket: "t-shirt-order-system.appspot.com",
//   messagingSenderId: "7450264096",
//   appId: "1:7450264096:web:3dc298dc9aeedf3d6c7245",
//   measurementId: "G-T5N0RJZQXE"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
