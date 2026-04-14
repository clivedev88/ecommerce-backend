/**
 * Middleware para validar a previsao_entrega no body da requisição
 * Campo opcional - se enviado, deve ser data válida e não pode ser passada
 */
function validarPrevisaoEntrega(req, res, next) {
  try {
    const { previsao_entrega } = req.body;

    // Campo opcional - se não enviado, permite continuar
    if (previsao_entrega === undefined || previsao_entrega === null) {
      return next();
    }

    const dataPrevisao = new Date(previsao_entrega);

    // Verifica se é uma data válida
    if (isNaN(dataPrevisao.getTime())) {
      return res.status(400).json({
        error: "O campo previsao_entrega deve ser uma data válida"
      });
    }

    // Verifica se a data não é passada
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    if (dataPrevisao < hoje) {
      return res.status(400).json({
        error: "O campo previsao_entrega não pode ser uma data passada"
      });
    }

    next();
  } catch (error) {
    next(error);
  }
}

module.exports = validarPrevisaoEntrega;
