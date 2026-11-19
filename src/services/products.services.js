import {
  getAllProductsModel,
  getProductModel,
  createProductModel,
  deleteProductModel,
} from "../models/products.model.js";

// const productsCollection = collection(db, "products");

export const getAllProductsService = async () => {
  //try {
  const products = await getAllProductsModel();
  return products;
  // } catch (error) {
  //   throw new Error("Error al obtener los productos de Firestore.", {
  //     cause: error,
  //   });
};
//};

export const getProductService = async (id) => {
  const product = await getProductModel(id);
  return product;
};

export const createProductService = async (productData) => {
  //try {
  const newProduct = await createProductModel(productData);
  return newProduct;
  // } catch (error) {
  //   throw new Error(`Error al crear el producto "${productData}" `, {
  //     cause: error,
  // });
};

export const deleteProductService = async (id) => {
  //try {
  await deleteProductModel(id);
  // } catch (error) {
  //   throw new Error(`Error al eliminar el producto con ID "${id}"`, {
  //     cause: error,
  //   });
  // }
};
