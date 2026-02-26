const prisma = require("../../database/prisma");

class ProductService {
  static async createProduct(data) {
    try {
      const product = await prisma.produtos.create({
        data: {
          nome: data.nome,
          valor: data.valor,
          descricao: data.descricao,
          desconto: data.desconto || 0,
          estoque: data.estoque,
          categoria_id: data.categoria_id,
          tamanhos: data.tamanhos,
          cores: data.cores,
          altura: data.altura,
          largura: data.largura,
          comprimento: data.comprimento,
          peso: data.peso,
        },
      });

      return product;
    } catch (error) {
      throw new Error("Erro ao criar produto");
    }
  }

  static async getAllProducts() {
    try {
      const products = await prisma.produtos.findMany({
        include: {
          categoria: true,
          produto_imagens: true,
          avaliacoes: true,
        },
      });

      return products;
    } catch (error) {
      throw new Error("Erro ao listar produtos");
    }
  }

  static async getProductById(id) {
    try {
      const product = await prisma.produtos.findUnique({
        where: {
          id: parseInt(id),
        },
        include: {
          categoria: true,
          produto_imagens: true,
          avaliacoes: true,
        },
      });

      return product;
    } catch (error) {
      throw new Error("Erro ao buscar produto");
    }
  }
}

module.exports = ProductService;