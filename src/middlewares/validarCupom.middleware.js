/**
 * Middleware para validar o cupom no body da requisição
 * Campo opcional - se enviado, deve ser string entre 3 e 20 caracteres
 */
function validarCupom(req, res, next) {
  try {
    const { cupom } = req.body;

    // Campo opcional - se não enviado, permite continuar
    if (cupom === undefined || cupom === null) {
      return next();
    }

    if (typeof cupom !== "string") {
      return res.status(400).json({
        error: "O campo cupom deve ser uma string"
      });
    }

    if (cupom.length < 3 || cupom.length > 20) {
      return res.status(400).json({
        error: "O campo cupom deve ter entre 3 e 20 caracteres"
      });
    }

    next();
  } catch (error) {
    next(error);
  }
}

module.exports = validarCupom;
