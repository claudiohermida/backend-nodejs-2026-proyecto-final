import express from "express";
import cors from "cors";
import rutasProductos from "./src/routes/products.routes.js";
import authRouter from "./src/routes/auth.routes.js";
import bodyParser from "body-parser";
import { authentication } from "./src/middlewares/authentication.js";
import "dotenv/config";

const app = express();

// Middleware
// Middleware para parsear el cuerpo de las solicitudes como JSON
app.use(bodyParser.json());
// Middleware para habilitar CORS
app.use(cors());

// Routers
app.use("/auth", authRouter);

app.use((req, res, next) => {
  console.log(`Datos recibidos: ${req.method} ${req.url}`);
  next();
});

app.use("/api", authentication, rutasProductos);

app.use((req, res, next) => {
  //console.log("test 2")
  res.status(404).json({
    error: "404 ruta no encontrada",
    mensaje: `el recurso ${req.url} no existe`,
  });
});

const PORT = 3010;

app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});
