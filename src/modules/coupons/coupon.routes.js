const { Router } = require("express");
const CouponController = require("./coupon.controller");
const { rotaProtegida } = require("../../shared/middlewares/token.middleware");
const { validarUsuario, verificarEmailConfirmado } = require("../../shared/middlewares/user.middleware");
const { apenasAdmin } = require("../../shared/middlewares/access.middleware");

const router = Router();
const couponController = new CouponController();

router.get("/", (req, res, next) => couponController.getAll(req, res, next));
router.get("/disponiveis", (req, res, next) => couponController.disponiveis(req, res, next));
router.get("/:id/validar", (req, res, next) => couponController.validar(req, res, next));
router.get("/:id", (req, res, next) => couponController.getById(req, res, next));

router.use(rotaProtegida);
router.use(validarUsuario);
router.use(verificarEmailConfirmado);

router.post("/aplicar", (req, res, next) => couponController.aplicarAProduto(req, res, next));
router.post("/:id/usar", (req, res, next) => couponController.usar(req, res, next));

router.post("/", apenasAdmin, (req, res, next) => couponController.create(req, res, next));
router.put("/:id", apenasAdmin, (req, res, next) => couponController.update(req, res, next));
router.delete("/:id", apenasAdmin, (req, res, next) => couponController.delete(req, res, next));

module.exports = router;