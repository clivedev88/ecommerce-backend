const prisma = require("../../database/prisma");
const serialize = require("../../shared/utils/serialize");

class CategoryRepository {
  async create(data) {
    const category = await prisma.categoria.create({ data });
    return serialize(category);
  }

  async findAll() {
    const categories = await prisma.categoria.findMany({
      include: { produtos: true },
      orderBy: { nome: "asc" }
    });
    return serialize(categories);
  }

  async findById(id) {
    const category = await prisma.categoria.findUnique({
      where: { id: parseInt(id) },
      include: { produtos: true }
    });
    return serialize(category);
  }

  async findByName(nome) {
    const category = await prisma.categoria.findFirst({
      where: { nome: { equals: nome, mode: "insensitive" } }
    });
    return category;
  }

  async update(id, data) {
    const category = await prisma.categoria.update({
      where: { id: parseInt(id) },
      data
    });
    return serialize(category);
  }

  async delete(id) {
    return await prisma.categoria.delete({
      where: { id: parseInt(id) }
    });
  }

  async associateProduct(productId, categoryId) {
    const product = await prisma.produtos.update({
      where: { id: parseInt(productId) },
      data: { categoria_id: parseInt(categoryId) },
      select: { 
        id: true, 
        nome: true, 
        categoria_id: true 
      }
    });
    return product;
  }
}

module.exports = CategoryRepository;