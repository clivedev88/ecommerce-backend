const { Router } = require("express");
const CouponController = require("./coupon.controller");
const { rotaProtegida } = require("../../shared/middlewares/token.middleware");

const router = Router();

router.post("/", CouponController.create);

router.get("/", rotaProtegida, CouponController.getAll);

router.get("/:id", CouponController.getById);

module.exports = router;