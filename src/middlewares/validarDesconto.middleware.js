/**
 * Middleware para validar o valor_desconto no body da requisição
 * Campo opcional - se enviado, deve ser número entre 0 e 100
 */
function validarDesconto(req, res, next) {
  try {
    const { valor_desconto } = req.body;

    // Campo opcional - se não enviado, permite continuar
    if (valor_desconto === undefined || valor_desconto === null) {
      return next();
    }

    if (typeof valor_desconto !== "number") {
      return res.status(400).json({
        error: "O campo valor_desconto deve ser um número"
      });
    }

    if (valor_desconto < 0) {
      return res.status(400).json({
        error: "O campo valor_desconto não pode ser negativo"
      });
    }

    if (valor_desconto > 100) {
      return res.status(400).json({
        error: "O campo valor_desconto não pode ser maior que 100"
      });
    }

    next();
  } catch (error) {
    next(error);
  }
}

module.exports = validarDesconto;
