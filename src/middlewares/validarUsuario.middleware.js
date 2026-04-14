/**
 * Middleware para validar o usuario_id no body da requisição
 * Apenas valida formato, não consulta banco de dados
 */
function validarUsuario(req, res, next) {
  try {
    const { usuario_id } = req.body;

    if (usuario_id === undefined || usuario_id === null) {
      return res.status(400).json({
        error: "O campo usuario_id é obrigatório"
      });
    }

    if (typeof usuario_id !== "number" || !Number.isInteger(usuario_id)) {
      return res.status(400).json({
        error: "O campo usuario_id deve ser um número inteiro"
      });
    }

    if (usuario_id <= 0) {
      return res.status(400).json({
        error: "O campo usuario_id deve ser um número inteiro positivo"
      });
    }

    next();
  } catch (error) {
    next(error);
  }
}

module.exports = validarUsuario;
