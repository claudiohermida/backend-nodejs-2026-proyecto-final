import jwt from "jsonwebtoken";
import "dotenv/config";

export function authentication(req, res, next) {
  const authorization = req.headers["authorization"];
  const token = authorization?.match(/^Bearer\s+(\S+)$/i)?.[1];
  // const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    return res.status(401).json({
      message: "Un JWT token de autorización válido es necesario",
    });
  }

  const secretKey = process.env.JWT_SECRET_KEY;
  if (!secretKey) {
    return res.status(500).json({
      message: "La autenticación no está configurada en el servidor",
    });
  }
  // try {
  // req.user = jwt.verify(authorization.slice("Bearer ".length), secretKey);
  // next();
  jwt.verify(token, secretKey, (err) => {
    if (err) {
      return res.status(403).json({
        message: "Usuario no autorizado",
      });
    }
    next();
  });
  // } catch (error) {
  //   if (error instanceof jwt.JsonWebTokenError) {
  //     return res.status(401).json({
  //       message: "El token es inválido o ha expirado",
  //     });
  //   }

  //   next(error);
  // }
}
