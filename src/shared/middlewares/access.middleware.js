const AppError = require("../errors/AppError");

function apenasAdmin(req, res, next) {
  try {
    if (!req.usuario) {
      throw new AppError("Usuário não autenticado", 401);
    }
    if (req.usuario.nivel !== "admin") {
      throw new AppError("Acesso permitido apenas para administradores", 403);
    }
    next();
  } catch (error) {
    next(error);
  }
}

function permitirNiveis(niveisPermitidos = []) {
  return (req, res, next) => {
    try {
      if (!req.usuario) {
        throw new AppError("Usuário não autenticado", 401);
      }
      if (!niveisPermitidos.includes(req.usuario.nivel)) {
        throw new AppError("Acesso negado para este nível de usuário", 403);
      }
      next();
    } catch (error) {
      next(error);
    }
  };
}

module.exports = { apenasAdmin, permitirNiveis };