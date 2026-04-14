const prisma = require("../../database/prisma");

class ProductRepository {
  async create(data) {
    return await prisma.produtos.create({ data });
  }

  async findAll() {
    return await prisma.produtos.findMany({
      include: {
        categoria: true,
        produto_imagens: true,
        avaliacoes: true
      },
      orderBy: { id: "desc" }
    });
  }

  async findById(id) {
    return await prisma.produtos.findUnique({
      where: { id: parseInt(id) },
      include: {
        categoria: true,
        produto_imagens: true,
        avaliacoes: true
      }
    });
  }

  async update(id, data) {
    return await prisma.produtos.update({
      where: { id: parseInt(id) },
      data
    });
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
      data: { tamanhos: tamanhosIds }
    });
    return serialize(product);
  }

  async updateCores(id, coresIds) {
    const product = await prisma.produtos.update({
      where: { id: parseInt(id) },
      data: { cores: coresIds }
    });
    return serialize(product);
  }

  async checkEstoque(ids) {
    return await prisma.produtos.findMany({
      where: { id: { in: ids } },
      select: { id: true, nome: true, estoque: true }
    });
  }
}

module.exports = ProductRepository;