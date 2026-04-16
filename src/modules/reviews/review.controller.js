const ReviewService = require("./review.service");

class ReviewController {
  constructor() {
    this.service = new ReviewService();
  }

  async create(req, res, next) {
    try {
      const reviewData = {
        ...req.body,
        usuario_id: req.usuarioId
      };
      
      const review = await this.service.create(reviewData);

      return res.status(201).json({
        tipo: "success",
        mensagem: "Avaliação criada com sucesso",
        dados: review
      });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req, res, next) {
    try {
      const reviews = await this.service.findAll();

      if (!reviews || reviews.length === 0) {
        return res.status(200).json({
          tipo: "warning",
          mensagem: "Nenhuma avaliação encontrada",
          dados: []
        });
      }

      return res.status(200).json({
        tipo: "success",
        mensagem: "Avaliações encontradas",
        dados: reviews
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const review = await this.service.findById(id);

      return res.status(200).json({
        tipo: "success",
        mensagem: "Avaliação encontrada",
        dados: review
      });
    } catch (error) {
      next(error);
    }
  }

  async getByProduct(req, res, next) {
    try {
      const { productId } = req.params;
      const result = await this.service.findByProduct(productId);

      return res.status(200).json({
        tipo: "success",
        mensagem: "Avaliações do produto",
        dados: result
      });
    } catch (error) {
      next(error);
    }
  }

  async getMyReviews(req, res, next) {
    try {
      const userId = req.usuarioId;
      const result = await this.service.findByUser(userId);

      return res.status(200).json({
        tipo: "success",
        mensagem: "Minhas avaliações",
        dados: result
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.usuarioId;
      const isAdmin = req.usuario?.nivel === 'admin';

      const review = await this.service.update(id, req.body, userId, isAdmin);

      return res.status(200).json({
        tipo: "success",
        mensagem: "Avaliação atualizada",
        dados: review
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.usuarioId;
      const isAdmin = req.usuario?.nivel === 'admin';

      await this.service.delete(id, userId, isAdmin);

      return res.status(200).json({
        tipo: "success",
        mensagem: "Avaliação deletada"
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ReviewController;