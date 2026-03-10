const prisma = require("../../database/prisma");
const AppError = require("../../shared/errors/AppError");

async function validarUsuario(req, res, next) {
  try {
    const usuarioId = req.usuarioId;

    if (!usuarioId) {
      throw new AppError("Usuário não autenticado", 401);
    }

    const usuario = await prisma.usuarios.findUnique({
      where: { id: usuarioId },
    });

    if (!usuario) {
      throw new AppError("Usuário não encontrado", 404);
    }

    if (!usuario.emailVerificado) {
      throw new AppError("Confirme seu email antes de acessar", 403);
    }

    req.usuario = usuario;

    next();
  } catch (error) {
    next(error);
  }
}

function apenasAdmin(req, res, next) {
  const usuario = req.usuario;

  if (usuario.nivel !== "admin") {
    return next(new AppError("Acesso permitido apenas para administradores", 403));
  }

  next();
}

module.exports = {
  validarUsuario,
  apenasAdmin,
};