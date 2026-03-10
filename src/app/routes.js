const { Router } = require("express");

const healthRoutes = require("../modules/health/health.routes");
const orderRoutes = require("../modules/orders/order.routes");
const couponRoutes = require("../modules/coupons/coupon.routes");
const productRoutes = require("../modules/products/product.routes");
const userRoutes = require("../modules/users/users.routes");
const categoryRoutes = require("../modules/categories/category.routes");
const reviewRoutes = require("../modules/reviews/review.routes");
const applyCouponRoutes = require("../modules/coupons/associacoupon.routes");
const validateProductRoutes = require("../modules/products/validateProduct.routes");

const authRoutes = require("../modules/auth/auth.routes");
const { rotaProtegida } = require("../shared/middlewares/token.middleware");

const router = Router();

router.use("/health", healthRoutes);
router.use("/orders", rotaProtegida, orderRoutes);
router.use("/coupons", couponRoutes);
router.use("/products", productRoutes);
router.use("/users", userRoutes);
router.use("/categories", categoryRoutes);
router.use("/reviews", reviewRoutes);
router.use("/auth", authRoutes);
router.use("/categories", categoryRoutes);
router.use("/coupons", applyCouponRoutes);
router.use("/products", validateProductRoutes);

module.exports = router;
