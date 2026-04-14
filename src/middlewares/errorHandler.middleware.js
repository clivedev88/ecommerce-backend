/**
 * Middleware global para tratamento de erros
 * Captura erros não tratados e retorna resposta padronizada
 */
function errorHandler(err, req, res, next) {
  try {
    // Se headers já foram enviados, delega ao handler padrão do Express
    if (res.headersSent) {
      return next(err);
    }

    // Log do erro para debugging (em produção, usar logger apropriado)
    console.error("[ErrorHandler]:", err.message);

    // Erros de parse JSON
    if (err.type === "entity.parse.failed") {
      return res.status(400).json({
        error: "JSON inválido na requisição"
      });
    }

    // Erros de validação ou negócio com status definido
    if (err.status) {
      return res.status(err.status).json({
        error: err.message || "Erro na requisição"
      });
    }

    // Erro interno do servidor (fallback)
    return res.status(500).json({
      error: "Erro interno do servidor"
    });
  } catch (error) {
    // Fallback para erros no próprio handler
    return res.status(500).json({
      error: "Erro interno do servidor"
    });
  }
}

module.exports = errorHandler;
