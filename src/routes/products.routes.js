// products.routes.js
import express from "express";
const router = express.Router();
import {
  getAllProducts,
  getProduct,
  createProduct,
  deleteProduct,
} from "../controllers/products.controllers.js";
router.get("/products", getAllProducts);
router.get("/products/:id", getProduct);
router.post("/products", createProduct);
router.delete("/products/:id", deleteProduct);
export default router;
