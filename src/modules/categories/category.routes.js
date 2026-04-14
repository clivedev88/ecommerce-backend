const { Router } = require("express");
const CategoryController = require("./category.controller");
const { rotaProtegida } = require("../../shared/middlewares/token.middleware");
const { validarUsuario, verificarEmailConfirmado } = require("../../shared/middlewares/user.middleware");
const { apenasAdmin } = require("../../shared/middlewares/access.middleware");

const router = Router();
const categoryController = new CategoryController();

router.get("/", (req, res, next) => categoryController.getAll(req, res, next));
router.get("/:id", (req, res, next) => categoryController.getById(req, res, next));

router.use(rotaProtegida);
router.use(validarUsuario);
router.use(verificarEmailConfirmado);

router.post("/", 
  apenasAdmin, 
  (req, res, next) => categoryController.create(req, res, next)
);

router.put("/:id", 
  apenasAdmin, 
  (req, res, next) => categoryController.update(req, res, next)
);

router.delete("/:id", 
  apenasAdmin, 
  (req, res, next) => categoryController.delete(req, res, next)
);

router.post("/associate", 
  apenasAdmin, 
  (req, res, next) => categoryController.associateProduct(req, res, next)
);

module.exports = router;