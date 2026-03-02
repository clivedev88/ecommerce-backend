const CouponService = require("./coupon.service");

class CouponController {
  static async create(req, res) {
    try {
      const { nome, quantidade, validade, valor_desc } = req.body;
      
      if (!nome || !quantidade || !validade || !valor_desc) {
        return res.status(400).json({ erro: "Todos os campos são obrigatórios" });
      }

      const coupon = await CouponService.create(req.body);
      res.status(201).json(coupon);
    } catch (error) {
      res.status(400).json({ erro: error.message });
    }
  }

  static async findAll(req, res) {
    try {
      const coupons = await CouponService.findAll();
      res.json(coupons);
    } catch (error) {
      res.status(400).json({ erro: error.message });
    }
  }

  static async findById(req, res) {
    try {
      const { id } = req.params;
      const coupon = await CouponService.findById(id);
      if (!coupon) {
        return res.status(404).json({ erro: "Cupom não encontrado" });
      }
      res.json(coupon);
    } catch (error) {
      res.status(400).json({ erro: error.message });
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;
      const coupon = await CouponService.update(id, req.body);
      res.json(coupon);
    } catch (error) {
      res.status(400).json({ erro: error.message });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
      await CouponService.delete(id);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ erro: error.message });
    }
  }

  static async validar(req, res) {
    try {
      const { id } = req.params;
      const cupom = await CouponService.validarCupom(id);
      res.json({ valido: true, cupom });
    } catch (error) {
      res.status(400).json({ valido: false, erro: error.message });
    }
  }
}

module.exports = CouponController;