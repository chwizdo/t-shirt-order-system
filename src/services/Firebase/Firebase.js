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
  setDoc,
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
        customer: await this.getReferenceValue(orderDoc, "customerRef"),
        date: this.getSingleDate(orderDoc),
        id: this.getSingleValue(orderDoc, "id"),
        status: await this.getReferenceValue(orderDoc, "statusRef"),
      };
    }
    return summaries;
  }

  // Get a single full order details.
  async getOrder(orderId) {
    const orderDoc = await getDoc(doc(this.db, "orders", orderId));
    return {
      [orderDoc.id]: {
        customer: await this.getReferenceValue(orderDoc, "customerRef"),
        date: this.getSingleDate(orderDoc),
        design: this.getSingleValue(orderDoc, "design"),
        designer: await this.getReferenceValue(orderDoc, "designerRef"),
        id: this.getSingleValue(orderDoc, "id"),
        material: await this.getReferenceValue(orderDoc, "materialRef"),
        remark: this.getSingleValue(orderDoc, "remark"),
        status: await this.getReferenceValue(orderDoc, "statusRef"),
        variations: await this.getOrderVariations(orderDoc),
      },
    };
  }

  async getOrderVariations(orderDoc) {
    const orderDocPath = orderDoc.ref.path;
    const variationsCollection = collection(
      this.db,
      `${orderDocPath}/variations`
    );
    const variationDocs = (await getDocs(variationsCollection)).docs;

    const variations = {};
    for (const variationDoc of variationDocs) {
      variations[variationDoc.id] = {
        collar: await this.getReferenceValue(variationDoc, "collarRef"),
        color: await this.getSingleValue(variationDoc, "color"),
        sleeve: await this.getReferenceValue(variationDoc, "sleeveRef"),
        sizes: await this.getVariationSizes(variationDoc),
      };
    }
    return variations;
  }

  async getVariationSizes(variationDoc) {
    const variationDocPath = variationDoc.ref.path;
    const sizesCollection = collection(this.db, `${variationDocPath}/sizes`);
    const sizeDocs = (await getDocs(sizesCollection)).docs;

    const sizes = {};
    for (const sizeDoc of sizeDocs) {
      sizes[sizeDoc.id] = {
        size: await this.getReferenceValue(sizeDoc, "sizeRef"),
        prints: await this.getSizePrints(sizeDoc),
      };
    }
    return sizes;
  }

  async getSizePrints(sizeDoc) {
    const sizeDocPath = sizeDoc.ref.path;
    const printsCollection = collection(this.db, `${sizeDocPath}/prints`);
    const printDocs = (await getDocs(printsCollection)).docs;

    const prints = {};
    for (const printDoc of printDocs) {
      prints[printDoc.id] = {
        name: this.getSingleValue(printDoc, "name"),
        number: this.getSingleValue(printDoc, "number"),
        quantity: this.getSingleValue(printDoc, "quantity"),
      };
    }
    return prints;
  }

  // Get designer from order document.
  // Returns null if designer document doesn't exist.
  async getReferenceValue(doc, key) {
    if (!doc.data()[key]) return null;
    const nestedDoc = await getDoc(doc.data()[key]);
    if (!nestedDoc.exists) return null;
    return { [nestedDoc.id]: { name: nestedDoc.data().name || null } };
  }

  // Get creation date from order document.
  // Returns null if creation date doesn't exist.
  getSingleDate(doc) {
    const date = this.getSingleValue(doc, "date");
    return date ? new Date(date.seconds * 1000) : null;
  }

  // Get an order property from order document.
  // Returns null if order property doesn't exist.
  getSingleValue(doc, key) {
    return doc.data()[key] || null;
  }

  generateDocId = () => doc(collection(this.db, "orders")).id;

  async createOrder(order) {
    const orderId = Object.keys(order)[0];
    const customerId = Object.keys(order[orderId].customer)[0];
    const designerId = Object.keys(order[orderId].designer)[0];
    const materialId = Object.keys(order[orderId].material)[0];
    const statusId = Object.keys(order[orderId].status)[0];
    await setDoc(doc(this.db, "orders", orderId), {
      customerRef: doc(this.db, "customers", customerId),
      date: Timestamp.fromDate(order[orderId].date),
      design: order[orderId].design,
      designerRef: doc(this.db, "designers", designerId),
      id: order[orderId].id,
      materialRef: doc(this.db, "materials", materialId),
      remark: order[orderId].remark,
      statusRef: doc(this.db, "status", statusId),
    });

    const variations = { ...order[orderId].variations };
    for (const vId in variations) {
      const collarId = Object.keys(variations[vId].collar)[0];
      const sleeveId = Object.keys(variations[vId].sleeve)[0];
      await setDoc(doc(this.db, "orders", orderId, "variations", vId), {
        collarRef: doc(this.db, "collars", collarId),
        color: variations[vId].color,
        sleeveRef: doc(this.db, "sleeves", sleeveId),
      });

      const sizes = { ...variations[vId].sizes };
      for (const sId in sizes) {
        const sizeId = Object.keys(sizes[sId].size)[0];
        await setDoc(
          doc(this.db, "orders", orderId, "variations", vId, "sizes", sId),
          { sizeRef: doc(this.db, "sizes", sizeId) }
        );

        const prints = { ...sizes[sId].prints };
        for (const pId in prints) {
          await setDoc(
            doc(
              this.db,
              "orders",
              orderId,
              "variations",
              vId,
              "sizes",
              sId,
              "prints",
              pId
            ),
            {
              name: prints[pId].name,
              number: prints[pId].number,
              quantity: parseInt(prints[pId].quantity),
            }
          );
        }
      }
    }
  }

  // serverTimeStamp() {
  //   return app.firestore.FieldValue.serverTimestamp();
  // }
}

export default Firebase;
