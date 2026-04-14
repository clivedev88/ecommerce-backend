const CouponService = require("./coupon.service");

class CouponController {
  constructor() {
    this.service = new CouponService();
  }

  async create(req, res, next) {
    try {
      const coupon = await this.service.create(req.body);

      return res.status(201).json({
        tipo: "success",
        mensagem: "Cupom criado com sucesso",
        dados: coupon
      });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req, res, next) {
    try {
      const coupons = await this.service.findAll();

      return res.status(200).json({
        tipo: "success",
        mensagem: "Cupons encontrados",
        dados: coupons
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const coupon = await this.service.findById(id);

      return res.status(200).json({
        tipo: "success",
        mensagem: "Cupom encontrado",
        dados: coupon
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const coupon = await this.service.update(id, req.body);

      return res.status(200).json({
        tipo: "success",
        mensagem: "Cupom atualizado",
        dados: coupon
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      await this.service.delete(id);

      return res.status(200).json({
        tipo: "success",
        mensagem: "Cupom deletado"
      });
    } catch (error) {
      next(error);
    }
  }

  async validar(req, res, next) {
    try {
      const { id } = req.params;
      const coupon = await this.service.validarCupom(id);

      return res.status(200).json({
        tipo: "success",
        mensagem: "Cupom válido",
        dados: coupon
      });
    } catch (error) {
      next(error);
    }
  }

  async disponiveis(req, res, next) {
    try {
      const coupons = await this.service.buscarCuponsDisponiveis();

      return res.status(200).json({
        tipo: "success",
        mensagem: "Cupons disponíveis",
        dados: coupons
      });
    } catch (error) {
      next(error);
    }
  }

  async aplicarAProduto(req, res, next) {
    try {
      const { couponId, productId } = req.body;

      const result = await this.service.aplicarAProduto(couponId, productId);

      return res.status(200).json({
        tipo: "success",
        mensagem: "Cupom aplicado com sucesso",
        dados: result
      });
    } catch (error) {
      next(error);
    }
  }

  async usar(req, res, next) {
    try {
      const { id } = req.params;
      const coupon = await this.service.usarCupom(id);

      return res.status(200).json({
        tipo: "success",
        mensagem: "Cupom utilizado com sucesso",
        dados: coupon
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = CouponController;