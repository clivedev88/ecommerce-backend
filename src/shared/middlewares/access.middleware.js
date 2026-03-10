const jwt = require("jsonwebtoken");

const AppError = require("../errors/AppError");

function verifyAccess(req, _res, next) {
  try {
    let token = req.headers.authorization;

    if (!token) throw new AppError("Token não fornecido", 401);
    if (!token.startsWith("Bearer ")) throw new AppError("Token inválido", 401);

    token = token.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const role = decoded.nivel;

    if (role !== "admin") {
      throw new AppError("Acesso negado", 403);
    } else {
      req.usuarioNivel = role;
      return next();
    }
  } catch (error) {
    next(error);
  }
}

module.exports = { verifyAccess };
