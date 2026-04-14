const AppError = require("../../shared/errors/AppError");
const CategoryRepository = require("./category.repository");

class CategoryService {
  constructor() {
    this.repository = new CategoryRepository();
  }

  async create(data) {
    if (!data.nome) {
      throw new AppError("Nome da categoria é obrigatório", 400);
    }

    const existing = await this.repository.findByName(data.nome);
    if (existing) {
      throw new AppError("Já existe uma categoria com este nome", 400);
    }

    const category = await this.repository.create(data);
    return category;
  }

  async findAll() {
    const categories = await this.repository.findAll();
    return categories;
  }

  async findById(id) {
    const category = await this.repository.findById(id);
    if (!category) {
      throw new AppError("Categoria não encontrada", 404);
    }
    return category;
  }

  async update(id, data) {
    await this.findById(id);

    if (data.nome) {
      const existing = await this.repository.findByName(data.nome);
      if (existing && existing.id !== parseInt(id)) {
        throw new AppError("Já existe uma categoria com este nome", 400);
      }
    }

    const category = await this.repository.update(id, data);
    return category;
  }

  async delete(id) {
    const category = await this.findById(id);

    if (category.produtos && category.produtos.length > 0) {
      throw new AppError("Não é possível deletar categoria com produtos associados", 400);
    }

    await this.repository.delete(id);
    return true;
  }

  async associateProduct(productId, categoryId) {
    if (!productId || !categoryId) {
      throw new AppError("productId e categoryId são obrigatórios", 400);
    }

    const category = await this.repository.findById(categoryId);
    if (!category) {
      throw new AppError("Categoria não encontrada", 404);
    }

    const product = await this.repository.associateProduct(productId, categoryId);

    return {
      mensagem: `Produto ${product.nome} associado à categoria ${category.nome}`,
      produto: product,
      categoria: { id: category.id, nome: category.nome }
    };
  }
}

module.exports = CategoryService;