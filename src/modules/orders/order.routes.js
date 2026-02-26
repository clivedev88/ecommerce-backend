// src/orders/order.routes.js
const { Router } = require("express");
const OrderController = require("./order.controller.js");
const validateStock = require("../../shared/middlewares/stock.middleware.js"); // seu middleware de estoque

const router = Router();

// Criar pedido com validação de estoque
router.post("/", validateStock, OrderController.create);

// Listar todos os pedidos
router.get("/", OrderController.findAll);

// Buscar pedido por ID
router.get("/:id", OrderController.findById);

// Atualizar pedido
router.put("/:id", OrderController.update);

// Deletar pedido
router.delete("/:id", OrderController.delete);

module.exports = router;