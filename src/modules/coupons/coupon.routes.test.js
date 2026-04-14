const request = require("supertest");
const app = require("../../app/app");
const CouponService = require("./coupon.service");

jest.mock("./coupon.service");

describe("Coupon Routes Integration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /api/coupons", () => {
    it("deveria criar um cupom", async () => {
      const mockCoupon = {
        id: 1,
        nome: "BLACK20",
        quantidade: 50,
        validade: "2026-12-31",
        valor_desc: 20,
      };

      CouponService.create.mockResolvedValue(mockCoupon);

      const response = await request(app)
        .post("/api/coupons")
        .send({
          nome: "BLACK20",
          quantidade: 50,
          validade: "2026-12-31",
          valor_desc: 20,
        });

      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockCoupon);
    });
  });

  describe("GET /api/coupons", () => {
    it("deveria retornar todos os cupons", async () => {
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

      CouponService.findAll.mockResolvedValue(mockCoupons);

      const response = await request(app).get("/api/coupons");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockCoupons);
      expect(CouponService.findAll).toHaveBeenCalled();
    });

    it("deveria retornar uma lista vazia quando não há cupons", async () => {
      CouponService.findAll.mockResolvedValue([]);

      const response = await request(app).get("/api/coupons");

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });
  });

  describe("GET /api/coupons/:id", () => {
    it("deveria retornar um cupom por ID", async () => {
      const mockCoupon = {
        id: 1,
        nome: "BLACK20",
        quantidade: 50,
        validade: "2026-12-31",
        valor_desc: 20,
      };

      CouponService.findById.mockResolvedValue(mockCoupon);

      const response = await request(app).get("/api/coupons/1");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockCoupon);
      expect(CouponService.findById).toHaveBeenCalledWith("1");
    });
  });

  describe("PUT /api/coupons/:id", () => {
    it("deveria atualizar um cupom", async () => {
      const mockCoupon = {
        id: 1,
        nome: "BLACKFRIDAY",
        quantidade: 100,
        validade: "2026-12-31",
        valor_desc: 50,
      };

      CouponService.update.mockResolvedValue(mockCoupon);

      const response = await request(app)
        .put("/api/coupons/1")
        .send({
          nome: "BLACKFRIDAY",
          quantidade: 100,
          validade: "2026-12-31",
          valor_desc: 50,
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockCoupon);
      expect(CouponService.update).toHaveBeenCalledWith("1", {
        nome: "BLACKFRIDAY",
        quantidade: 100,
        validade: "2026-12-31",
        valor_desc: 50,
      });
    });
  });

  describe("DELETE /api/coupons/:id", () => {
    it("deveria deletar um cupom", async () => {
      CouponService.delete.mockResolvedValue({
        mensagem: "Cupom deletado com sucesso",
      });

      const response = await request(app).delete("/api/coupons/1");

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        mensagem: "Cupom deletado com sucesso",
      });
      expect(CouponService.delete).toHaveBeenCalledWith("1");
    });
  });

  describe("POST /api/coupons/:id/validar", () => {
    it("deveria validar um cupom", async () => {
      const mockCoupon = {
        id: 1,
        nome: "BLACK20",
        quantidade: 50,
        validade: "2026-12-31",
        valor_desc: 20,
      };

      CouponService.validarCupom.mockResolvedValue(mockCoupon);

      const response = await request(app).post("/api/coupons/1/validar");

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ cupom: mockCoupon });
      expect(CouponService.validarCupom).toHaveBeenCalledWith("1");
    });
  });
});
