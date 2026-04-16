const { Router } = require("express");
const ReviewController = require("./review.controller");
const { rotaProtegida } = require("../../shared/middlewares/token.middleware");
const { validarUsuario, verificarEmailConfirmado } = require("../../shared/middlewares/user.middleware");

const router = Router();
const reviewController = new ReviewController();

router.get("/", (req, res, next) => reviewController.getAll(req, res, next));
router.get("/:id", (req, res, next) => reviewController.getById(req, res, next));
router.get("/produto/:productId", (req, res, next) => reviewController.getByProduct(req, res, next));

router.use(rotaProtegida);
router.use(validarUsuario);
router.use(verificarEmailConfirmado);

router.post("/", (req, res, next) => reviewController.create(req, res, next));
router.get("/minhas", (req, res, next) => reviewController.getMyReviews(req, res, next));
router.patch("/:id", (req, res, next) => reviewController.update(req, res, next));
router.delete("/:id", (req, res, next) => reviewController.delete(req, res, next));

module.exports = router;