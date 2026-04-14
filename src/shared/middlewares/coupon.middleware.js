const AppError = require("../../shared/errors/AppError");

function validarCupom(req, res, next) {
  try {
    const { nome, quantidade, validade, valor_desc } = req.body;

    if (!nome || typeof nome !== "string") {
      throw new AppError("Nome do cupom é obrigatório", 400);
    }
    if (nome.length < 3) {
      throw new AppError("Nome deve ter pelo menos 3 caracteres", 400);
    }

    if (!quantidade) {
      throw new AppError("Quantidade é obrigatória", 400);
    }
    const qtd = parseInt(quantidade);
    if (isNaN(qtd) || qtd <= 0) {
      throw new AppError("Quantidade deve ser um número positivo", 400);
    }

    if (!validade) {
      throw new AppError("Data de validade é obrigatória", 400);
    }
    const data = new Date(validade);
    if (isNaN(data.getTime())) {
      throw new AppError("Data de validade inválida", 400);
    }

    if (!valor_desc) {
      throw new AppError("Valor do desconto é obrigatório", 400);
    }
    const desconto = parseInt(valor_desc);
    if (isNaN(desconto) || desconto <= 0) {
      throw new AppError("Valor do desconto deve ser um número positivo", 400);
    }

    next();
  } catch (error) {
    next(error);
  }
}

function validarAplicacao(req, res, next) {
  try {
    const { couponId, productId } = req.body;

    if (!couponId) {
      throw new AppError("ID do cupom é obrigatório", 400);
    }
    if (!productId) {
      throw new AppError("ID do produto é obrigatório", 400);
    }

    next();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  validarCupom,
  validarAplicacao
};