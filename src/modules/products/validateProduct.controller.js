const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function validateProduct(req, res, next) {
  try {
    const { productId } = req.body || {};

    if (!productId) {
      return res.status(400).json({ mensagem: "productId é obrigatório" });
    }

    const product = await prisma.produtos.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return res.status(404).json({ mensagem: "Produto não encontrado" });
    }

    if (product.estoque <= 0) {
      return res.status(400).json({ mensagem: "Produto sem estoque" });
    }

    req.produtoValido = product;
    return next();
  } catch (error) {
    console.error("Erro interno:", error);
    return res
      .status(500)
      .json({ mensagem: "Erro interno do servidor", detalhe: error.message });
  }
}

module.exports = { validateProduct };
