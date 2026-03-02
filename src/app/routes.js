const { Router } = require("express");

const healthRoutes = require("../modules/health/health.routes");
const orderRoutes = require("../modules/orders/order.routes");
const couponRoutes = require("../modules/coupons/coupon.routes");
const productRoutes = require("../modules/products/product.routes");
const userRoutes = require("../modules/users/users.routes");
const produtoRoutes = require("../modules/products/produto.routes");
const categoryRoutes = require("../modules/categories/category.routes");
const reviewRoutes = require("../modules/reviews/review.routes");

const router = Router();

router.use("/health", healthRoutes);
router.use("/orders", orderRoutes);
router.use("/coupons", couponRoutes);
router.use("/products", productRoutes);
router.use("/users", userRoutes);
router.use("/produtos", produtoRoutes);
router.use("/categories", categoryRoutes);
router.use("/reviews", reviewRoutes);


module.exports = router;
