const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const AppError = require("../../shared/errors/AppError");
const AuthRepository = require("./auth.repository");

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES = process.env.JWT_EXPIRES_IN || '1h';

class AuthService {
  constructor() {
    this.repository = new AuthRepository();
  }

  async login(email, senha) {
    if (!email || !senha) {
      throw new AppError("Email e senha são obrigatórios", 400);
    }

    const user = await this.repository.findUserByEmail(email);
    
    if (!user) {
      throw new AppError("Email ou senha inválidos", 401);
    }

    const passwordIsValid = await bcrypt.compare(senha, user.senha);
    
    if (!passwordIsValid) {
      throw new AppError("Email ou senha inválidos", 401);
    }

    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        nivel: user.nivel,
        nome: user.nome 
      }, 
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES }
    );

    try {
      await this.repository.updateLastLogin(user.id);
    } catch (error) {
      console.warn(`⚠️ Não foi possível atualizar último login do usuário ${user.id}`);
    }

    const { senha: _, ...usuarioSemSenha } = user;

    return {
      usuario: usuarioSemSenha,
      token,
      emailVerificado: user.emailVerificado || false
    };
  }

  async verificarToken(token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      
      const user = await this.repository.findUserById(decoded.id);
      
      if (!user) {
        throw new AppError("Usuário não encontrado", 401);
      }

      return {
        valido: true,
        usuario: user,
        token: decoded
      };
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new AppError("Token expirado", 401);
      }
      if (error.name === 'JsonWebTokenError') {
        throw new AppError("Token inválido", 401);
      }
      throw error;
    }
  }
}

module.exports = AuthService;