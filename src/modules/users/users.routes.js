const router = require("express").Router();
const { verifyAccess } = require("../../shared/middlewares/access.middleware");
const { rotaProtegida } = require("../../shared/middlewares/token.middleware");
const Controller = require("./users.controller");

const { rotaProtegida } = require("../../shared/middlewares/token.middleware");
const { validarUsuario, apenasAdmin } = require("../../shared/middlewares/user.middleware");

const usersController = new Controller();

router.post("/", (req, res, next) => usersController.create(req, res, next));

router.get("/confirm", (req, res, next) =>
  usersController.confirmEmail(req, res, next)
);

router.get("/", rotaProtegida, verifyAccess, validarUsuario, (req, res, next) =>
  usersController.getAll(req, res, next)
);
router.get("/:id", rotaProtegida, verifyAccess, validarUsuario, (req, res, next) =>
  usersController.getById(req, res, next)
);

router.patch("/:id", rotaProtegida, verifyAccess, validarUsuario, (req, res, next) =>
  usersController.update(req, res, next)
);

router.delete("/:id", rotaProtegida, verifyAccess, validarUsuario, apenasAdmin, (req, res, next) =>
  usersController.delete(req, res, next)
);

module.exports = router;
