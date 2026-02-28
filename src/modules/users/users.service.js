const prisma = require("../../database/prisma");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const transporter = require("../../shared/utils/mail.util");

class UsersService {
  async create(data) {
    const { cpf, email, senha } = data;

    if (cpf) {
      const cpfExists = await prisma.usuarios.findUnique({ where: { cpf } });
      if (cpfExists) throw new Error("CPF já cadastrado");
    }

    if (email) {
      const emailExists = await prisma.usuarios.findUnique({
        where: { email },
      });
      if (emailExists) throw new Error("Email já cadastrado");
    }

    const hashedPassword = await bcrypt.hash(senha, 10);

    const user = await prisma.usuarios.create({
      data: { ...data, senha: hashedPassword },
      omit: { senha: true },
    });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    await transporter.sendMail({
      from: `"3D Tech" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Confirme seu cadastro",
      html: `
      <h2>Bem-vindo!</h2>
      <p>Clique no link para confirmar seu email:</p>
      <a href=${process.env.APP_URL}/api/users/confirm?token=${token}>Confirmar Email</a>
      <p>O link é válido por 24 horas.</p>`,
    });

    return user;
  }

  async confirmEmail(token) {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await this.findById(decoded.id);

    if (!user) throw new Error("Usuário não encontrado");

    if (user.emailVerificado) throw new Error("Email já confirmado");

    return await this.update(user.id, { emailVerificado: true });
  }

  async findAll() {
    return await prisma.usuarios.findMany({
      orderBy: { id: "desc" },
      omit: { senha: true },
    });
  }

  async findById(id) {
    return await prisma.usuarios.findUnique({
      where: { id },
      omit: { senha: true },
    });
  }

  async update(id, data) {
    const userExists = await this.findById(id);
    if (!userExists) {
      throw new Error("Usuário não encontrado");
    }

    if (data.email) {
      const emailExists = await prisma.usuarios.findUnique({
        where: { email: data.email },
      });
      if (emailExists && emailExists.id !== id)
        throw new Error("Email já cadastrado");
    }

    if (data.cpf) {
      const cpfExists = await prisma.usuarios.findUnique({
        where: { cpf: data.cpf },
      });
      if (cpfExists && cpfExists.id !== id)
        throw new Error("CPF já cadastrado");
    }

    if (data.senha) {
      data.senha = await bcrypt.hash(data.senha, 10);
    }

    return await prisma.usuarios.update({
      where: { id },
      data,
      omit: { senha: true },
    });
  }

  async delete(id) {
    const userExists = await this.findById(id);
    if (!userExists) {
      throw new Error("Usuário não encontrado");
    }

    return await prisma.usuarios.delete({ where: { id } });
  }
}

module.exports = UsersService;
