import jwt from "jsonwebtoken";
import "dotenv/config";

export function authentication(req, res, next) {
  const secretKey = process.env.JWT_SECRET_KEY;
  if (!secretKey) {
    return res.status(500).json({
      message: "La autenticación no está configurada en el servidor",
    });
  }

  const authorization = req.headers.authorization;
  //   if (!authorization?.startsWith("Bearer ")) {
  //     return res.status(401).json({
  //       message: "Se requiere un token Bearer",
  //     });
  //   }

  const token = req.headers["authorization"].split(" ")[1];
  if (!token) return res.sendStatus(401);
  try {
    // req.user = jwt.verify(authorization.slice("Bearer ".length), secretKey);
    // next();
    jwt.verify(token, secretKey, (err) => {
      if (err) return res.sendStatus(403);
      next();
    });
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        message: "El token es inválido o ha expirado",
      });
    }

    next(error);
  }
}
