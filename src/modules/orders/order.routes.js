const { Router } = require("express");
const validateStock = require("../../shared/middlewares/stock.middleware");

const router = Router();

router.post("/", validateStock, (req, res) => {
  return res.status(201).json({
    success: true,
    message: "Pedido criado com sucesso",
  });
});

module.exports = router;