const { Router } = require("express");

const healthRoutes = require("../modules/health/health.routes");
const orderRoutes = require("../modules/orders/order.routes");
const couponRoutes = require("../modules/coupons/coupon.routes");
const productRoutes = require("../modules/products/product.routes");
const userRoutes = require("../modules/users/users.routes");

const router = Router();

// Base
router.use("/health", healthRoutes);
router.use("/orders", orderRoutes);
router.use("/coupons", couponRoutes);
router.use("/products", productRoutes);
router.use("/users", userRoutes);

module.exports = router;
