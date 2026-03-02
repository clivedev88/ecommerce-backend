const { Router } = require("express");
const CategoryController = require("./category.controller");

const router = Router();

router.post("/", CategoryController.create);
router.get("/", CategoryController.findAll);
router.get("/:id", CategoryController.findById);
router.put("/:id", CategoryController.update);
router.delete("/:id", CategoryController.delete);

module.exports = router;
