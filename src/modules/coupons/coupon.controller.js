const CouponService = require("./coupon.service");

class CouponController {
  static async create(req, res) {
    try {
      const { nome, quantidade, validade, valor_desc } = req.body;
      
      if (!nome || !quantidade || !validade || !valor_desc) {
        return res.status(400).json({ erro: "Todos os campos são obrigatórios" });
      }

      const resultado = await CouponService.create(req.body);
      
      if (!resultado.sucesso) {
        return res.status(400).json({ erro: resultado.erro });
      }
      
      res.status(201).json(resultado.dados);
    } catch (error) {
      res.status(400).json({ erro: error.message });
    }
  }

  static async findAll(req, res) {
    try {
      const resultado = await CouponService.findAll();
      
      if (!resultado.sucesso) {
        return res.status(400).json({ erro: resultado.erro });
      }
      
      res.json(resultado.dados);
    } catch (error) {
      res.status(400).json({ erro: error.message });
    }
  }

  static async findById(req, res) {
    try {
      const { id } = req.params;
      const resultado = await CouponService.findById(id);
      
      if (!resultado.sucesso) {
        return res.status(404).json({ erro: resultado.erro });
      }
      
      res.json(resultado.dados);
    } catch (error) {
      res.status(400).json({ erro: error.message });
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;
      const resultado = await CouponService.update(id, req.body);
      
      if (!resultado.sucesso) {
        return res.status(404).json({ erro: resultado.erro });
      }
      
      res.json(resultado.dados);
    } catch (error) {
      res.status(400).json({ erro: error.message });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
      const resultado = await CouponService.delete(id);
      
      if (!resultado.sucesso) {
        return res.status(404).json({ erro: resultado.erro });
      }
      
      res.json({ mensagem: resultado.mensagem });
    } catch (error) {
      res.status(400).json({ erro: error.message });
    }
  }

  static async validar(req, res) {
    try {
      const { id } = req.params;
      const resultado = await CouponService.validarCupom(id);
      
      if (!resultado.valido) {
        return res.status(400).json({ 
          valido: false, 
          erro: resultado.erro 
        });
      }
      
      res.json({ 
        valido: true, 
        cupom: resultado.dados 
      });
    } catch (error) {
      res.status(400).json({ 
        valido: false, 
        erro: error.message 
      });
    }
  }
}

module.exports = CouponController;