const prisma = require("../../database/prisma");
const serialize = require("../../shared/utils/serialize");

class CouponRepository {
  async create(data) {
    const coupon = await prisma.cupons.create({ data });
    return serialize(coupon);
  }

  async findAll() {
    const coupons = await prisma.cupons.findMany({
      orderBy: { validade: "asc" }
    });
    return serialize(coupons);
  }

  async findById(id) {
    const coupon = await prisma.cupons.findUnique({
      where: { id: Number(id) }
    });
    return serialize(coupon);
  }

  async findByName(nome) {
    const coupon = await prisma.cupons.findFirst({
      where: {
        nome: {
          equals: nome,
          mode: "insensitive"
        }
      }
    });
    return serialize(coupon);
  }

  async update(id, data) {
    const coupon = await prisma.cupons.update({
      where: { id: Number(id) },
      data
    });
    return serialize(coupon);
  }

  async delete(id) {
    return await prisma.cupons.delete({
      where: { id: Number(id) }
    });
  }

  async decrementQuantidade(id) {
    const coupon = await prisma.cupons.update({
      where: { id: Number(id) },
      data: {
        quantidade: {
          decrement: 1
        }
      }
    });
    return serialize(coupon);
  }

  async findProductById(id) {
    const product = await prisma.produtos.findUnique({
      where: { id: Number(id) },
      select: {
        id: true,
        nome: true,
        valor: true,
        estoque: true
      }
    });

    return serialize(product);
  }
}

module.exports = CouponRepository;