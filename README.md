# Backend Talento Tech - Proyecto Final

API REST para consultar un catálogo de productos almacenado en Cloud Firestore.
Está construida con Node.js y Express, y también incluye un endpoint de inicio
de sesión de demostración que genera tokens JWT.

## Requisitos

- Node.js 18 o posterior
- npm
- Un proyecto de Firebase con Cloud Firestore habilitado

## Instalación y configuración

1. Instala las dependencias:

   ```bash
   npm install
   ```

2. Crea un archivo `.env` en la raíz del proyecto con la configuración de
   Firebase y la clave para firmar tokens:

   ```dotenv
   FIREBASE_API_KEY=your-firebase-api-key
   FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
   FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   FIREBASE_APP_ID=your-app-id
   JWT_SECRET_KEY=replace-with-a-long-random-secret
   ```

   Sustituye los valores de Firebase por los de la configuración de tu
   aplicación. No subas el archivo `.env` ni uses credenciales de demostración
   en producción.

3. Inicia el servidor:

   ```bash
   npm start
   ```

   La API queda disponible en `http://localhost:3010`.

## Flujo de usuario

1. El cliente envía correo y contraseña al endpoint de login.
2. Con las credenciales de demostración válidas, la API responde con un JWT
   cuya vigencia es de una hora.
3. El cliente incluye el JWT como token Bearer al consultar la lista de
   productos o al solicitar un producto por su ID de Firestore.
4. La API lee la colección `products` de Firestore y responde con los datos del
   catálogo.

> **Nota:** el endpoint de login usa actualmente un usuario y contraseña
> estáticos definidos en el código. Las rutas de productos requieren un JWT
> válido en el encabezado `Authorization: Bearer <token>`. Este mecanismo usa
> una clave JWT configurada en el servidor, pero no sustituye un sistema de
> usuarios seguro; revisa las credenciales de demostración antes de usar el
> servicio en producción.

## Endpoints

### Iniciar sesión

`POST /auth/login`

```bash
curl -X POST http://localhost:3010/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"user@email.com","password":"strongPass123"}'
```

Una solicitud válida responde con:

```json
{
  "token": "<jwt>"
}
```

Credenciales de demostración actuales:

- Correo: `user@email.com`
- Contraseña: `strongPass123`

Una combinación inválida responde con `401 Unauthorized`.

### Listar productos

`GET /api/products`

```bash
curl http://localhost:3010/api/products \
  -H 'Authorization: Bearer <jwt>'
```

La respuesta incluye un mensaje y el arreglo de productos en `data`. Si no hay
productos, la API responde `404`.

### Obtener un producto

`GET /api/products/:id`

```bash
curl http://localhost:3010/api/products/PRODUCT_ID \
  -H 'Authorization: Bearer <jwt>'
```

El `id` debe ser el ID del documento en la colección `products`. Si no existe,
la API responde `404`.

### Crear un producto

`POST /api/products`

```bash
curl -X POST http://localhost:3010/api/products \
  -H 'Authorization: Bearer <jwt>' \
  -H 'Content-Type: application/json' \
  -d '{
    "id": "21",
    "title": "Producto de ejemplo",
    "price": 19.99,
    "description": "Descripción del producto",
    "category": "electronics",
    "image": "https://example.com/product.jpg",
    "rating": {
      "rate": 4.5,
      "count": 10
    }
  }'
```

El cuerpo debe incluir un `id`, que se usa como ID del documento en Firestore.
Una creación exitosa responde `201 Created` con el producto creado en formato
JSON.

### Eliminar un producto

`DELETE /api/products/:id`

```bash
curl -X DELETE http://localhost:3010/api/products/21 \
  -H 'Authorization: Bearer <jwt>'
```

El `id` debe ser el ID del documento en la colección `products`. Una solicitud
exitosa responde `200 OK`:

```json
{
  "message": "Producto eliminado"
}
```

Las rutas de productos responden `401 Unauthorized` si el token no está
presente, es inválido o expiró.

## Estructura principal

```text
.
├── index.js                       # Configuración y arranque de Express
└── src/
    ├── controllers/               # Manejo de solicitudes y respuestas
    ├── data/
    ├── middlewares/               # Middleware de autenticación
    ├── routes/                    # Rutas de autenticación y productos
    ├── services/                  # Consultas de productos a Firestore
    └── utils/                     # Generación de tokens JWT
```

## Comandos

- `npm start`: inicia la API con Node.js.
- `npm run dev`: inicia el comando de desarrollo configurado en el proyecto
  (requiere que `nodemon` esté instalado).

La colección de Firestore debe llamarse `products`. La estructura de sus
documentos debe coincidir con los campos de este ejemplo:

```json
{
  "id": 1,
  "title": "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops",
  "price": 109.95,
  "description": "Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the sleeve, your everyday",
  "category": "men's clothing",
  "image": "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_t.png",
  "rating": {
    "rate": 3.9,
    "count": 120
  }
}
```

## Importar productos desde JSON

El conversor `src/utils/data-conversion.js` carga `src/data/products.json` y
escribe cada producto como un documento de la colección `products`. El ID del
documento se toma de `product.id`; los documentos existentes con ese ID se
reemplazan. Los IDs duplicados o inválidos detienen la importación antes de
escribir datos.

Después de configurar las variables de entorno, ejecuta:

```bash
node src/utils/data-conversion.js
```

El proceso necesita permisos de escritura en Firestore. Los productos se
envían en lotes de hasta 500 documentos.
