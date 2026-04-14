const AppError = require("../../shared/errors/AppError");
const ProductRepository = require("./product.repository");
const serialize = require("../../shared/utils/serialize");

class ProductService {
  constructor() {
    this.repository = new ProductRepository();
  }

  async create(data) {
    const productData = {
      nome: data.nome,
      valor: data.valor,
      descricao: data.descricao,
      desconto: data.desconto || 0,
      estoque: parseInt(data.estoque),
      categoria_id: parseInt(data.categoria_id),
      tamanhos: data.tamanhos ? JSON.stringify(data.tamanhos) : "[]",
      cores: data.cores ? JSON.stringify(data.cores) : "[]",
      altura: data.altura,
      largura: data.largura,
      comprimento: data.comprimento,
      peso: data.peso
    };

    const product = await this.repository.create(productData);
    return serialize(product);
  }

  async findAll() {
    const products = await this.repository.findAll();
    return serialize(products);
  }

  async findById(id) {
    const product = await this.repository.findById(id);
    if (!product) throw new AppError("Produto não encontrado", 404);
    return serialize(product);
  }

  async update(id, data) {
    await this.findById(id);

    const updateData = {};

    if (data.nome) updateData.nome = data.nome;
    if (data.valor !== undefined) updateData.valor = data.valor;
    if (data.descricao) updateData.descricao = data.descricao;
    if (data.desconto !== undefined) updateData.desconto = data.desconto;
    if (data.estoque !== undefined) updateData.estoque = parseInt(data.estoque);
    if (data.categoria_id) updateData.categoria_id = parseInt(data.categoria_id);
    if (data.tamanhos) updateData.tamanhos = JSON.stringify(data.tamanhos);
    if (data.cores) updateData.cores = JSON.stringify(data.cores);
    if (data.altura) updateData.altura = data.altura;
    if (data.largura) updateData.largura = data.largura;
    if (data.comprimento) updateData.comprimento = data.comprimento;
    if (data.peso) updateData.peso = data.peso;

    const product = await this.repository.update(id, updateData);
    return serialize(product);
  }

  async delete(id) {
    await this.findById(id);
    return await this.repository.delete(id);
  }

  async atualizarTamanhos(produtoId, tamanhosIds) {
    await this.findById(produtoId);

    if (tamanhosIds && tamanhosIds.length > 0) {
      const tamanhosExistentes = await this.repository.findTamanhosByIds(tamanhosIds);
      if (tamanhosExistentes.length !== tamanhosIds.length) {
        throw new AppError("Um ou mais tamanhos não existem", 400);
      }
    }

    return await this.repository.updateTamanhos(produtoId, tamanhosIds || []);
  }

  async atualizarCores(produtoId, coresIds) {
    await this.findById(produtoId);

    if (coresIds && coresIds.length > 0) {
      const coresExistentes = await this.repository.findCoresByIds(coresIds);
      if (coresExistentes.length !== coresIds.length) {
        throw new AppError("Uma ou mais cores não existem", 400);
      }
    }

    return await this.repository.updateCores(produtoId, coresIds || []);
  }

  async validateStock(items) {
    const ids = items.map(item => item.productId);
    const produtos = await this.repository.checkEstoque(ids);

    if (produtos.length !== ids.length) {
      throw new AppError("Um ou mais produtos não encontrados", 404);
    }

    for (const item of items) {
      const produto = produtos.find(p => p.id === item.productId);
      if (Number(produto.estoque) < item.quantity) {
        throw new AppError(`Estoque insuficiente para ${produto.nome}`, 400);
      }
    }

    return produtos;
  }
}

module.exports = ProductService;