const { Router } = require("express");
const ProductController = require("./product.controller");
const { rotaProtegida } = require("../../shared/middlewares/token.middleware");
const { validarUsuario, verificarEmailConfirmado } = require("../../shared/middlewares/user.middleware");
const { apenasAdmin } = require("../../shared/middlewares/access.middleware");
const { validarProduto } = require("../../shared/middlewares/product.middleware");
const validateStock = require("../../shared/middlewares/stock.middleware");

const router = Router();
const productController = new ProductController();

router.get("/", (req, res, next) => productController.getAll(req, res, next));
router.get("/:id", (req, res, next) => productController.getById(req, res, next));

router.use(rotaProtegida);
router.use(validarUsuario);
router.use(verificarEmailConfirmado);

router.post("/", apenasAdmin, validarProduto, (req, res, next) => productController.create(req, res, next));
router.put("/:id", apenasAdmin, validarProduto, (req, res, next) => productController.update(req, res, next));
router.delete("/:id", apenasAdmin, (req, res, next) => productController.delete(req, res, next));

router.put("/:id/tamanhos", 
  apenasAdmin, 
  (req, res, next) => productController.atualizarTamanhos(req, res, next)
);

router.put("/:id/cores", 
  apenasAdmin, 
  (req, res, next) => productController.atualizarCores(req, res, next)
);

router.post("/validate-stock", validateStock, (req, res, next) => productController.validateStock(req, res, next));

module.exports = router;