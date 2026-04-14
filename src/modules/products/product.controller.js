const ProductService = require("./product.service");

class ProductController {
  constructor() {
    this.service = new ProductService();
  }

  async create(req, res, next) {
    try {
      const product = await this.service.create(req.body);
      return res.status(201).json({
        tipo: "success",
        mensagem: "Produto criado com sucesso",
        dados: product
      });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req, res, next) {
    try {
      const products = await this.service.findAll();
      return res.status(200).json({
        tipo: "success",
        mensagem: "Produtos encontrados",
        dados: products
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const product = await this.service.findById(id);
      return res.status(200).json({
        tipo: "success",
        mensagem: "Produto encontrado",
        dados: product
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const product = await this.service.update(id, req.body);
      return res.status(200).json({
        tipo: "success",
        mensagem: "Produto atualizado",
        dados: product
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      await this.service.delete(id);
      return res.status(200).json({
        tipo: "success",
        mensagem: "Produto deletado"
      });
    } catch (error) {
      next(error);
    }
  }

  async atualizarTamanhos(req, res, next) {
    try {
      const { id } = req.params;
      const { tamanhos } = req.body;

      const updated = await this.service.atualizarTamanhos(id, tamanhos);

      return res.status(200).json({
        tipo: "success",
        mensagem: "Tamanhos atualizados",
        dados: updated
      });
    } catch (error) {
      next(error);
    }
  }

  async atualizarCores(req, res, next) {
    try {
      const { id } = req.params;
      const { cores } = req.body;

      const updated = await this.service.atualizarCores(id, cores);

      return res.status(200).json({
        tipo: "success",
        mensagem: "Cores atualizadas",
        dados: updated
      });
    } catch (error) {
      next(error);
    }
  }

  async validateStock(req, res, next) {
    try {
      const { items } = req.body;
      await this.service.validateStock(items);
      return res.status(200).json({
        tipo: "success",
        mensagem: "Estoque validado com sucesso"
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ProductController;