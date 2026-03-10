const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function applyCouponToProduct(req, res) {
  try {
    const { couponId, productId } = req.body || {};

    if (!couponId || !productId) {
      return res
        .status(400)
        .json({ mensagem: "couponId e productId são obrigatórios" });
    }

    const coupon = await prisma.cupons.findUnique({ where: { id: couponId } });
    if (!coupon)
      return res.status(404).json({ mensagem: "Cupom não encontrado" });

    const product = await prisma.produtos.findUnique({
      where: { id: productId },
    });
    if (!product)
      return res.status(404).json({ mensagem: "Produto não encontrado" });

    if (product.estoque <= 0) {
      return res
        .status(400)
        .json({ mensagem: "Produto sem estoque, cupom não aplicável" });
    }

    return res.status(200).json({
      mensagem: `Cupom ${coupon.nome} pode ser aplicado ao produto ${product.nome}`,
      cupom: {
        id: coupon.id,
        nome: coupon.nome,
        valor_desc: coupon.valor_desc,
      },
      produto: { id: product.id, nome: product.nome, valor: product.valor },
    });
  } catch (error) {
    console.error("Erro interno:", error);
    return res
      .status(500)
      .json({ mensagem: "Erro interno do servidor", detalhe: error.message });
  }
}

module.exports = { applyCouponToProduct };
