const OrderService = require("./order.service");

class OrderController {
  static async create(req, res) {
    try {
      // Autorização: requer usuário autenticado
      if (!req.usuario || req.usuarioId == null) {
        return res.status(401).json({ erro: 'Não autorizado' });
      }
      const userId = req.usuarioId;
      const pedido = await OrderService.create(userId, req.body);
      // Se o service retornar null, considerar dados inválidos
      if (pedido == null) {
        return res.status(400).json({ erro: 'Dados inválidos' });
      }
      res.status(201).json(pedido);
    } catch (error) {
      // Se o error tiver mensagem, trata como erro de cliente (400).
      // Caso contrário, considera erro interno do servidor (500).
      if (error && error.message) {
        res.status(400).json({ erro: error.message });
      } else {
        res.status(500).json({ erro: 'Erro interno do servidor' });
      }
    }
  }

  static async findAll(req, res) {
    try {
      // Autorização: requer usuário autenticado
      if (!req.usuario || req.usuarioId == null) {
        return res.status(401).json({ erro: 'Não autorizado' });
      }
      const isAdmin = req.usuario?.nivel === 'admin';
      const pedidos = await OrderService.findAll(req.usuarioId, isAdmin);
      // Se o service retornar null/undefined para listagem, padronizamos como lista vazia
      if (pedidos == null) {
        return res.status(200).json([]);
      }
      res.status(200).json(pedidos);
    } catch (error) {
      // Mapear erros com mensagem como servidor interno (500) segundo convenção
      if (error && error.message) {
        res.status(500).json({ erro: error.message });
      } else {
        res.status(500).json({ erro: 'Erro interno do servidor' });
      }
    }
  }

  static async findById(req, res) {
    try {
      // Autorização: requer usuário autenticado
      if (!req.usuario || req.usuarioId == null) {
        return res.status(401).json({ erro: 'Não autorizado' });
      }
      const isAdmin = req.usuario?.nivel === 'admin';
      const pedido = await OrderService.findById(
        req.params.id, 
        req.usuarioId, 
        isAdmin
      );
      if (!pedido) {
        return res.status(404).json({ erro: 'Pedido não encontrado' });
      }
      res.status(200).json(pedido);
    } catch (error) {
      if (error && error.message === 'Acesso negado') {
        return res.status(403).json({ erro: 'Acesso negado' });
      }
      if (error && error.message) {
        return res.status(404).json({ erro: error.message });
      }
      return res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  }

  static async updateStatus(req, res) {
    try {
      // Autorização: requer usuário autenticado
      if (!req.usuario || req.usuarioId == null) {
        return res.status(401).json({ erro: 'Não autorizado' });
      }
      const isAdmin = req.usuario?.nivel === 'admin';
      const { status } = req.body;
      
      if (!status) {
        return res.status(400).json({ erro: "Status é obrigatório" });
      }

      const pedido = await OrderService.updateStatus(
        req.params.id, 
        status, 
        isAdmin
      );
      // Se o service retornar null, considerar como não encontrado
      if (pedido == null) {
        return res.status(404).json({ erro: 'Pedido não encontrado' });
      }
      // Retornar explicitamente 200 para atualizações bem-sucedidas
      res.status(200).json(pedido);
    } catch (error) {
      // Mapear erros conhecidos para códigos específicos
      if (error && error.message) {
        if (error.message === 'Pedido não encontrado') {
          return res.status(404).json({ erro: error.message });
        }
        if (error.message === 'Dados inválidos') {
          return res.status(400).json({ erro: error.message });
        }
        if (error.message === 'Acesso negado') {
          return res.status(403).json({ erro: error.message });
        }
        // Mensagem presente, mas não categorizada: tratar como 400
        return res.status(400).json({ erro: error.message });
      }
      // Erro sem mensagem ou objeto puro -> erro interno do servidor
      return res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  }

  static async delete(req, res) {
    try {
      // Autorização: requer usuário autenticado
      if (!req.usuario || req.usuarioId == null) {
        return res.status(401).json({ erro: 'Não autorizado' });
      }
      const isAdmin = req.usuario?.nivel === 'admin';
      const resultado = await OrderService.delete(req.params.id, isAdmin);
      // Se a deleção foi bem-sucedida e service retornou `true`, enviar 204 sem corpo
      if (resultado === true) {
        return res.status(204).send();
      }
      // Se o service retornar null, considera não encontrado
      if (resultado == null) {
        return res.status(404).json({ erro: 'Pedido não encontrado' });
      }
      // Caso o service retorne algum payload, devolve como 200
      return res.status(200).json(resultado);
    } catch (error) {
      if (error && error.message) {
        if (error.message === 'Pedido não encontrado') {
          return res.status(404).json({ erro: error.message });
        }
        if (error.message === 'Acesso negado') {
          return res.status(403).json({ erro: error.message });
        }
        return res.status(400).json({ erro: error.message });
      }
      return res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  }
}

module.exports = OrderController;