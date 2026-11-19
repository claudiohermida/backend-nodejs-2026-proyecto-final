import {
  getAllProductsService,
  getProductService,
  createProductService,
  deleteProductService,
} from "../services/products.services.js";

export async function getAllProducts(req, res) {
  const category = req.query.category;
  try {
    const products = await getAllProductsService(category);
    console.log("products from Services", products);
    if (products.length > 0) {
      res.send({
        message: "Productos encontrados",
        data: products,
      });
    } else {
      res.status(404).send({
        message: "Producto/s no encontrado/s",
      });
    }
  } catch (error) {
    console.error("Error getting products from Firestore:", error);
    res.status(500).send({
      message: "Error interno",
    });
  }
}

export async function getProduct(req, res) {
  const { id } = req.params;
  if (!id) {
    return res.status(400).send({
      message: "el id del producto es necesario",
    });
  }

  try {
    const product = await getProductService(id);
    if (!product) {
      return res.status(404).send({
        message: `Producto con ID "${id}" no encontrado.`,
      });
    }

    return res.send({
      message: "Producto encontrado",
      data: product,
    });
  } catch (error) {
    console.error("Error getting product from Firestore:", error);
    return res.status(500).send({
      message: "Error interno al obtener el producto.",
    });
  }
}

export const createProduct = async (req, res) => {
  const { id, title, price, description, category, image, rating } = req.body;
  if (req.body) {
    const newProduct = await createProductService({
      // id,
      title,
      price,
      description,
      category,
      image,
      rating,
    });
    res.status(201).json(newProduct.id);
  } else {
    res.status(400).send({
      message: "el producto es necesario",
    });
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  if (id) {
    await deleteProductService(id);
    res.status(200).send({
      message: `Producto ${id} eliminado`,
    });
  } else {
    res.status(400).send({
      message: "el id del producto es necesario",
    });
  }
};
