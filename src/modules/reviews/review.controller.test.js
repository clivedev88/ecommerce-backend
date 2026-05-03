const ReviewController = require("./review.controller");
const ReviewService = require("./review.service");
const AppError = require("../../shared/errors/AppError");

jest.mock("./review.service");

describe("ReviewController", () => {
  let reviewController;
  let mockReq;
  let mockRes;
  let mockNext;

  beforeEach(() => {
    ReviewService.mockClear();
    reviewController = new ReviewController();
    
    mockReq = {
      body: {},
      params: {},
      usuarioId: 1,
      usuario: { nivel: "cliente" }
    };
    
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    
    mockNext = jest.fn();
  });

  describe("create", () => {
    it("deveria criar uma avaliação com sucesso", async () => {
      const reviewData = {
        nota: 5,
        descricao: "Produto excelente!",
        produto_id: 10
      };

      mockReq.body = reviewData;

      const mockReview = {
        id: 1,
        nota: 5,
        descricao: "Produto excelente!",
        usuario_id: 1,
        produto_id: 10
      };

      ReviewService.prototype.create = jest.fn().mockResolvedValue(mockReview);

      await reviewController.create(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        tipo: "success",
        mensagem: "Avaliação criada com sucesso",
        dados: mockReview
      });
    });

    it("deveria passar erro para next quando falhar", async () => {
      mockReq.body = { nota: 5, descricao: "Teste", produto_id: 10 };

      const error = new AppError("Erro ao criar", 400);
      ReviewService.prototype.create = jest.fn().mockRejectedValue(error);

      await reviewController.create(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });

    it("deveria incluir usuarioId do request na avaliação", async () => {
      mockReq.body = { nota: 4, descricao: "Bom", produto_id: 20 };
      mockReq.usuarioId = 5;

      ReviewService.prototype.create = jest.fn().mockResolvedValue({
        id: 1,
        nota: 4,
        usuario_id: 5,
        produto_id: 20
      });

      await reviewController.create(mockReq, mockRes, mockNext);

      expect(ReviewService.prototype.create).toHaveBeenCalledWith({
        nota: 4,
        descricao: "Bom",
        produto_id: 20,
        usuario_id: 5
      });
    });
  });

  describe("getAll", () => {
    it("deveria retornar todas as avaliações", async () => {
      const mockReviews = [
        { id: 1, nota: 5, descricao: "Excelente", usuario_id: 1, produto_id: 10 },
        { id: 2, nota: 4, descricao: "Bom", usuario_id: 2, produto_id: 10 }
      ];

      ReviewService.prototype.findAll = jest.fn().mockResolvedValue(mockReviews);

      await reviewController.getAll(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        tipo: "success",
        mensagem: "Avaliações encontradas",
        dados: mockReviews
      });
    });

    it("deveria retornar aviso quando não há avaliações", async () => {
      ReviewService.prototype.findAll = jest.fn().mockResolvedValue([]);

      await reviewController.getAll(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        tipo: "warning",
        mensagem: "Nenhuma avaliação encontrada",
        dados: []
      });
    });

    it("deveria retornar aviso quando resultado é null", async () => {
      ReviewService.prototype.findAll = jest.fn().mockResolvedValue(null);

      await reviewController.getAll(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        tipo: "warning",
        mensagem: "Nenhuma avaliação encontrada",
        dados: []
      });
    });

    it("deveria passar erro para next quando falhar", async () => {
      const error = new AppError("Erro ao buscar", 500);
      ReviewService.prototype.findAll = jest.fn().mockRejectedValue(error);

      await reviewController.getAll(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe("getById", () => {
    it("deveria retornar uma avaliação por ID", async () => {
      mockReq.params = { id: "1" };

      const mockReview = {
        id: 1,
        nota: 5,
        descricao: "Excelente",
        usuario_id: 1,
        produto_id: 10
      };

      ReviewService.prototype.findById = jest.fn().mockResolvedValue(mockReview);

      await reviewController.getById(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        tipo: "success",
        mensagem: "Avaliação encontrada",
        dados: mockReview
      });
    });

    it("deveria passar erro para next quando avaliação não existe", async () => {
      mockReq.params = { id: "99999" };

      const error = new AppError("Avaliação não encontrada", 404);
      ReviewService.prototype.findById = jest.fn().mockRejectedValue(error);

      await reviewController.getById(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe("getByProduct", () => {
    it("deveria retornar avaliações do produto", async () => {
      mockReq.params = { productId: "10" };

      const mockResult = {
        total_avaliacoes: 2,
        media_avaliacoes: "4.5",
        avaliacoes: [
          { id: 1, nota: 5, usuario_id: 1, produto_id: 10 },
          { id: 2, nota: 4, usuario_id: 2, produto_id: 10 }
        ]
      };

      ReviewService.prototype.findByProduct = jest.fn().mockResolvedValue(mockResult);

      await reviewController.getByProduct(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        tipo: "success",
        mensagem: "Avaliações do produto",
        dados: mockResult
      });
    });

    it("deveria passar erro para next quando falhar", async () => {
      mockReq.params = { productId: "10" };

      const error = new AppError("Erro ao buscar", 500);
      ReviewService.prototype.findByProduct = jest.fn().mockRejectedValue(error);

      await reviewController.getByProduct(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe("getMyReviews", () => {
    it("deveria retornar avaliações do usuário autenticado", async () => {
      mockReq.usuarioId = 1;

      const mockResult = {
        total_avaliacoes: 2,
        avaliacoes: [
          { id: 1, nota: 5, usuario_id: 1, produto_id: 10 },
          { id: 2, nota: 4, usuario_id: 1, produto_id: 20 }
        ]
      };

      ReviewService.prototype.findByUser = jest.fn().mockResolvedValue(mockResult);

      await reviewController.getMyReviews(mockReq, mockRes, mockNext);

      expect(ReviewService.prototype.findByUser).toHaveBeenCalledWith(1);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        tipo: "success",
        mensagem: "Minhas avaliações",
        dados: mockResult
      });
    });

    it("deveria passar erro para next quando falhar", async () => {
      mockReq.usuarioId = 1;

      const error = new AppError("Erro ao buscar", 500);
      ReviewService.prototype.findByUser = jest.fn().mockRejectedValue(error);

      await reviewController.getMyReviews(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe("update", () => {
    it("deveria atualizar uma avaliação", async () => {
      mockReq.params = { id: "1" };
      mockReq.body = { nota: 4, descricao: "Muito bom" };
      mockReq.usuarioId = 1;
      mockReq.usuario = { nivel: "cliente" };

      const mockUpdated = {
        id: 1,
        nota: 4,
        descricao: "Muito bom",
        usuario_id: 1,
        produto_id: 10
      };

      ReviewService.prototype.update = jest.fn().mockResolvedValue(mockUpdated);

      await reviewController.update(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        tipo: "success",
        mensagem: "Avaliação atualizada",
        dados: mockUpdated
      });
    });

    it("deveria passar isAdmin=false para usuário comum", async () => {
      mockReq.params = { id: "1" };
      mockReq.body = { nota: 4 };
      mockReq.usuarioId = 1;
      mockReq.usuario = { nivel: "cliente" };

      ReviewService.prototype.update = jest.fn().mockResolvedValue({});

      await reviewController.update(mockReq, mockRes, mockNext);

      expect(ReviewService.prototype.update).toHaveBeenCalledWith("1", { nota: 4 }, 1, false);
    });

    it("deveria passar isAdmin=true para admin", async () => {
      mockReq.params = { id: "1" };
      mockReq.body = { nota: 4 };
      mockReq.usuarioId = 1;
      mockReq.usuario = { nivel: "admin" };

      ReviewService.prototype.update = jest.fn().mockResolvedValue({});

      await reviewController.update(mockReq, mockRes, mockNext);

      expect(ReviewService.prototype.update).toHaveBeenCalledWith("1", { nota: 4 }, 1, true);
    });

    it("deveria passar erro para next", async () => {
      mockReq.params = { id: "1" };
      mockReq.body = { nota: 4 };

      const error = new AppError("Permissão negada", 403);
      ReviewService.prototype.update = jest.fn().mockRejectedValue(error);

      await reviewController.update(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe("delete", () => {
    it("deveria deletar uma avaliação", async () => {
      mockReq.params = { id: "1" };
      mockReq.usuarioId = 1;
      mockReq.usuario = { nivel: "cliente" };

      ReviewService.prototype.delete = jest.fn().mockResolvedValue(true);

      await reviewController.delete(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        tipo: "success",
        mensagem: "Avaliação deletada"
      });
    });

    it("deveria passar isAdmin=false para usuário comum", async () => {
      mockReq.params = { id: "1" };
      mockReq.usuarioId = 1;
      mockReq.usuario = { nivel: "cliente" };

      ReviewService.prototype.delete = jest.fn().mockResolvedValue(true);

      await reviewController.delete(mockReq, mockRes, mockNext);

      expect(ReviewService.prototype.delete).toHaveBeenCalledWith("1", 1, false);
    });

    it("deveria passar isAdmin=true para admin", async () => {
      mockReq.params = { id: "1" };
      mockReq.usuarioId = 1;
      mockReq.usuario = { nivel: "admin" };

      ReviewService.prototype.delete = jest.fn().mockResolvedValue(true);

      await reviewController.delete(mockReq, mockRes, mockNext);

      expect(ReviewService.prototype.delete).toHaveBeenCalledWith("1", 1, true);
    });

    it("deveria passar erro para next", async () => {
      mockReq.params = { id: "1" };

      const error = new AppError("Permissão negada", 403);
      ReviewService.prototype.delete = jest.fn().mockRejectedValue(error);

      await reviewController.delete(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
