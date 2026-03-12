const express = require("express");
const { applyCouponToProduct } = require("./../coupons/associacoupon.controller");
const { rotaProtegida } = require("../../shared/middlewares/token.middleware");

const router = express.Router();

// Rota para aplicar cupom a produto
router.post("/apply-product", rotaProtegida, applyCouponToProduct);

module.exports = router;