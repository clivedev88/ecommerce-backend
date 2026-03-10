const express = require("express");
const { associateProductToCategory } = require("./categories.controller");
const router = express.Router();

router.post("/associate-product", associateProductToCategory);

module.exports = router;