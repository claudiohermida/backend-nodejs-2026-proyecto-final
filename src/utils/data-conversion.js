import "dotenv/config";
import { readFile } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { collection, doc, writeBatch } from "firebase/firestore";
import { db } from "../data/data.js";

const currentDirectory = dirname(fileURLToPath(import.meta.url));
const productsFile = resolve(currentDirectory, "../data/products.json");
const batchSize = 500;

function validateProducts(products) {
  if (!Array.isArray(products)) {
    throw new TypeError("El archivo de productos debe contener un arreglo JSON.");
  }

  const seenIds = new Set();
  return products.map((product, index) => {
    if (!product || typeof product !== "object" || Array.isArray(product)) {
      throw new TypeError(`El producto en la posición ${index} debe ser un objeto.`);
    }

    const { id } = product;
    if (
      (typeof id !== "string" && typeof id !== "number") ||
      (typeof id === "string" && id.trim() === "") ||
      (typeof id === "number" && !Number.isFinite(id))
    ) {
      throw new TypeError(`El producto en la posición ${index} debe tener un id string o number válido.`);
    }

    const documentId = String(id);
    if (documentId.includes("/")) {
      throw new TypeError(`El id "${documentId}" no puede contener "/".`);
    }
    if (seenIds.has(documentId)) {
      throw new Error(`El id "${documentId}" está duplicado en products.json.`);
    }

    seenIds.add(documentId);
    return { documentId, product };
  });
}

export async function convertProductsToFirestore(products) {
  const validatedProducts = validateProducts(products);
  const productsCollection = collection(db, "products");

  for (let offset = 0; offset < validatedProducts.length; offset += batchSize) {
    const batch = writeBatch(db);
    const chunk = validatedProducts.slice(offset, offset + batchSize);

    for (const { documentId, product } of chunk) {
      batch.set(doc(productsCollection, documentId), product);
    }

    await batch.commit();
  }

  return validatedProducts.length;
}

async function main() {
  const fileContents = await readFile(productsFile, "utf8");
  const products = JSON.parse(fileContents);
  const importedCount = await convertProductsToFirestore(products);
  console.log(`Se importaron ${importedCount} productos en la colección "products".`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error("Error al convertir productos a Firestore:", error);
    process.exitCode = 1;
  });
}
