// const prisma = require("../../database/prisma");
const { de } = require("zod/locales");
const AppError = require("../../shared/errors/AppError");
// const serialize = require("../../shared/utils/serialize");
const ProductRepository = require("./product.repository");

class ProductService {
  constructor   () {
    this.productRepository = new ProductRepository;
  }

  static async create(data) {
    const product = await this.productRepository.create ({
        nome: data.nome,
        valor: data.valor,
        descricao: data.descricao,
        desconto: data.desconto || 0,
        estoque: parseInt(data.estoque),
        categoria_id: parseInt(data.categoria_id),
        tamanhos: data.tamanhos || "[]",
        cores: data.cores || "[]",
        altura: data.altura,
        largura: data.largura,
        comprimento: data.comprimento,
        peso: data.peso,
    });

    return product;
  }

  static async findAll() {
    const products = await this.productRepository.findAll({});

    return products;
  }

  static async findById(id) {
    const product = await this.productRepository.findById(parseInt(id));

    if (!product) {
      throw new AppError("Produto não encontrado", 404);
    }

    return product;
  }

  static async update(id, data) {
    await this.findById.update(id );

    const product = await this.productRepository.update(parseInt(id), data);
        return product;
  }

  static async delete(id) {
    await this.findById(id);
    await this.productRepository.delete(parseInt(id));

    return {deleted: true};
  }

  async atualizarTamanhos(produtoId, tamanhosIds) {
    await this.findById(produtoId);

    const tamanhosExistentes = await this.productRepository.findTamanhosByIds(tamanhosIds);
    if (tamanhosExistentes.length !== tamanhosIds.length) {
      throw new AppError("Um ou mais tamanhos não existem", 400);
    }

    return await this.productRepository.updateTamanhos(produtoId, tamanhosIds);
  }

  async atualizarCores(produtoId, coresIds) {
    await this.findById(produtoId);

    const coresExistentes = await this.productRepository.findCoresByIds(coresIds);
    if (coresExistentes.length !== coresIds.length) {
      throw new AppError("Uma ou mais cores não existem", 400);
    }

    return await this.productRepository.updateCores(produtoId, coresIds);
  }

  async validateStock(items) {
    if (!Array.isArray(items) || items.length === 0) {
      throw new AppError("Items são obrigatórios", 400);
    }

    const ids = items.map(item => item.productId);
    const produtos = await this.productRepository.checkEstoque(ids);

    if (produtos.length !== ids.length) {
      throw new AppError("Um ou mais produtos não encontrados", 404);
    }

    for (const item of items) {
      const produto = produtos.find(p => p.id === item.productId);
      if (produto.estoque < item.quantity) {
        throw new AppError(`Estoque insuficiente para ${produto.nome}`, 400);
      }
    }

    return produtos;
  }
}

module.exports = ProductService;
