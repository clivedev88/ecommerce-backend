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
      res.status(500).json({ erro: error.message });
    }
  }

  static async getAll(req, res) {
    try {
      const products = await ProductService.getAllProducts();
      const serialized = products.map(serializeProduct);
      res.status(200).json(serialized);
    } catch (error) {
      res.status(500).json({ erro: error.message });
    }
  }

  static async getById(req, res) {
    try {
      const { id } = req.params;
      const product = await ProductService.getProductById(id);

      if (!product) {
        return res.status(404).json({ erro: "Produto não encontrado" });
      }

      res.status(200).json(serializeProduct(product));
    } catch (error) {
      res.status(500).json({ erro: error.message });
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;
      const updatedProduct = await ProductService.updateProduct(id, req.body);

      if (!updatedProduct) {
        return res.status(404).json({ erro: "Produto não encontrado" });
      }

      res.status(200).json(serializeProduct(updatedProduct));
    } catch (error) {
      res.status(500).json({ erro: error.message });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
      const deleted = await ProductService.deleteProduct(id);

      if (!deleted) {
        return res.status(404).json({ erro: "Produto não encontrado" });
      }

      res.status(200).json({ mensagem: "Produto deletado com sucesso" });
    } catch (error) {
      res.status(500).json({ erro: error.message });
    }
  }

  static async atualizarTamanhos(req, res) {
    try {
      const { id } = req.params;
      const { tamanhos } = req.body;

      if (!Array.isArray(tamanhos)) {
        return res.status(400).json({ 
          erro: "O campo 'tamanhos' deve ser um array" 
        });
      }

      const updated = await ProductService.atualizarTamanhos(id, tamanhos);

      if (!updated) {
        return res.status(400).json({ erro: "Erro ao atualizar tamanhos" });
      }

      res.status(200).json(updated);
    } catch (error) {
      res.status(500).json({ erro: error.message });
    }
  }
}

module.exports = ProductController;