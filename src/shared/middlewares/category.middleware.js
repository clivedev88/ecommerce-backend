const AppError = require("../errors/AppError");

function validarCategoria(req, res, next) {
  try {
    const { nome } = req.body;

    if (!nome || typeof nome !== "string") {
      throw new AppError("Nome da categoria é obrigatório", 400);
    }

    if (nome.length < 3) {
      throw new AppError("Nome deve ter pelo menos 3 caracteres", 400);
    }

    next();
  } catch (error) {
    next(error);
  }
}

module.exports = { validarCategoria };