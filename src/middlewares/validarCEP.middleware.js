/**
 * Middleware para validar o CEP no body da requisição
 * Campo obrigatório - deve conter exatamente 8 números
 */
function validarCEP(req, res, next) {
  try {
    const { cep } = req.body;

    if (cep === undefined || cep === null) {
      return res.status(400).json({
        error: "O campo cep é obrigatório"
      });
    }

    const cepString = String(cep);
    const cepRegex = /^\d{8}$/;

    if (!cepRegex.test(cepString)) {
      return res.status(400).json({
        error: "O campo cep deve conter exatamente 8 números"
      });
    }

    next();
  } catch (error) {
    next(error);
  }
}

module.exports = validarCEP;
