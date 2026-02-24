const mockProducts = [
  { id: 1, name: "Produto A", stock: 10 },
  { id: 2, name: "Produto B", stock: 5 },
  { id: 3, name: "Produto C", stock: 20 },
];

function validateStock(req, res, next) {
  try {
    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      const error = new Error("Items são obrigatórios para validar estoque");
      error.status = 400;
      return next(error);
    }

    const seenProducts = new Set();

    for (const item of items) {
      const { productId, quantity } = item;

      if (typeof productId !== "number" || typeof quantity !== "number") {
        const error = new Error("productId e quantity devem ser números");
        error.status = 400;
        return next(error);
      }

      if (quantity <= 0) {
        const error = new Error("quantity deve ser maior que zero");
        error.status = 400;
        return next(error);
      }

      if (seenProducts.has(productId)) {
        const error = new Error("Produto duplicado no pedido");
        error.status = 400;
        return next(error);
      }

      seenProducts.add(productId);

      const product = mockProducts.find((p) => p.id === productId);

      if (!product) {
        const error = new Error(
          `Produto com id ${productId} não encontrado`
        );
        error.status = 404;
        return next(error);
      }

      if (product.stock < quantity) {
        const error = new Error(
          `Estoque insuficiente para ${product.name}`
        );
        error.status = 400;
        return next(error);
      }
    }

    return next();
  } catch (error) {
    return next(error);
  }
}

module.exports = validateStock;