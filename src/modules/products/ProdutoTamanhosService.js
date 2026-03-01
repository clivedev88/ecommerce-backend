const prisma = require("../../database/prisma");

class ProdutoTamanhosService {
  async execute(produtoId, tamanhosIds) {
    const idFormatado = parseInt(produtoId);

    if (isNaN(idFormatado)) {
      throw new Error("ID do produto inválido");
    }

    if (!Array.isArray(tamanhosIds) || tamanhosIds.length === 0) {
      throw new Error("Envie um array válido de IDs de tamanhos");
    }

    const produto = await prisma.produtos.findUnique({
      where: { id: idFormatado },
    });

    if (!produto) {
      throw new Error("Produto não encontrado");
    }

    const tamanhosExistentes = await prisma.tamanhos.findMany({
      where: {
        id: { in: tamanhosIds.map((id) => parseInt(id)) },
      },
    });

    if (tamanhosExistentes.length !== tamanhosIds.length) {
      const idsEncontrados = tamanhosExistentes.map((t) => t.id);
      const tamanhosFaltando = tamanhosIds.filter(
        (id) => !idsEncontrados.includes(parseInt(id)),
      );
      throw new Error(
        `Os seguintes tamanhos não existem: ${tamanhosFaltando.join(", ")}`,
      );
    }

    const produtoAtualizado = await prisma.produtos.update({
      where: { id: idFormatado },
      data: {
        tamanhos: JSON.stringify(tamanhosIds),
      },
    });

    return produtoAtualizado;
  }
}

module.exports = ProdutoTamanhosService;
