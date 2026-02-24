const prisma = require("../../database/prisma");

class CouponService {
  static async createCoupon(nome, quantidade, validade, valor_desc) {
    try {
      const coupon = await prisma.cupons.create({
        data: {
          nome,
          quantidade,
          validade,
          valor_desc,
        },
      });
      return coupon;
    } catch (error) {
      throw new Error("Erro ao criar cupom");
    }
  }

  static async getAllCoupons() {
    try {
      const coupons = await prisma.cupons.findMany();
      return coupons;
    } catch (error) {
      // throw new Error("Erro ao listar cupons");
      throw new Error(error.message);
    }
  }

  static async getCouponById(id) {
    try {
      const coupon = await prisma.cupons.findUnique({
        where: {
          id: parseInt(id),
        },
      });
      return coupon;
    } catch (error) {
      throw new Error("Erro ao buscar cupom");
    }
  }
}

module.exports = CouponService;