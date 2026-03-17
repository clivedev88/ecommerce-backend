// const AppError = require("../../shared/errors/AppError");
const UsersService = require("./users.service");

class UsersController {
  constructor() {
    this.service = new UsersService();
  }

  async create(req, res, next) {
    try {
      const user = await this.service.create(req.body);
      const emailEnviado = req.emailEnviado;
      
      if(!emailEnviado) {
        return res.status(201).json({
          tipo:"warning",
          message: "Usuário criado, mas email de confirmação não enviado",
          data: user,
        });
      }

      // if (user) {
      //   return res.status(201).json({
      //   data: user,
      //   tipo:"success",
      //   message: "Usuário criado com sucesso",
      // });
      // }

      return res.status(200).json({
        tipo:"success",
        message: "Usuário criado com sucesso. Verifique seu email para confirmar o cadastro.",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  async confirmEmail(req, res, next) {
    try  {
      const { token } = req.query;
      if (!token) {
        return res.status(400).json({
          tipo: "error",
          message: "Token de confirmação é obrigatório",
        });
      }

      const result = await this.service.confirmEmail(token);

      // if (!result) {
      //   return res.status(400).json({
      //     tipo: "error",
      //     message: "Token de confirmação inválido ou expirado",
      //   });
      // }

      return res.status(200).json({
        tipo: "success",
        message: "E-mail confirmado com sucesso",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAll(_req, res, next) {
    try {
      const users = await this.service.findAll();

      if (!users || users.length === 0) {
        return res.status(201).json({
          tipo: "warning",
          message: "Nenhum usuário encontrado",
          data: []
        });
      }

      return res.status(200).json({
        tipo: "success",
        message: "Usuários encontrados com sucesso",
        data: users
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const user = await this.service.findById(Number(id));
      
      return res.status(200).json({
        tipo: "success",
        message: "Usuário encontrado com sucesso",
        data: user
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;

      const updatedUser = await this.service.update(Number(id), req.body);

      if (!updatedUser) {
        return res.status(201).json({
          tipo: "warning",
          message: "Nenhuma alteração foi realizada",
          // data: updatedUser
        });
      }

      return res.status(200).json({
        tipo: "success",
        message: "Usuário atualizado com sucesso",
        // data: updatedUser,
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      await this.service.delete(Number(id));

      return res.status(200).json({
        tipo: "success",
        message: "Usuário deletado com sucesso"
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UsersController;
