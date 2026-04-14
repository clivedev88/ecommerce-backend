const AuthService = require("./auth.service");

const authService = new AuthService();

class AuthController {
  async login(req, res, next) {
    try {
      const { email, senha } = req.body;

      const resultado = await authService.login(email, senha);

      return res.status(200).json({
        tipo: "success",
        mensagem: "Login efetuado com sucesso",
        dados: {
          usuario: resultado.usuario,
          token: resultado.token,
          emailVerificado: resultado.emailVerificado
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async verificarToken(req, res, next) {
    try {
      const token = req.headers.authorization?.split(' ')[1];

      if (!token) {
        return res.status(400).json({
          tipo: "error",
          mensagem: "Token não fornecido"
        });
      }

      const resultado = await authService.verificarToken(token);

      return res.status(200).json({
        tipo: "success",
        mensagem: "Token válido",
        dados: resultado
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();