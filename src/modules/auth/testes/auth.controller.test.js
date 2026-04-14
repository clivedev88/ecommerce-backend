const request = require("supertest");
const express = require("express");

jest.mock("../auth.service");
const { login } = require("../auth.service");

const authController = require("../auth.controller");

const app = express();
app.use(express.json());
app.post("/login", authController.login);

describe("POST /login (app mockado)", () => {

  test("deve fazer login com sucesso", async () => {

    login.mockResolvedValue({
      token: "fake-token",
      user: { id: 1, email: "teste@email.com" }
    });

    const response = await request(app)
      .post("/login")
      .send({
        email: "teste@email.com",
        senha: "123456"
      });

    expect(response.status).toBe(200);
    expect(response.body.token).toBe("fake-token");
  });

  test("deve retornar erro se não enviar email", async () => {

    const response = await request(app)
      .post("/login")
      .send({
        senha: "123456"
      });

    expect(response.status).toBe(400);
  });

  test("deve retornar erro no login", async () => {

    login.mockRejectedValue(new Error("Credenciais inválidas"));

    const response = await request(app)
      .post("/login")
      .send({
        email: "teste@email.com",
        senha: "errada"
      });

    expect(response.status).toBe(401);
  });

});
