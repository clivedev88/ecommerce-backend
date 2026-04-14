const prisma = require("../../database/prisma");
const CouponService = require("./coupon.service");
const AppError = require("../../shared/errors/AppError");

jest.mock("../../database/prisma", () => ({
  cupons: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  $disconnect: jest.fn(),
}));

afterAll(async () => {
  await prisma.$disconnect();
});

beforeEach(() => {
  jest.clearAllMocks();
});

describe("CouponService CRUD operations", () => {
  describe("create", () => {
    it("deveria criar um cupom com sucesso", async () => {
      const data = {
        nome: "BLACK20",
        quantidade: 50,
        validade: "2026-12-31",
        valor_desc: 20,
      };
      const mockCoupon = {
        id: 1,
        nome: "BLACK20",
        quantidade: 50,
        validade: "2026-12-31",
        valor_desc: 20,
      };

      prisma.cupons.create.mockResolvedValue(mockCoupon);

      const result = await CouponService.create(data);

      expect(prisma.cupons.create).toHaveBeenCalledWith({
        data: {
          nome: "BLACK20",
          quantidade: 50,
          validade: new Date("2026-12-31"),
          valor_desc: 20,
        },
      });
      expect(result).toHaveProperty("id");
      expect(result.nome).toBe("BLACK20");
    });
  });

  describe("findAll", () => {
    it("deveria retornar uma lista de cupons ordenados por validade", async () => {
      const mockCoupons = [
        {
          id: 1,
          nome: "BLACK20",
          quantidade: 50,
          validade: "2026-12-31",
          valor_desc: 20,
        },
        {
          id: 2,
          nome: "SUMMER30",
          quantidade: 30,
          validade: "2026-12-25",
          valor_desc: 30,
        },
      ];

      prisma.cupons.findMany.mockResolvedValue(mockCoupons);

      const result = await CouponService.findAll();

      expect(prisma.cupons.findMany).toHaveBeenCalledWith({
        orderBy: { validade: "asc" },
      });
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(2);
    });

    it("deveria retornar uma lista vazia quando não há cupons", async () => {
      prisma.cupons.findMany.mockResolvedValue([]);

      const result = await CouponService.findAll();

      expect(result).toEqual([]);
    });
  });

  describe("findById", () => {
    it("deveria retornar um cupom por ID", async () => {
      const mockCoupon = {
        id: 1,
        nome: "BLACK20",
        quantidade: 50,
        validade: "2026-12-31",
        valor_desc: 20,
        pedidos: [],
      };

      prisma.cupons.findUnique.mockResolvedValue(mockCoupon);

      const result = await CouponService.findById(1);

      expect(prisma.cupons.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: { pedidos: true },
      });
      expect(result.id).toBe(1);
      expect(result.nome).toBe("BLACK20");
    });

    it("deveria lançar erro quando cupom não existe", async () => {
      prisma.cupons.findUnique.mockResolvedValue(null);

      await expect(CouponService.findById(99999)).rejects.toThrow(
        new AppError("Cupom não encontrado", 404)
      );
    });
  });

  describe("update", () => {
    it("deveria atualizar um cupom existente", async () => {
      const data = {
        nome: "BLACKFRIDAY",
        quantidade: 100,
        validade: "2026-12-31",
        valor_desc: 50,
      };
      const mockCoupon = {
        id: 1,
        ...data,
      };

      prisma.cupons.findUnique.mockResolvedValue(mockCoupon);
      prisma.cupons.update.mockResolvedValue(mockCoupon);

      const result = await CouponService.update(1, data);

      expect(prisma.cupons.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(prisma.cupons.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          nome: "BLACKFRIDAY",
          quantidade: 100,
          validade: new Date("2026-12-31"),
          valor_desc: 50,
        },
      });
      expect(result.nome).toBe("BLACKFRIDAY");
    });

    it("deveria lançar erro ao atualizar cupom inexistente", async () => {
      const data = {
        nome: "BLACKFRIDAY",
        quantidade: 100,
        validade: "2026-12-31",
        valor_desc: 50,
      };

      prisma.cupons.findUnique.mockResolvedValue(null);

      await expect(CouponService.update(99999, data)).rejects.toThrow(
        new AppError("Cupom não encontrado", 404)
      );
    });
  });

  describe("delete", () => {
    it("deveria deletar um cupom", async () => {
      const mockCoupon = {
        id: 1,
        nome: "BLACK20",
        quantidade: 50,
        validade: "2026-12-31",
        valor_desc: 20,
      };

      prisma.cupons.findUnique.mockResolvedValue(mockCoupon);
      prisma.cupons.delete.mockResolvedValue(mockCoupon);

      const result = await CouponService.delete(1);

      expect(prisma.cupons.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(prisma.cupons.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result.mensagem).toBe("Cupom deletado com sucesso");
    });

    it("deveria lançar erro ao deletar cupom inexistente", async () => {
      prisma.cupons.findUnique.mockResolvedValue(null);

      await expect(CouponService.delete(99999)).rejects.toThrow(
        new AppError("Cupom não encontrado", 404)
      );
    });
  });

  describe("validarCupom", () => {
    it("deveria validar um cupom válido", async () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 30);

      const mockCoupon = {
        id: 1,
        nome: "BLACK20",
        quantidade: 50,
        validade: futureDate.toISOString().split("T")[0],
        valor_desc: 20,
      };

      prisma.cupons.findUnique.mockResolvedValue(mockCoupon);

      const result = await CouponService.validarCupom(1);

      expect(result.nome).toBe("BLACK20");
      expect(result.quantidade).toBe(50);
    });

    it("deveria lançar erro quando cupom não existe", async () => {
      prisma.cupons.findUnique.mockResolvedValue(null);

      await expect(CouponService.validarCupom(99999)).rejects.toThrow(
        new AppError("Cupom não encontrado", 404)
      );
    });

    it("deveria lançar erro quando cupom está esgotado", async () => {
      const mockCoupon = {
        id: 1,
        nome: "BLACK20",
        quantidade: 0,
        validade: "2026-12-31",
        valor_desc: 20,
      };

      prisma.cupons.findUnique.mockResolvedValue(mockCoupon);

      await expect(CouponService.validarCupom(1)).rejects.toThrow(
        new AppError("Cupom esgotado", 409)
      );
    });

    it("deveria lançar erro quando cupom está expirado", async () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);

      const mockCoupon = {
        id: 1,
        nome: "BLACK20",
        quantidade: 50,
        validade: pastDate.toISOString().split("T")[0],
        valor_desc: 20,
      };

      prisma.cupons.findUnique.mockResolvedValue(mockCoupon);

      await expect(CouponService.validarCupom(1)).rejects.toThrow(
        new AppError("Cupom expirado", 409)
      );
    });
  });
});
