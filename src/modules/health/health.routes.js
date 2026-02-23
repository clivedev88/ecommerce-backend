const { Router } = require("express");
const HealthController = require("./health.controller");

const router = Router();

router.get("/", HealthController.check);

module.exports = router;