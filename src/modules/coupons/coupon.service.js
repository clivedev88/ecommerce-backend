const prisma = require("../../database/prisma");

class CouponService {
  static async create(data) {
    const { nome, quantidade, validade, valor_desc } = data;
    return await prisma.cupons.create({
      data: {
        nome,
        quantidade: parseInt(quantidade),
        validade: new Date(validade),
        valor_desc: parseInt(valor_desc)
      }
    });
  }

  static async findAll() {
    return await prisma.cupons.findMany({
      orderBy: { validade: 'asc' }
    });
  }

  static async findById(id) {
    return await prisma.cupons.findUnique({
      where: { id: parseInt(id) },
      include: { pedidos: true }
    });
  }

  static async update(id, data) {
    const { nome, quantidade, validade, valor_desc } = data;
    return await prisma.cupons.update({
      where: { id: parseInt(id) },
      data: {
        nome,
        quantidade: parseInt(quantidade),
        validade: new Date(validade),
        valor_desc: parseInt(valor_desc)
      }
    });
  }

  static async delete(id) {
    return await prisma.cupons.delete({
      where: { id: parseInt(id) }
    });
  }

  static async validarCupom(id) {
    const cupom = await prisma.cupons.findUnique({
      where: { id: parseInt(id) }
    });

    if (!cupom) throw new Error("Cupom não encontrado");
    if (cupom.quantidade <= 0) throw new Error("Cupom esgotado");
    if (new Date(cupom.validade) < new Date()) throw new Error("Cupom expirado");

    return cupom;
  }
}

module.exports = CouponService;