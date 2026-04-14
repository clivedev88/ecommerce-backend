/**
 * Middleware para validar os itens do pedido no body da requisição
 * Valida estrutura do array de itens e seus campos obrigatórios
 */
function validarPedido(req, res, next) {
  try {
    const { itens } = req.body;

    // Valida se itens foi enviado
    if (itens === undefined || itens === null) {
      return res.status(400).json({
        error: "O campo itens é obrigatório"
      });
    }

    // Valida se itens é um array
    if (!Array.isArray(itens)) {
      return res.status(400).json({
        error: "O campo itens deve ser um array"
      });
    }

    // Valida se o array contém pelo menos 1 item
    if (itens.length === 0) {
      return res.status(400).json({
        error: "O pedido deve conter pelo menos 1 item"
      });
    }

    // Valida cada item do array
    for (let i = 0; i < itens.length; i++) {
      const item = itens[i];

      // Valida produto_id
      if (item.produto_id === undefined || item.produto_id === null) {
        return res.status(400).json({
          error: `Item ${i + 1}: o campo produto_id é obrigatório`
        });
      }

      if (typeof item.produto_id !== "number") {
        return res.status(400).json({
          error: `Item ${i + 1}: o campo produto_id deve ser um número`
        });
      }

      // Valida quantidade
      if (item.quantidade === undefined || item.quantidade === null) {
        return res.status(400).json({
          error: `Item ${i + 1}: o campo quantidade é obrigatório`
        });
      }

      if (typeof item.quantidade !== "number") {
        return res.status(400).json({
          error: `Item ${i + 1}: o campo quantidade deve ser um número`
        });
      }

      if (item.quantidade <= 0) {
        return res.status(400).json({
          error: `Item ${i + 1}: o campo quantidade deve ser maior que 0`
        });
      }
    }

    next();
  } catch (error) {
    next(error);
  }
}

module.exports = validarPedido;
