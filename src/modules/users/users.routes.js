const router = require("express").Router();

const { rotaProtegida } = require("../../shared/middlewares/token.middleware");
const { validarUsuario, verificarEmailConfirmado } = require("../../shared/middlewares/user.middleware");
const { apenasAdmin } = require("../../shared/middlewares/access.middleware");

const UsersController = require("./users.controller");

const usersController = new UsersController();

router.post("/", (req, res, next) => usersController.create(req, res, next));
router.get("/confirm", (req, res, next) =>
  usersController.confirmEmail(req, res, next)
);

router.use(rotaProtegida);
router.use(validarUsuario);

router.use(rotaProtegida, apenasAdmin, validarUsuario);

router.get("/", verificarEmailConfirmado, (req, res, next) =>
  usersController.getAll(req, res, next)
);
router.get("/:id", verificarEmailConfirmado, (req, res, next) =>
  usersController.getById(req, res, next)
);

router.patch("/:id", verificarEmailConfirmado, (req, res, next) =>
  usersController.update(req, res, next)
);

router.delete("/:id", verificarEmailConfirmado, apenasAdmin, (req, res, next) =>
  usersController.delete(req, res, next)
);

module.exports = router;
