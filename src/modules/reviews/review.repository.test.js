const prisma = require("../../database/prisma");
const ReviewRepository = require("./review.repository");
const serialize = require("../../shared/utils/serialize");

jest.mock("../../database/prisma", () => ({
  avaliacoes: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  pedidos: {
    findFirst: jest.fn(),
  },
  $disconnect: jest.fn(),
}));

jest.mock("../../shared/utils/serialize", () => jest.fn((data) => data));

afterAll(async () => {
  await prisma.$disconnect();
});

beforeEach(() => {
  jest.clearAllMocks();
});

describe("ReviewRepository", () => {
  let reviewRepository;

  beforeEach(() => {
    reviewRepository = new ReviewRepository();
  });

  describe("create", () => {
    it("deveria criar uma avaliação", async () => {
      const data = {
        nota: 5,
        descricao: "Produto excelente!",
        usuario_id: "1",
        produto_id: "10"
      };

      const mockReview = {
        id: 1,
        nota: 5n,
        descricao: "Produto excelente!",
        usuario_id: 1,
        produto_id: 10,
        usuarios: { id: 1, nome: "João", email: "joao@test.com" },
        produtos: { id: 10, nome: "Produto", valor: "100" }
      };

      prisma.avaliacoes.create.mockResolvedValue(mockReview);

      const result = await reviewRepository.create(data);

      expect(prisma.avaliacoes.create).toHaveBeenCalledWith({
        data: {
          nota: BigInt(5),
          descricao: "Produto excelente!",
          usuario_id: 1,
          produto_id: 10
        },
        include: {
          usuarios: { select: { id: true, nome: true, email: true } },
          produtos: { select: { id: true, nome: true, valor: true } }
        }
      });
      expect(serialize).toHaveBeenCalledWith(mockReview);
    });

    it("deveria converter nota para BigInt", async () => {
      const data = {
        nota: "4",
        descricao: "Bom",
        usuario_id: "2",
        produto_id: "20"
      };

      prisma.avaliacoes.create.mockResolvedValue({});

      await reviewRepository.create(data);

      expect(prisma.avaliacoes.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            nota: BigInt(4)
          })
        })
      );
    });

    it("deveria converter usuario_id e produto_id para int", async () => {
      const data = {
        nota: 5,
        descricao: "Excelente",
        usuario_id: "1",
        produto_id: "10"
      };

      prisma.avaliacoes.create.mockResolvedValue({});

      await reviewRepository.create(data);

      expect(prisma.avaliacoes.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            usuario_id: 1,
            produto_id: 10
          })
        })
      );
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
          produto_id: 10,
          usuarios: { id: 1, nome: "João", email: "joao@test.com" },
          produtos: { id: 10, nome: "Produto", valor: "100" }
        },
        {
          id: 2,
          nota: 4,
          descricao: "Bom",
          usuario_id: 2,
          produto_id: 10,
          usuarios: { id: 2, nome: "Maria", email: "maria@test.com" },
          produtos: { id: 10, nome: "Produto", valor: "100" }
        }
      ];

      prisma.avaliacoes.findMany.mockResolvedValue(mockReviews);

      const result = await reviewRepository.findAll();

      expect(prisma.avaliacoes.findMany).toHaveBeenCalledWith({
        include: {
          usuarios: { select: { id: true, nome: true, email: true } },
          produtos: { select: { id: true, nome: true, valor: true } }
        },
        orderBy: { id: "desc" }
      });
      expect(result).toEqual(mockReviews);
    });

    it("deveria retornar lista vazia quando não há avaliações", async () => {
      prisma.avaliacoes.findMany.mockResolvedValue([]);

      const result = await reviewRepository.findAll();

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

      prisma.avaliacoes.findUnique.mockResolvedValue(mockReview);

      const result = await reviewRepository.findById(1);

      expect(prisma.avaliacoes.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: {
          usuarios: { select: { id: true, nome: true, email: true } },
          produtos: { select: { id: true, nome: true, valor: true } }
        }
      });
      expect(result).toEqual(mockReview);
    });

    it("deveria converter id para int", async () => {
      prisma.avaliacoes.findUnique.mockResolvedValue(null);

      await reviewRepository.findById("1");

      expect(prisma.avaliacoes.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 1 }
        })
      );
    });

    it("deveria retornar null quando avaliação não existe", async () => {
      prisma.avaliacoes.findUnique.mockResolvedValue(null);

      const result = await reviewRepository.findById(99999);

      expect(result).toBeNull();
    });
  });

  describe("findByProduct", () => {
    it("deveria retornar avaliações do produto", async () => {
      const mockReviews = [
        { id: 1, nota: 5, descricao: "Excelente", usuario_id: 1, produto_id: 10 },
        { id: 2, nota: 4, descricao: "Bom", usuario_id: 2, produto_id: 10 }
      ];

      prisma.avaliacoes.findMany.mockResolvedValue(mockReviews);

      const result = await reviewRepository.findByProduct(10);

      expect(prisma.avaliacoes.findMany).toHaveBeenCalledWith({
        where: { produto_id: 10 },
        include: {
          usuarios: { select: { id: true, nome: true, email: true } }
        },
        orderBy: { id: "desc" }
      });
      expect(result).toEqual(mockReviews);
    });

    it("deveria converter productId para int", async () => {
      prisma.avaliacoes.findMany.mockResolvedValue([]);

      await reviewRepository.findByProduct("10");

      expect(prisma.avaliacoes.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { produto_id: 10 }
        })
      );
    });

    it("deveria retornar lista vazia quando produto não tem avaliações", async () => {
      prisma.avaliacoes.findMany.mockResolvedValue([]);

      const result = await reviewRepository.findByProduct(10);

      expect(result).toEqual([]);
    });
  });

  describe("findByUser", () => {
    it("deveria retornar avaliações do usuário", async () => {
      const mockReviews = [
        { id: 1, nota: 5, descricao: "Excelente", usuario_id: 1, produto_id: 10 },
        { id: 2, nota: 4, descricao: "Bom", usuario_id: 1, produto_id: 20 }
      ];

      prisma.avaliacoes.findMany.mockResolvedValue(mockReviews);

      const result = await reviewRepository.findByUser(1);

      expect(prisma.avaliacoes.findMany).toHaveBeenCalledWith({
        where: { usuario_id: 1 },
        include: {
          produtos: { select: { id: true, nome: true, valor: true } }
        },
        orderBy: { id: "desc" }
      });
      expect(result).toEqual(mockReviews);
    });

    it("deveria converter userId para int", async () => {
      prisma.avaliacoes.findMany.mockResolvedValue([]);

      await reviewRepository.findByUser("1");

      expect(prisma.avaliacoes.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { usuario_id: 1 }
        })
      );
    });

    it("deveria retornar lista vazia quando usuário não tem avaliações", async () => {
      prisma.avaliacoes.findMany.mockResolvedValue([]);

      const result = await reviewRepository.findByUser(1);

      expect(result).toEqual([]);
    });
  });

  describe("update", () => {
    it("deveria atualizar nota e descrição", async () => {
      const data = { nota: 4, descricao: "Muito bom" };
      const mockUpdated = {
        id: 1,
        nota: 4n,
        descricao: "Muito bom",
        usuario_id: 1,
        produto_id: 10
      };

      prisma.avaliacoes.update.mockResolvedValue(mockUpdated);

      const result = await reviewRepository.update(1, data);

      expect(prisma.avaliacoes.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          nota: BigInt(4),
          descricao: "Muito bom"
        },
        include: {
          usuarios: { select: { id: true, nome: true, email: true } },
          produtos: { select: { id: true, nome: true, valor: true } }
        }
      });
    });

    it("deveria atualizar apenas nota", async () => {
      const data = { nota: 3 };

      prisma.avaliacoes.update.mockResolvedValue({});

      await reviewRepository.update(1, data);

      expect(prisma.avaliacoes.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: {
            nota: BigInt(3)
          }
        })
      );
    });

    it("deveria atualizar apenas descrição", async () => {
      const data = { descricao: "Descrição atualizada" };

      prisma.avaliacoes.update.mockResolvedValue({});

      await reviewRepository.update(1, data);

      expect(prisma.avaliacoes.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: {
            descricao: "Descrição atualizada"
          }
        })
      );
    });

    it("deveria ignorar campos undefined", async () => {
      const data = { nota: 5, descricao: undefined };

      prisma.avaliacoes.update.mockResolvedValue({});

      await reviewRepository.update(1, data);

      expect(prisma.avaliacoes.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: {
            nota: BigInt(5)
          }
        })
      );
    });

    it("deveria converter id para int", async () => {
      prisma.avaliacoes.update.mockResolvedValue({});

      await reviewRepository.update("1", { nota: 5 });

      expect(prisma.avaliacoes.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 1 }
        })
      );
    });
  });

  describe("delete", () => {
    it("deveria deletar uma avaliação", async () => {
      const mockDeleted = {
        id: 1,
        nota: 5,
        descricao: "Excelente",
        usuario_id: 1,
        produto_id: 10
      };

      prisma.avaliacoes.delete.mockResolvedValue(mockDeleted);

      const result = await reviewRepository.delete(1);

      expect(prisma.avaliacoes.delete).toHaveBeenCalledWith({
        where: { id: 1 }
      });
      expect(result).toEqual(mockDeleted);
    });

    it("deveria converter id para int", async () => {
      prisma.avaliacoes.delete.mockResolvedValue({});

      await reviewRepository.delete("1");

      expect(prisma.avaliacoes.delete).toHaveBeenCalledWith({
        where: { id: 1 }
      });
    });
  });

  describe("userHasPurchasedProduct", () => {
    it("deveria retornar true quando usuário comprou o produto", async () => {
      const mockOrder = {
        id: 1,
        usuario_id: 1,
        status: "entregue"
      };

      prisma.pedidos.findFirst.mockResolvedValue(mockOrder);

      const result = await reviewRepository.userHasPurchasedProduct(1, 10);

      expect(prisma.pedidos.findFirst).toHaveBeenCalledWith({
        where: {
          usuario_id: 1,
          status: { in: ["entregue", "pago", "enviado"] },
          pedido_produto: {
            some: {
              id_produto: 10
            }
          }
        }
      });
      expect(result).toBe(true);
    });

    it("deveria retornar false quando usuário não comprou o produto", async () => {
      prisma.pedidos.findFirst.mockResolvedValue(null);

      const result = await reviewRepository.userHasPurchasedProduct(1, 10);

      expect(result).toBe(false);
    });

    it("deveria aceitar apenas status específicos", async () => {
      prisma.pedidos.findFirst.mockResolvedValue(null);

      await reviewRepository.userHasPurchasedProduct(1, 10);

      const call = prisma.pedidos.findFirst.mock.calls[0][0];
      expect(call.where.status.in).toEqual(["entregue", "pago", "enviado"]);
    });

    it("deveria converter userId e productId para int", async () => {
      prisma.pedidos.findFirst.mockResolvedValue(null);

      await reviewRepository.userHasPurchasedProduct("1", "10");

      expect(prisma.pedidos.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            usuario_id: 1,
            pedido_produto: {
              some: {
                id_produto: 10
              }
            }
          })
        })
      );
    });

    it("deveria retornar true para múltiplos status válidos", async () => {
      const mockOrder = { id: 1, status: "pago" };
      prisma.pedidos.findFirst.mockResolvedValue(mockOrder);

      const result = await reviewRepository.userHasPurchasedProduct(1, 10);

      expect(result).toBe(true);
    });

    it("deveria retornar false para status inválido", async () => {
      prisma.pedidos.findFirst.mockResolvedValue(null);

      const result = await reviewRepository.userHasPurchasedProduct(1, 10);

      expect(result).toBe(false);
    });
  });
});
