const { Router } = require("express");
const CouponController = require("./coupon.controller");
const { rotaProtegida } = require("../../shared/middlewares/token.middleware");
const { verifyAccess } = require("../../shared/middlewares/access.middleware");

const router = Router();

router.use(rotaProtegida);

// router.post("/", verifyAccess, CouponController.create);
router.get("/", CouponController.findAll);
router.get("/:id", CouponController.findById);
// router.put("/:id", verifyAccess, CouponController.update);
// router.delete("/:id", verifyAccess, CouponController.delete);
router.post("/:id/validar", CouponController.validar);

module.exports = router;