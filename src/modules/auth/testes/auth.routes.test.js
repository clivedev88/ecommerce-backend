const request = require("supertest");
const express = require("express");

jest.mock("../auth.controller", () => ({
  login: jest.fn((req, res) => {
    return res.status(200).json({ message: "mock login" });
  })
}));

const authRoutes = require("../auth.routes");
const authController = require("../auth.controller");

describe("Auth Routes", () => {

  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use("/auth", authRoutes);
  });

  test("POST /auth/login deve chamar o controller login", async () => {

    const response = await request(app)
      .post("/auth/login")
      .send({
        email: "teste@email.com",
        senha: "123456"
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("mock login");

    expect(authController.login).toHaveBeenCalled();
  });

});