const CategoryService = require("./category.service");

class CategoryController {
  constructor() {
    this.service = new CategoryService();
  }

  async create(req, res, next) {
    try {
      const category = await this.service.create(req.body);

      return res.status(201).json({
        tipo: "success",
        mensagem: "Categoria criada com sucesso",
        dados: category
      });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req, res, next) {
    try {
      const categories = await this.service.findAll();

      if (!categories || categories.length === 0) {
        return res.status(200).json({
          tipo: "warning",
          mensagem: "Nenhuma categoria encontrada",
          dados: []
        });
      }

      return res.status(200).json({
        tipo: "success",
        mensagem: "Categorias encontradas",
        dados: categories,
        quantidade: categories.length
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const category = await this.service.findById(id);

      return res.status(200).json({
        tipo: "success",
        mensagem: "Categoria encontrada",
        dados: category
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const category = await this.service.update(id, req.body);

      return res.status(200).json({
        tipo: "success",
        mensagem: "Categoria atualizada",
        dados: category
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
        mensagem: "Categoria deletada"
      });
    } catch (error) {
      next(error);
    }
  }

  async associateProduct(req, res, next) {
    try {
      const { productId, categoryId } = req.body;

      const result = await this.service.associateProduct(productId, categoryId);

      return res.status(200).json({
        tipo: "success",
        mensagem: result.mensagem,
        dados: {
          produto: result.produto,
          categoria: result.categoria
        }
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = CategoryController;