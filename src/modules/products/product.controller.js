const ProductService = require("./product.service");

// Converter BigInt para Number no JSON
const serializeProduct = (product) => {
  if (!product) return null;
  return {
    ...product,
    desconto: product.desconto ? Number(product.desconto) : 0,
    estoque: product.estoque ? Number(product.estoque) : 0,
    avaliacoes: product.avaliacoes?.map(av => ({
      ...av,
      nota: Number(av.nota)
    }))
  };
};

class ProductController {
  static async create(req, res) {
    try {
      const newProduct = await ProductService.createProduct(req.body);
      res.status(201).json(serializeProduct(newProduct));
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getAll(req, res) {
    try {
      const products = await ProductService.getAllProducts();
      const serialized = products.map(serializeProduct);
      res.status(200).json(serialized);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getById(req, res) {
    const { id } = req.params;

    try {
      const product = await ProductService.getProductById(id);

      if (!product) {
        return res.status(404).json({ error: "Produto não encontrado" });
      }

      res.status(200).json(serializeProduct(product));
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async update(req, res) {
  const { id } = req.params;

  try {
    const updatedProduct = await ProductService.updateProduct(id, req.body);
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

static async delete(req, res) {
  const { id } = req.params;

  try {
    const result = await ProductService.deleteProduct(id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

}

module.exports = ProductController;