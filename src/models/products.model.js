import { db } from "../data/data.js";
import {
  collection,
  deleteDoc,
  doc,
  getCountFromServer,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";

const productsCollection = collection(db, "products");

export const getAllProductsModel = async (category) => {
  try {
    const productsQuery = category
      ? query(productsCollection, where("category", "==", category))
      : productsCollection;
    const querySnapshot = await getDocs(productsQuery);

    const products = querySnapshot.docs.map((productDoc) => ({
      id: productDoc.id,
      ...productDoc.data(),
    }));

    //console.log("products from Services", products);
    return products;
  } catch (error) {
    throw new Error("Error al obtener los productos de Firestore.", {
      cause: error,
    });
  }
};

export const getProductModel = async (id) => {
  try {
    const productDoc = await getDoc(doc(productsCollection, id));

    if (!productDoc.exists()) {
      return null;
    }

    return {
      id: productDoc.id,
      ...productDoc.data(),
    };
  } catch (error) {
    throw new Error(
      `Error al obtener el producto con ID "${id}" de Firestore.`,
      {
        cause: error,
      },
    );
  }
};

export const createProductModel = async (productData) => {
  try {
    const productsCount = (await getCountFromServer(productsCollection)).data()
      .count;
    const productDoc = doc(productsCollection, productData?.id);

    await setDoc(productDoc, productData);
    return {
      ...productData,
      id: productDoc.id,
    };
  } catch (error) {
    throw new Error(
      `Error al crear el producto con ID "${productData?.id}" en Firestore.`,
      { cause: error },
    );
  }
};

export const deleteProductModel = async (id) => {
  try {
    const productDoc = doc(productsCollection, id);
    await deleteDoc(productDoc);
  } catch (error) {
    throw new Error(
      `Error al eliminar el producto con ID "${id}" de Firestore.`,
      {
        cause: error,
      },
    );
  }
};
