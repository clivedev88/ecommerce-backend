// src/modules/orders/order.routes.js

const { Router } = require("express");
const orderController = require("./order.controller");

const router = Router();

router.post("/", orderController.create);
router.get("/", orderController.findAll);
router.get("/:id", orderController.findById);

module.exports = router;