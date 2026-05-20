const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../../../database/prisma");

jest.mock("bcryptjs");
jest.mock("jsonwebtoken");
jest.mock("../../../database/prisma", () => ({
  usuarios: {
    findUnique: jest.fn()
  }
}));

const { login } = require("../auth.service");

describe("Auth Service - login", () => {

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = "test-secret";
    process.env.JWT_EXPIRES_IN = "1h";
  });

  test("deve realizar login com sucesso", async () => {

    const fakeUser = {
      id: 1,
      email: "teste@email.com",
      senha: "hash-senha",
      nivel: "user",
      emailVerificado: true
    };

    prisma.usuarios.findUnique.mockResolvedValue(fakeUser);
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue("fake-token");

    const result = await login("teste@email.com", "123456");

    expect(prisma.usuarios.findUnique).toHaveBeenCalledWith({
      where: { email: "teste@email.com" }
    });

    expect(bcrypt.compare).toHaveBeenCalledWith("123456", "hash-senha");

    expect(jwt.sign).toHaveBeenCalled();

    expect(result).toEqual({
      message: "Login efetuado com sucesso",
      usuario: {
        id: 1,
        email: "teste@email.com",
        nivel: "user",
        emailVerificado: true
      },
      token: "fake-token",
      emailVerificado: true
    });
  });

  test("deve lançar erro se email não existir", async () => {

    prisma.usuarios.findUnique.mockResolvedValue(null);

    await expect(login("inexistente@email.com", "123"))
      .rejects
      .toThrow("Email não encontrado");
  });

  test("deve lançar erro se senha não for fornecida", async () => {

    prisma.usuarios.findUnique.mockResolvedValue({
      id: 1,
      email: "teste@email.com",
      senha: "hash"
    });

    await expect(login("teste@email.com", null))
      .rejects
      .toThrow("Dados de autenticação incompletos");
  });

  test("deve lançar erro se usuário não tiver senha", async () => {

    prisma.usuarios.findUnique.mockResolvedValue({
      id: 1,
      email: "teste@email.com",
      senha: null
    });

    await expect(login("teste@email.com", "123"))
      .rejects
      .toThrow("Dados de autenticação incompletos");
  });

  test("deve lançar erro se senha estiver incorreta", async () => {

    prisma.usuarios.findUnique.mockResolvedValue({
      id: 1,
      email: "teste@email.com",
      senha: "hash"
    });

    bcrypt.compare.mockResolvedValue(false);

    await expect(login("teste@email.com", "errada"))
      .rejects
      .toThrow("Senha incorreta");
  });

});