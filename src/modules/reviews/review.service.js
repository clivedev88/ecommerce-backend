const AppError = require("../../shared/errors/AppError");
const ReviewRepository = require("./review.repository");

class ReviewService {
  constructor() {
    this.repository = new ReviewRepository();
  }

  async create(data) {
    const { nota, descricao, usuario_id, produto_id } = data;

    if (!nota) throw new AppError("Nota é obrigatória", 400);
    if (!usuario_id) throw new AppError("ID do usuário é obrigatório", 400);
    if (!produto_id) throw new AppError("ID do produto é obrigatório", 400);

    const notaNum = Number(nota);
    if (isNaN(notaNum) || notaNum < 1 || notaNum > 5) {
      throw new AppError("Nota deve ser um número entre 1 e 5", 400);
    }

    const hasPurchased = await this.repository.userHasPurchasedProduct(usuario_id, produto_id);
    if (!hasPurchased) {
      throw new AppError("Você só pode avaliar produtos que comprou", 403);
    }

    const existingReviews = await this.repository.findByProduct(produto_id);
    const userAlreadyReviewed = existingReviews.some(r => r.usuario_id === parseInt(usuario_id));
    if (userAlreadyReviewed) {
      throw new AppError("Você já avaliou este produto", 400);
    }

    const review = await this.repository.create({
      nota: notaNum,
      descricao: descricao || "",
      usuario_id,
      produto_id
    });

    return review;
  }

  async findAll() {
    return await this.repository.findAll();
  }

  async findById(id) {
    const review = await this.repository.findById(id);
    if (!review) {
      throw new AppError("Avaliação não encontrada", 404);
    }
    return review;
  }

  async findByProduct(productId) {
    const reviews = await this.repository.findByProduct(productId);
    
    const totalNotas = reviews.reduce((sum, r) => sum + Number(r.nota), 0);
    const media = reviews.length > 0 ? totalNotas / reviews.length : 0;

    return {
      total_avaliacoes: reviews.length,
      media_avaliacoes: media.toFixed(1),
      avaliacoes: reviews
    };
  }

  async findByUser(userId) {
    const reviews = await this.repository.findByUser(userId);
    return {
      total_avaliacoes: reviews.length,
      avaliacoes: reviews
    };
  }

  async update(id, data, userId, isAdmin = false) {
    const review = await this.findById(id);

    if (!isAdmin && review.usuario_id !== parseInt(userId)) {
      throw new AppError("Você só pode editar suas próprias avaliações", 403);
    }

    if (data.nota !== undefined) {
      const notaNum = Number(data.nota);
      if (isNaN(notaNum) || notaNum < 1 || notaNum > 5) {
        throw new AppError("Nota deve ser um número entre 1 e 5", 400);
      }
    }

    return await this.repository.update(id, data);
  }

  async delete(id, userId, isAdmin = false) {
    const review = await this.findById(id);

    if (!isAdmin && review.usuario_id !== parseInt(userId)) {
      throw new AppError("Você só pode deletar suas próprias avaliações", 403);
    }

    await this.repository.delete(id);
    return true;
  }
}

module.exports = ReviewService;