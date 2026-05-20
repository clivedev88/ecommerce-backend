const AppError = require("../../shared/errors/AppError");

// Mock do ReviewRepository
jest.mock("./review.repository");

const ReviewRepository = require("./review.repository");
const ReviewService = require("./review.service");

beforeEach(() => {
  jest.clearAllMocks();
});

describe("ReviewService", () => {
  let reviewService;
  let mockRepository;

  beforeEach(() => {
    mockRepository = {
      userHasPurchasedProduct: jest.fn(),
      findByProduct: jest.fn(),
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      findByUser: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    };
    
    ReviewRepository.mockImplementation(() => mockRepository);
    reviewService = new ReviewService();
  });

  describe("create", () => {
    it("deveria criar uma avaliação com sucesso", async () => {
      const data = {
        nota: 5,
        descricao: "Produto excelente!",
        usuario_id: 1,
        produto_id: 10
      };
      const mockReview = {
        id: 1,
        nota: 5,
        descricao: "Produto excelente!",
        usuario_id: 1,
        produto_id: 10,
        usuarios: { id: 1, nome: "João", email: "joao@test.com" },
        produtos: { id: 10, nome: "Produto", valor: "100" }
      };

      mockRepository.userHasPurchasedProduct.mockResolvedValue(true);
      mockRepository.findByProduct.mockResolvedValue([]);
      mockRepository.create.mockResolvedValue(mockReview);

      const result = await reviewService.create(data);

      expect(result).toEqual(mockReview);
      expect(mockRepository.create).toHaveBeenCalledWith({
        nota: 5,
        descricao: "Produto excelente!",
        usuario_id: 1,
        produto_id: 10
      });
    });

    it("deveria lançar erro quando nota não é fornecida", async () => {
      const data = {
        descricao: "Produto excelente!",
        usuario_id: 1,
        produto_id: 10
      };

      await expect(reviewService.create(data)).rejects.toThrow(
        new AppError("Nota é obrigatória", 400)
      );
    });

    it("deveria lançar erro quando usuario_id não é fornecido", async () => {
      const data = {
        nota: 5,
        descricao: "Produto excelente!",
        produto_id: 10
      };

      await expect(reviewService.create(data)).rejects.toThrow(
        new AppError("ID do usuário é obrigatório", 400)
      );
    });

    it("deveria lançar erro quando produto_id não é fornecido", async () => {
      const data = {
        nota: 5,
        descricao: "Produto excelente!",
        usuario_id: 1
      };

      await expect(reviewService.create(data)).rejects.toThrow(
        new AppError("ID do produto é obrigatório", 400)
      );
    });

    it("deveria lançar erro quando nota é maior que 5", async () => {
      const data = {
        nota: 6,
        descricao: "Produto excelente!",
        usuario_id: 1,
        produto_id: 10
      };

      await expect(reviewService.create(data)).rejects.toThrow(
        new AppError("Nota deve ser um número entre 1 e 5", 400)
      );
    });

    it("deveria lançar erro quando nota não é um número válido", async () => {
      const data = {
        nota: "abc",
        descricao: "Produto excelente!",
        usuario_id: 1,
        produto_id: 10
      };

      await expect(reviewService.create(data)).rejects.toThrow(
        new AppError("Nota deve ser um número entre 1 e 5", 400)
      );
    });

    it("deveria lançar erro quando usuário não comprou o produto", async () => {
      const data = {
        nota: 5,
        descricao: "Produto excelente!",
        usuario_id: 1,
        produto_id: 10
      };

      mockRepository.userHasPurchasedProduct.mockResolvedValue(false);

      await expect(reviewService.create(data)).rejects.toThrow(
        new AppError("Você só pode avaliar produtos que comprou", 403)
      );
    });

    it("deveria lançar erro quando usuário já avaliou o produto", async () => {
      const data = {
        nota: 4,
        descricao: "Produto bom",
        usuario_id: 1,
        produto_id: 10
      };

      const existingReview = {
        id: 5,
        nota: 5,
        descricao: "Produto excelente!",
        usuario_id: 1,
        produto_id: 10
      };

      mockRepository.userHasPurchasedProduct.mockResolvedValue(true);
      mockRepository.findByProduct.mockResolvedValue([existingReview]);

      await expect(reviewService.create(data)).rejects.toThrow(
        new AppError("Você já avaliou este produto", 400)
      );
    });

    it("deveria criar avaliação com descrição vazia se não fornecida", async () => {
      const data = {
        nota: 5,
        usuario_id: 1,
        produto_id: 10
      };
      const mockReview = {
        id: 1,
        nota: 5,
        descricao: "",
        usuario_id: 1,
        produto_id: 10
      };

      mockRepository.userHasPurchasedProduct.mockResolvedValue(true);
      mockRepository.findByProduct.mockResolvedValue([]);
      mockRepository.create.mockResolvedValue(mockReview);

      const result = await reviewService.create(data);

      expect(mockRepository.create).toHaveBeenCalledWith({
        nota: 5,
        descricao: "",
        usuario_id: 1,
        produto_id: 10
      });
    });
  });

  describe("findAll", () => {
    it("deveria retornar todas as avaliações", async () => {
      const mockReviews = [
        {
          id: 1,
          nota: 5,
          descricao: "Excelente",
          usuario_id: 1,
          produto_id: 10
        },
        {
          id: 2,
          nota: 4,
          descricao: "Bom",
          usuario_id: 2,
          produto_id: 10
        }
      ];

      mockRepository.findAll.mockResolvedValue(mockReviews);

      const result = await reviewService.findAll();

      expect(result).toEqual(mockReviews);
      expect(mockRepository.findAll).toHaveBeenCalled();
    });

    it("deveria retornar lista vazia quando não há avaliações", async () => {
      mockRepository.findAll.mockResolvedValue([]);

      const result = await reviewService.findAll();

      expect(result).toEqual([]);
    });
  });

  describe("findById", () => {
    it("deveria retornar uma avaliação por ID", async () => {
      const mockReview = {
        id: 1,
        nota: 5,
        descricao: "Excelente",
        usuario_id: 1,
        produto_id: 10,
        usuarios: { id: 1, nome: "João", email: "joao@test.com" },
        produtos: { id: 10, nome: "Produto", valor: "100" }
      };

      mockRepository.findById.mockResolvedValue(mockReview);

      const result = await reviewService.findById(1);

      expect(result).toEqual(mockReview);
      expect(mockRepository.findById).toHaveBeenCalledWith(1);
    });

    it("deveria lançar erro quando avaliação não existe", async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(reviewService.findById(99999)).rejects.toThrow(
        new AppError("Avaliação não encontrada", 404)
      );
    });
  });

  describe("findByProduct", () => {
    it("deveria retornar avaliações com média calculada", async () => {
      const mockReviews = [
        { id: 1, nota: 5, descricao: "Excelente", usuario_id: 1, produto_id: 10 },
        { id: 2, nota: 4, descricao: "Bom", usuario_id: 2, produto_id: 10 },
        { id: 3, nota: 3, descricao: "OK", usuario_id: 3, produto_id: 10 }
      ];

      mockRepository.findByProduct.mockResolvedValue(mockReviews);

      const result = await reviewService.findByProduct(10);

      expect(result.total_avaliacoes).toBe(3);
      expect(result.media_avaliacoes).toBe("4.0");
      expect(result.avaliacoes).toEqual(mockReviews);
    });

    it("deveria retornar média 0 quando não há avaliações", async () => {
      mockRepository.findByProduct.mockResolvedValue([]);

      const result = await reviewService.findByProduct(10);

      expect(result.total_avaliacoes).toBe(0);
      expect(result.media_avaliacoes).toBe("0.0");
      expect(result.avaliacoes).toEqual([]);
    });

    it("deveria calcular média corretamente", async () => {
      const mockReviews = [
        { id: 1, nota: 5, descricao: "Excelente", usuario_id: 1, produto_id: 10 },
        { id: 2, nota: 5, descricao: "Excelente", usuario_id: 2, produto_id: 10 }
      ];

      mockRepository.findByProduct.mockResolvedValue(mockReviews);

      const result = await reviewService.findByProduct(10);

      expect(result.media_avaliacoes).toBe("5.0");
    });
  });

  describe("findByUser", () => {
    it("deveria retornar avaliações do usuário", async () => {
      const mockReviews = [
        { id: 1, nota: 5, descricao: "Excelente", usuario_id: 1, produto_id: 10 },
        { id: 2, nota: 4, descricao: "Bom", usuario_id: 1, produto_id: 20 }
      ];

      mockRepository.findByUser.mockResolvedValue(mockReviews);

      const result = await reviewService.findByUser(1);

      expect(result.total_avaliacoes).toBe(2);
      expect(result.avaliacoes).toEqual(mockReviews);
    });

    it("deveria retornar lista vazia para usuário sem avaliações", async () => {
      mockRepository.findByUser.mockResolvedValue([]);

      const result = await reviewService.findByUser(1);

      expect(result.total_avaliacoes).toBe(0);
      expect(result.avaliacoes).toEqual([]);
    });
  });

  describe("update", () => {
    it("deveria atualizar avaliação própria", async () => {
      const existingReview = {
        id: 1,
        nota: 5,
        descricao: "Excelente",
        usuario_id: 1,
        produto_id: 10
      };
      const updatedReview = {
        ...existingReview,
        nota: 4,
        descricao: "Muito bom"
      };

      mockRepository.findById.mockResolvedValue(existingReview);
      mockRepository.update.mockResolvedValue(updatedReview);

      const result = await reviewService.update(1, { nota: 4, descricao: "Muito bom" }, 1, false);

      expect(result).toEqual(updatedReview);
      expect(mockRepository.update).toHaveBeenCalledWith(1, {
        nota: 4,
        descricao: "Muito bom"
      });
    });

    it("deveria bloquear atualização de avaliação de outro usuário", async () => {
      const existingReview = {
        id: 1,
        nota: 5,
        descricao: "Excelente",
        usuario_id: 1,
        produto_id: 10
      };

      mockRepository.findById.mockResolvedValue(existingReview);

      await expect(
        reviewService.update(1, { nota: 4 }, 2, false)
      ).rejects.toThrow(
        new AppError("Você só pode editar suas próprias avaliações", 403)
      );
    });

    it("deveria permitir admin atualizar avaliação de outro usuário", async () => {
      const existingReview = {
        id: 1,
        nota: 5,
        descricao: "Excelente",
        usuario_id: 1,
        produto_id: 10
      };
      const updatedReview = { ...existingReview, nota: 3 };

      mockRepository.findById.mockResolvedValue(existingReview);
      mockRepository.update.mockResolvedValue(updatedReview);

      const result = await reviewService.update(1, { nota: 3 }, 2, true);

      expect(result).toEqual(updatedReview);
    });

    it("deveria validar nota ao atualizar", async () => {
      const existingReview = {
        id: 1,
        nota: 5,
        usuario_id: 1,
        produto_id: 10
      };

      mockRepository.findById.mockResolvedValue(existingReview);

      await expect(
        reviewService.update(1, { nota: 10 }, 1, false)
      ).rejects.toThrow(
        new AppError("Nota deve ser um número entre 1 e 5", 400)
      );
    });

    it("deveria permitir atualizar apenas descrição", async () => {
      const existingReview = {
        id: 1,
        nota: 5,
        descricao: "Excelente",
        usuario_id: 1,
        produto_id: 10
      };
      const updatedReview = {
        ...existingReview,
        descricao: "Muito excelente!"
      };

      mockRepository.findById.mockResolvedValue(existingReview);
      mockRepository.update.mockResolvedValue(updatedReview);

      const result = await reviewService.update(1, { descricao: "Muito excelente!" }, 1, false);

      expect(result).toEqual(updatedReview);
    });
  });

  describe("delete", () => {
    it("deveria deletar avaliação própria", async () => {
      const existingReview = {
        id: 1,
        nota: 5,
        usuario_id: 1,
        produto_id: 10
      };

      mockRepository.findById.mockResolvedValue(existingReview);
      mockRepository.delete.mockResolvedValue(true);

      const result = await reviewService.delete(1, 1, false);

      expect(result).toBe(true);
      expect(mockRepository.delete).toHaveBeenCalledWith(1);
    });

    it("deveria bloquear deleção de avaliação de outro usuário", async () => {
      const existingReview = {
        id: 1,
        nota: 5,
        usuario_id: 1,
        produto_id: 10
      };

      mockRepository.findById.mockResolvedValue(existingReview);

      await expect(
        reviewService.delete(1, 2, false)
      ).rejects.toThrow(
        new AppError("Você só pode deletar suas próprias avaliações", 403)
      );
    });

    it("deveria permitir admin deletar avaliação de outro usuário", async () => {
      const existingReview = {
        id: 1,
        nota: 5,
        usuario_id: 1,
        produto_id: 10
      };

      mockRepository.findById.mockResolvedValue(existingReview);
      mockRepository.delete.mockResolvedValue(true);

      const result = await reviewService.delete(1, 2, true);

      expect(result).toBe(true);
    });

    it("deveria lançar erro ao tentar deletar avaliação inexistente", async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(
        reviewService.delete(99999, 1, false)
      ).rejects.toThrow(
        new AppError("Avaliação não encontrada", 404)
      );
    });
  });
});
