const { Prisma } = require("@prisma/client");
const jwt = require("jsonwebtoken");
const AppError = require("../errors/AppError");

function errorMiddleware(err, req, res, next) {
  if (res.headersSent) return next(err);

  let status = 500;
  let mensagem = "Erro interno do servidor";

  if (err instanceof AppError) {
    status = err.status;
    mensagem = err.message;
  }
  else if (err instanceof jwt.JsonWebTokenError) {
    status = 401;
    mensagem = "Token inválido";
  }
  else if (err instanceof jwt.TokenExpiredError) {
    status = 401;
    mensagem = "Token expirado";
  }
  else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2025") {
      status = 404;
      mensagem = "Registro não encontrado";
    } else if (err.code === "P2002") {
      status = 409;
      mensagem = "Já existe um registro com este dado";
    } else {
      status = 400;
      mensagem = "Erro de validação no banco";
    }
  }
  else if (err?.type === "entity.parse.failed") {
    status = 400;
    mensagem = "JSON inválido";
  }

  console.error(`❌ ${status} - ${mensagem}`, err.stack || err);

  return res.status(status).json({
    tipo: "error",
    mensagem,
    timestamp: new Date().toISOString(),
    ...(process.env.NODE_ENV === "development" && { detalhes: err.message })
  });
}

module.exports = errorMiddleware;