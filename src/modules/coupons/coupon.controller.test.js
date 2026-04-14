const CouponController = require("./coupon.controller");
const CouponService = require("./coupon.service");
const AppError = require("../../shared/errors/AppError");

jest.mock("./coupon.service");

describe("CouponController CRUD operations", () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            body: {},
            params: {},
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };
        next = jest.fn();
        jest.clearAllMocks();
    });

    describe("create", () => {
        it("deveria criar um cupom com sucesso", async () => {
            const mockCoupon = {
                id: 1,
                nome: "BLACK20",
                quantidade: 50,
                validade: "2026-12-31",
                valor_desc: 20,
            };
            req.body = {
                nome: "BLACK20",
                quantidade: 50,
                validade: "2026-12-31",
                valor_desc: 20,
            };

            CouponService.create.mockResolvedValue(mockCoupon);

            await CouponController.create(req, res, next);

            expect(CouponService.create).toHaveBeenCalledWith(req.body);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(mockCoupon);
        });

        it("deveria retornar erro 400 quando campo obrigatório está faltando", async () => {
            req.body = {
                nome: "BLACK20",
                quantidade: 50,
                // falta validade e valor_desc
            };

            await CouponController.create(req, res, next);

            expect(next).toHaveBeenCalled();
            const callArg = next.mock.calls[0][0];
            expect(callArg.message).toBe("Todos os campos são obrigatórios");
            expect(callArg.status).toBe(400);
        });

        it("deveria chamar next com erro ao falhar na criação", async () => {
            req.body = {
                nome: "BLACK20",
                quantidade: 50,
                validade: "2026-12-31",
                valor_desc: 20,
            };
            const error = new Error("Erro ao criar cupom");

            CouponService.create.mockRejectedValue(error);

            await CouponController.create(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe("findAll", () => {
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

            await CouponController.findAll(req, res, next);

            expect(CouponService.findAll).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledWith(mockCoupons);
        });

        it("deveria chamar next com erro ao falhar na busca", async () => {
            const error = new Error("Erro ao buscar cupons");

            CouponService.findAll.mockRejectedValue(error);

            await CouponController.findAll(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
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
            };
            req.params.id = "1";

            CouponService.findById.mockResolvedValue(mockCoupon);

            await CouponController.findById(req, res, next);

            expect(CouponService.findById).toHaveBeenCalledWith("1");
            expect(res.json).toHaveBeenCalledWith(mockCoupon);
        });

        it("deveria chamar next com erro quando cupom não existe", async () => {
            req.params.id = "99999";
            const error = new AppError("Cupom não encontrado", 404);

            CouponService.findById.mockRejectedValue(error);

            await CouponController.findById(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe("update", () => {
        it("deveria atualizar um cupom", async () => {
            const mockCoupon = {
                id: 1,
                nome: "BLACKFRIDAY",
                quantidade: 100,
                validade: "2026-12-31",
                valor_desc: 50,
            };
            req.params.id = "1";
            req.body = {
                nome: "BLACKFRIDAY",
                quantidade: 100,
                validade: "2026-12-31",
                valor_desc: 50,
            };

            CouponService.update.mockResolvedValue(mockCoupon);

            await CouponController.update(req, res, next);

            expect(CouponService.update).toHaveBeenCalledWith("1", req.body);
            expect(res.json).toHaveBeenCalledWith(mockCoupon);
        });

        it("deveria chamar next com erro ao atualizar cupom inexistente", async () => {
            req.params.id = "99999";
            req.body = { nome: "BLACKFRIDAY" };
            const error = new AppError("Cupom não encontrado", 404);

            CouponService.update.mockRejectedValue(error);

            await CouponController.update(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe("delete", () => {
        it("deveria deletar um cupom", async () => {
            req.params.id = "1";

            CouponService.delete.mockResolvedValue({
                mensagem: "Cupom deletado com sucesso",
            });

            await CouponController.delete(req, res, next);

            expect(CouponService.delete).toHaveBeenCalledWith("1");
            expect(res.json).toHaveBeenCalledWith({
                mensagem: "Cupom deletado com sucesso",
            });
        });

        it("deveria chamar next com erro ao deletar cupom inexistente", async () => {
            req.params.id = "99999";
            const error = new AppError("Cupom não encontrado", 404);

            CouponService.delete.mockRejectedValue(error);

            await CouponController.delete(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe("validar", () => {
        it("deveria validar um cupom válido", async () => {
            const mockCoupon = {
                id: 1,
                nome: "BLACK20",
                quantidade: 50,
                validade: "2026-12-31",
                valor_desc: 20,
            };
            req.params.id = "1";

            CouponService.validarCupom.mockResolvedValue(mockCoupon);

            await CouponController.validar(req, res, next);

            expect(CouponService.validarCupom).toHaveBeenCalledWith("1");
            expect(res.json).toHaveBeenCalledWith({ cupom: mockCoupon });
        });

        it("deveria chamar next com erro ao validar cupom expirado", async () => {
            req.params.id = "1";
            const error = new AppError("Cupom expirado", 409);

            CouponService.validarCupom.mockRejectedValue(error);

            await CouponController.validar(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });
});
