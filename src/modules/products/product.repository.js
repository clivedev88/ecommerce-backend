const prisma = require("../../database/prisma");
const serialize = require("../../shared/utils/serialize");

class ProductRepository {
  async create(data) {
    const product = await prisma.produtos.create({ data });
    return serialize(product);
  }

  async findAll() {
    const products = await prisma.produtos.findMany({
      include: {
        categoria: true,
        produto_imagens: true,
        avaliacoes: true
      },
      orderBy: { id: "desc" }
    });
    return serialize(products);
  }

  async findById(id) {
    const product = await prisma.produtos.findUnique({
      where: { id: parseInt(id) },
      include: {
        categoria: true,
        produto_imagens: true,
        avaliacoes: true
      }
    });
    return serialize(product);
  }

  async update(id, data) {
    const product = await prisma.produtos.update({
      where: { id: parseInt(id) },
      data
    });
    return serialize(product);
  }

  async delete(id) {
    return await prisma.produtos.delete({
      where: { id: parseInt(id) }
    });
  }

  async findTamanhosByIds(ids) {
    return await prisma.tamanhos.findMany({
      where: { id: { in: ids.map(id => parseInt(id)) } }
    });
  }

  async findCoresByIds(ids) {
    return await prisma.cores.findMany({
      where: { id: { in: ids.map(id => parseInt(id)) } }
    });
  }

  async updateTamanhos(id, tamanhosIds) {
    const product = await prisma.produtos.update({
      where: { id: parseInt(id) },
      data: { tamanhos: JSON.stringify(tamanhosIds) }
    });
    return serialize(product);
  }

  async updateCores(id, coresIds) {
    const product = await prisma.produtos.update({
      where: { id: parseInt(id) },
      data: { cores: JSON.stringify(coresIds) }
    });
    return serialize(product);
  }

  async checkEstoque(ids) {
    const products = await prisma.produtos.findMany({
      where: { id: { in: ids } },
      select: { id: true, nome: true, estoque: true }
    });
    return products;
  }
}

module.exports = ProductRepository;