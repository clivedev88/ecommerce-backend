const prisma = require("../../database/prisma");

class ProductService {
  static async createProduct(data) {
    try {
      const product = await prisma.produtos.create({
        data: {
          nome: data.nome,
          valor: data.valor,
          descricao: data.descricao,
          desconto: data.desconto ? BigInt(data.desconto) : BigInt(0),
          estoque: BigInt(data.estoque),
          categoria_id: parseInt(data.categoria_id),
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
      console.error('Erro ao criar produto:', error);
      throw new Error(`Erro ao criar produto: ${error.message}`);
    }
  }

  static async getAllProducts() {
    try {
      const products = await prisma.produtos.findMany({
        include: {
          categoria: true,
          produto_imagens: true,
          avaliacoes: {
            include: {
              usuarios: {
                select: {
                  id: true,
                  nome: true,
                }
              }
            }
          },
        },
      });

      return products;
    } catch (error) {
      console.error('Erro ao listar produtos:', error);
      throw new Error(`Erro ao listar produtos: ${error.message}`);
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
          avaliacoes: {
            include: {
              usuarios: {
                select: {
                  id: true,
                  nome: true,
                }
              }
            }
          },
        },
      });

      return product;
    } catch (error) {
      console.error('Erro ao buscar produto:', error);
      throw new Error(`Erro ao buscar produto: ${error.message}`);
    }
  }

  static async updateProduct(id, data) {
  try {
    const product = await prisma.produtos.update({
      where: {
        id: parseInt(id),
      },
      data: {
        nome: data.nome,
        valor: data.valor,
        descricao: data.descricao,
        desconto: data.desconto,
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
    throw new Error("Erro ao atualizar produto");
  }
}

static async deleteProduct(id) {
  try {
    await prisma.produtos.delete({
      where: {
        id: parseInt(id),
      },
    });

    return { message: "Produto deletado com sucesso" };
  } catch (error) {
    throw new Error("Erro ao deletar produto");
  }
}

}

module.exports = ProductService;