const prisma = require("../../database/prisma");

class AuthRepository {
  async findUserByEmail(email) {
    return await prisma.usuarios.findUnique({
      where: { email }
    });
  }

  async findUserById(id) {
    return await prisma.usuarios.findUnique({
      where: { id: Number(id) },
      omit: { senha: true }
    });
  }

  async updateLastLogin(id) {
    return await prisma.usuarios.update({
      where: { id: Number(id) },
      data: { ultimoLogin: new Date() }
    });
  }
}

module.exports = AuthRepository;