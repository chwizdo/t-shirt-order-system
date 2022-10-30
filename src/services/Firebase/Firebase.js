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
  deleteDoc,
  where,
  query,
  updateDoc,
} from "firebase/firestore";
import ModelUtil from "../ModelUtil";
import { getStorage, ref, getDownloadURL, uploadBytes } from "firebase/storage";

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
    this.modelUtil = new ModelUtil(this);
    this.storage = getStorage(this.app);
    this.o = "orders";
    this.v = "variations";
    this.s = "sizes";
    this.p = "prints";
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

  setChoice = async (choice, id, name) => {
    await setDoc(doc(this.db, choice, id), { name: name });
  };

  deleteChoice = async (choice, id) => {
    await deleteDoc(doc(this.db, choice, id));
  };

  createChoice = async (choice, id, name) => {
    await setDoc(doc(this.db, choice, id), { name: name });
  };

  // Get order summaries to populate home page.
  async getSummaries() {
    const orderDocs = (
      await getDocs(
        query(collection(this.db, "orders"), where("isVisible", "==", true))
      )
    ).docs;
    const summaries = {};
    for (const orderDoc of orderDocs) {
      summaries[orderDoc.id] = {
        customer: await this.getReferenceValue(orderDoc, "customerRef"),
        date: this.getSingleDate(orderDoc),
        status: await this.getReferenceValue(orderDoc, "statusRef"),
      };
    }
    return summaries;
  }

  uploadImage = async (image, oId) => {
    await uploadBytes(ref(this.storage, oId), image);
  };

  getImageUrl = async (path) => {
    if (path) {
      try {
        return await getDownloadURL(ref(this.storage, path));
      } catch (e) {
        console.log(e.code);
        return null;
      }
    }
    return null;
  };

  deleteOrder = async (oId) => {
    await updateDoc(doc(this.db, this.o, oId), { isVisible: false });
  };

  // Get a single full order details.
  async getOrder(orderId) {
    const orderDoc = await getDoc(doc(this.db, "orders", orderId));
    return {
      [orderDoc.id]: {
        customer: await this.getReferenceValue(orderDoc, "customerRef"),
        date: this.getSingleDate(orderDoc),
        design: this.getSingleValue(orderDoc, "design"),
        designer: await this.getReferenceValue(orderDoc, "designerRef"),
        material: await this.getReferenceValue(orderDoc, "materialRef"),
        remark: this.getSingleValue(orderDoc, "remark"),
        status: await this.getReferenceValue(orderDoc, "statusRef"),
        variations: await this.getOrderVariations(orderDoc),
        image: await this.getImageUrl(orderId),
        isVisible: this.getSingleBoolean(orderDoc, "isVisible"),
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
    if (!nestedDoc.exists()) return null;
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

  getSingleBoolean(doc, key) {
    return !!doc.data()[key];
  }

  generateDocId = () => doc(collection(this.db, "orders")).id;

  setOrder = async (orderTree) => {
    const oId = this.modelUtil.getTreeId(orderTree);
    const customer = this.modelUtil.getTreeInfo(orderTree, "customer");
    const customerId = this.modelUtil.getTreeId(customer);
    const designer = this.modelUtil.getTreeInfo(orderTree, "designer");
    const designerId = this.modelUtil.getTreeId(designer);
    const material = this.modelUtil.getTreeInfo(orderTree, "material");
    const materialId = this.modelUtil.getTreeId(material);
    const status = this.modelUtil.getTreeInfo(orderTree, "status");
    const statusId = this.modelUtil.getTreeId(status);
    const design = this.modelUtil.getTreeInfo(orderTree, "design");
    const date = this.modelUtil.getTreeInfo(orderTree, "date");
    const remark = this.modelUtil.getTreeInfo(orderTree, "remark");
    const variationTrees = this.modelUtil.getTreeInfo(orderTree, "variations");
    const isVisible = this.modelUtil.getTreeInfo(orderTree, "isVisible");
    await setDoc(doc(this.db, this.o, oId), {
      customerRef: doc(this.db, "customers", customerId),
      date: Timestamp.fromDate(date),
      design: design,
      designerRef: doc(this.db, "designers", designerId),
      materialRef: doc(this.db, "materials", materialId),
      remark: remark,
      statusRef: doc(this.db, "status", statusId),
      isVisible: isVisible,
    });
    for (const [vId, vInfo] of Object.entries(variationTrees)) {
      await this.setVariation({ [vId]: vInfo }, oId);
    }
  };

  setVariation = async (variationTree, oId) => {
    const vId = this.modelUtil.getTreeId(variationTree);
    const collar = this.modelUtil.getTreeInfo(variationTree, "collar");
    const collarId = this.modelUtil.getTreeId(collar);
    const color = this.modelUtil.getTreeInfo(variationTree, "color");
    const sleeve = this.modelUtil.getTreeInfo(variationTree, "sleeve");
    const sleeveId = this.modelUtil.getTreeId(sleeve);
    const sizeTrees = this.modelUtil.getTreeInfo(variationTree, "sizes");

    await setDoc(doc(this.db, this.o, oId, this.v, vId), {
      collarRef: doc(this.db, "collars", collarId),
      color: color,
      sleeveRef: doc(this.db, "sleeves", sleeveId),
    });
    for (const [sId, sInfo] of Object.entries(sizeTrees)) {
      await this.setSize({ [sId]: sInfo }, oId, vId);
    }
  };

  setSize = async (sizeTree, oId, vId) => {
    const sId = this.modelUtil.getTreeId(sizeTree);
    const size = this.modelUtil.getTreeInfo(sizeTree, "size");
    const sizeId = this.modelUtil.getTreeId(size);
    const printTrees = this.modelUtil.getTreeInfo(sizeTree, "prints");
    await setDoc(doc(this.db, this.o, oId, this.v, vId, this.s, sId), {
      sizeRef: doc(this.db, "sizes", sizeId),
    });
    for (const [pId, pInfo] of Object.entries(printTrees)) {
      await this.setPrint({ [pId]: pInfo }, oId, vId, sId);
    }
  };

  setPrint = async (printTree, oId, vId, sId) => {
    const pId = this.modelUtil.getTreeId(printTree);
    const name = this.modelUtil.getTreeInfo(printTree, "name");
    const number = this.modelUtil.getTreeInfo(printTree, "number");
    const quantity = this.modelUtil.getTreeInfo(printTree, "quantity");
    await setDoc(
      doc(this.db, this.o, oId, this.v, vId, this.s, sId, this.p, pId),
      { name: name, number: number, quantity: quantity }
    );
  };
}

export default Firebase;
