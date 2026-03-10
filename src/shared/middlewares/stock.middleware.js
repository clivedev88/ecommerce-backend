const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function validateStock(req, _res, next) {
  try {
    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      const error = new Error("Items são obrigatórios");
      error.status = 400;
      return next(error);
    }

    const ids = [];
    const seen = new Set();

    for (const item of items) {
      if (
        typeof item.productId !== "number" ||
        typeof item.quantity !== "number"
      ) {
        const error = new Error("productId e quantity devem ser números");
        error.status = 400;
        return next(error);
      }

      if (item.quantity <= 0) {
        const error = new Error("quantity deve ser maior que zero");
        error.status = 400;
        return next(error);
      }

      if (seen.has(item.productId)) {
        const error = new Error("Produto duplicado no pedido");
        error.status = 400;
        return next(error);
      }

      seen.add(item.productId);
      ids.push(item.productId);
    }

    const produtos = await prisma.produtos.findMany({
      where: { id: { in: ids } },
      select: { id: true, nome: true, estoque: true },
    });

    if (produtos.length !== ids.length) {
      const error = new Error("Produto não encontrado");
      error.status = 404;
      return next(error);
    }

    for (const item of items) {
      const produto = produtos.find((p) => p.id === item.productId);

      if (produto.estoque < BigInt(item.quantity)) {
        const error = new Error(`Estoque insuficiente para ${produto.nome}`);
        error.status = 400;
        return next(error);
      }
    }

    next();
  } catch (error) {
    next(error);
  }
}

module.exports = validateStock;
