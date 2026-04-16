const prisma = require("../../database/prisma");
const serialize = require("../../shared/utils/serialize");

class ReviewRepository {
  async create(data) {
    const review = await prisma.avaliacoes.create({
      data: {
        nota: BigInt(data.nota),
        descricao: data.descricao,
        usuario_id: parseInt(data.usuario_id),
        produto_id: parseInt(data.produto_id)
      },
      include: { 
        usuarios: {
          select: { id: true, nome: true, email: true }
        }, 
        produtos: {
          select: { id: true, nome: true, valor: true }
        }
      }
    });
    return serialize(review);
  }

  async findAll() {
    const reviews = await prisma.avaliacoes.findMany({
      include: { 
        usuarios: {
          select: { id: true, nome: true, email: true }
        }, 
        produtos: {
          select: { id: true, nome: true, valor: true }
        }
      },
      orderBy: { id: 'desc' }
    });
    return serialize(reviews);
  }

  async findById(id) {
    const review = await prisma.avaliacoes.findUnique({
      where: { id: parseInt(id) },
      include: { 
        usuarios: {
          select: { id: true, nome: true, email: true }
        }, 
        produtos: {
          select: { id: true, nome: true, valor: true }
        }
      }
    });
    return serialize(review);
  }

  async findByProduct(productId) {
    const reviews = await prisma.avaliacoes.findMany({
      where: { produto_id: parseInt(productId) },
      include: { 
        usuarios: {
          select: { id: true, nome: true, email: true }
        }
      },
      orderBy: { id: 'desc' }
    });
    return serialize(reviews);
  }

  async findByUser(userId) {
    const reviews = await prisma.avaliacoes.findMany({
      where: { usuario_id: parseInt(userId) },
      include: { 
        produtos: {
          select: { id: true, nome: true, valor: true }
        }
      },
      orderBy: { id: 'desc' }
    });
    return serialize(reviews);
  }

  async update(id, data) {
    const updateData = {};
    if (data.nota !== undefined) updateData.nota = BigInt(data.nota);
    if (data.descricao !== undefined) updateData.descricao = data.descricao;
    
    const review = await prisma.avaliacoes.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: { 
        usuarios: {
          select: { id: true, nome: true, email: true }
        }, 
        produtos: {
          select: { id: true, nome: true, valor: true }
        }
      }
    });
    return serialize(review);
  }

  async delete(id) {
    return await prisma.avaliacoes.delete({ 
      where: { id: parseInt(id) } 
    });
  }

  async userHasPurchasedProduct(userId, productId) {
    const order = await prisma.pedidos.findFirst({
      where: {
        usuario_id: parseInt(userId),
        status: { in: ["entregue", "pago", "enviado"] }, // ✅ SÓ ESTES STATUS
        pedido_produto: {
          some: {
            id_produto: parseInt(productId)
          }
        }
      }
    });
    return !!order;
  }
}

module.exports = ReviewRepository;