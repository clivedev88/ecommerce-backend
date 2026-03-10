const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function associateProductToCategory(req, res, next) {
  try {
    const { productId, categoryId } = req.body;

    if (!productId || !categoryId) {
      return res
        .status(400)
        .json({ mensagem: "productId e categoryId são obrigatórios" });
    }

    const category = await prisma.categoria.findUnique({
      where: { id: categoryId },
    });
    if (!category) {
      return res.status(404).json({ mensagem: "Categoria não encontrada" });
    }

    const product = await prisma.produtos.findUnique({
      where: { id: productId },
    });
    if (!product) {
      return res.status(404).json({ mensagem: "Produto não encontrado" });
    }

    const updatedProduct = await prisma.produtos.update({
      where: { id: productId },
      data: { categoria_id: categoryId },
      select: { id: true, nome: true, categoria_id: true },
    });

    return res.status(200).json({
      mensagem: `Produto ${updatedProduct.nome} associado à categoria ${category.nome}`,
      produto: updatedProduct,
    });
  } catch (error) {
    console.error("Erro interno:", error);
    return res.status(500).json({
      mensagem: "Erro interno do servidor",
      detalhe: error.message,
    });
  }
}

module.exports = { associateProductToCategory };
