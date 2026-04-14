const jwtLib = require("jsonwebtoken");
const { jwt } = require("../../config/env");
const AppError = require("../errors/AppError");

function rotaProtegida(req, res, next) {
  try {
    console.log("rotaProtegida chamada para:", req.path);
    console.log("authorization header:", req.headers.authorization);
    let token = req.headers.authorization;

    if (!token) {
      return next(new AppError("Token é obrigatório", 401));
    }

    if (!token.startsWith("Bearer ")) {
      return next(new AppError("Formato do token inválido", 401));
    }

    token = token.split(" ")[1];

    if (!token) {
      return next(new AppError("Token é obrigatório", 401));
    }

    const decoded = jwtLib.verify(token, jwt.secret);
    console.log("decoded token:", decoded);

    req.usuarioId = decoded.id;
    req.usuarioToken = decoded;

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return next(new AppError("Token expirado", 401));
    }

    if (error.name === "JsonWebTokenError") {
      return next(new AppError("Token inválido", 401));
    }

    next(error);
  }
}

module.exports = { rotaProtegida };