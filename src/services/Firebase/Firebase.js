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
  orderBy,
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

  async signUp(name, email, password, code) {
    try {
      const invitation = await getDoc(doc(this.db, "invitations", code));
      if (invitation.exists()) {
        if (!invitation.data().isUsed) {
          const userCredential = await createUserWithEmailAndPassword(
            this.auth,
            email,
            password
          );
          await updateProfile(userCredential.user, { displayName: name });
          await setDoc(doc(this.db, "invitations", code), { isUsed: true });
          await setDoc(doc(this.db, "users", userCredential.user.uid), {
            email: userCredential.user.email,
            isAdmin: false,
            isActive: true,
          });
          return null;
        } else {
          return "Invitation code is used";
        }
      } else {
        return "Invalid invitation code";
      }
    } catch (e) {
      return this.formatErrorCode(e.code);
    }
  }

  async login(email, password) {
    try {
      const userDocs = (
        await getDocs(
          query(collection(this.db, "users"), where("email", "==", email))
        )
      ).docs;
      if (userDocs.length === 1) {
        if (!userDocs[0].data().isActive) return "Your account is suspended";
      }
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

  async getIsAuth() {
    const user = await getDoc(doc(this.db, "users", this.auth.currentUser.uid));
    return user.data().isAdmin;
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

  async getSizes() {
    const sizesDocs = (
      await getDocs(query(collection(this.db, "sizes"), orderBy("order")))
    ).docs;
    const sizes = {};
    for (const sizesDoc of sizesDocs) {
      sizes[sizesDoc.id] = { name: sizesDoc.data().name || null };
    }
    return sizes;
  }

  getMembers = async () => {
    const userDocs = (await getDocs(collection(this.db, "users"))).docs;
    const users = {};
    for (const userDoc of userDocs) {
      users[userDoc.id] = {
        email: userDoc.data().email || null,
        isAdmin: userDoc.data().isAdmin,
        isActive: userDoc.data().isActive,
      };
    }
    return users;
  };

  setMemberActiveStatus = async (id, isActive) => {
    await updateDoc(doc(this.db, "users", id), { isActive: isActive });
  };

  setInvitation = async (id) => {
    await setDoc(doc(this.db, "invitations", id), { isUsed: false });
  };

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
        id: this.getSingleValue(orderDoc, "id"),
        design: this.getSingleValue(orderDoc, "design"),
        image0: await this.getImageUrl(`${orderDoc.id}0`),
        image1: await this.getImageUrl(`${orderDoc.id}1`),
        image2: await this.getImageUrl(`${orderDoc.id}2`),
        image3: await this.getImageUrl(`${orderDoc.id}3`),
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
        return null;
      }
    }
    return null;
  };

  deleteOrder = async (oId) => {
    await updateDoc(doc(this.db, this.o, oId), { isVisible: false });
  };

  updateOrderStatus = async (oId, statusId) => {
    await updateDoc(doc(this.db, this.o, oId), {
      statusRef: doc(this.db, "status", statusId),
    });
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
        image0: await this.getImageUrl(`${orderId}0`),
        image1: await this.getImageUrl(`${orderId}1`),
        image2: await this.getImageUrl(`${orderId}2`),
        image3: await this.getImageUrl(`${orderId}3`),
        isVisible: this.getSingleBoolean(orderDoc, "isVisible"),
        id: this.getSingleValue(orderDoc, "id"),
        link: this.getSingleValue(orderDoc, "link"),
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

  getCount = async () => {
    return (
      await getDoc(doc(this.db, "systems", "SekuIwCyjvSRTNJvOu5L"))
    ).data().count;
  };

  incrementCount = async () => {
    await updateDoc(doc(this.db, "systems", "SekuIwCyjvSRTNJvOu5L"), {
      count: (await this.getCount()) + 1,
    });
  };

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
    const id = this.modelUtil.getTreeInfo(orderTree, "id");
    const link = this.modelUtil.getTreeInfo(orderTree, "link");
    await setDoc(doc(this.db, this.o, oId), {
      customerRef: doc(this.db, "customers", customerId),
      date: Timestamp.fromDate(date),
      design: design,
      designerRef: doc(this.db, "designers", designerId),
      materialRef: doc(this.db, "materials", materialId),
      remark: remark,
      statusRef: doc(this.db, "status", statusId),
      isVisible: isVisible,
      id: id,
      link: link,
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
