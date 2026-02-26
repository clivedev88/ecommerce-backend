const { Router } = require("express");
const ProductController = require("./product.controller");

const router = Router();

router.post("/", ProductController.create);

router.get("/", ProductController.getAll);

router.get("/:id", ProductController.getById);

module.exports = router;