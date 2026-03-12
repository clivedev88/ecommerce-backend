const express = require("express");
const { validateProduct } = require("./validateProduct.controller");
const { rotaProtegida } = require("../../shared/middlewares/token.middleware");

const router = express.Router();


router.post("/validate", rotaProtegida, validateProduct, (req, res) => {
 
  return res.status(200).json({
    mensagem: "Produto válido",
    produto: req.produtoValido
  });
});

module.exports = router;