const prisma = require("../../database/prisma");

class UserRepository {
  async create(data) {
    return await prisma.usuarios.create({
      data,
      omit: { senha: true }
    });
  }

  async findByEmail(email) {
    return await prisma.usuarios.findUnique({
      where: { email }
    });
  }

  async findById(id, includePassword = false) {
    const query = { where: { id: Number(id) } };
    
    if (!includePassword) {
      query.omit = { senha: true };
    }
    
    return await prisma.usuarios.findUnique(query);
  }

  async findAll() {
    return await prisma.usuarios.findMany({
      orderBy: { id: "desc" },
      omit: { senha: true }
    });
  }

  async update(id, data) {
    return await prisma.usuarios.update({
      where: { id: Number(id) },
      data,
      omit: { senha: true }
    });
  }

  async delete(id) {
    return await prisma.usuarios.delete({ 
      where: { id: Number(id) } 
    });
  }

  async updateEmailVerification(id, verified = true) {
    return await prisma.usuarios.update({
      where: { id: Number(id) },
      data: { emailVerificado: verified },
      omit: { senha: true }
    });
  }
}

module.exports = UserRepository;