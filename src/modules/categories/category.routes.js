const { Router } = require("express");
const CategoryController = require("./category.controller");
const { rotaProtegida } = require("../../shared/middlewares/token.middleware");
const { verifyAccess } = require("../../shared/middlewares/access.middleware");

const router = Router();

router.get("/", CategoryController.findAll);
router.get("/:id", CategoryController.findById);

// router.post("/", rotaProtegida, verifyAccess, CategoryController.create);
// router.put("/:id", rotaProtegida, verifyAccess, CategoryController.update);
// router.delete("/:id", rotaProtegida, verifyAccess, CategoryController.delete);

module.exports = router;
