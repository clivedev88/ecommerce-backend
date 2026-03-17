const express = require("express");
const router = express.Router();
const authController = require("./auth.controller");
const { rotaProtegida } = require("../../shared/middlewares/token.middleware");

router.post("/login", (req, res, next) => authController.login(req, res, next));

router.get("/verificar", rotaProtegida, (req, res, next) => authController.verificarToken(req, res, next));

module.exports = router;