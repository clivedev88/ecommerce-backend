const CategoryController = require("./category.controller");
const CategoryService = require("./category.service");

jest.mock("./category.service");

describe("CategoryController CRUD operations", () => {
    let req, res;

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
        jest.clearAllMocks();
    });

    describe("create", () => {
        it("deveria criar uma categoria com sucesso", async () => {
            const mockCategory = { id: 1, nome: "Nova Categoria" };
            req.body = { nome: "Nova Categoria" };

            CategoryService.create.mockResolvedValue(mockCategory);

            await CategoryController.create(req, res);

            expect(CategoryService.create).toHaveBeenCalledWith(req.body);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(mockCategory);
        });

        it("deveria retornar erro 400 ao falhar na criação", async () => {
            req.body = { nome: "Nova Categoria" };
            const error = new Error("Erro ao criar categoria");

            CategoryService.create.mockRejectedValue(error);

            await CategoryController.create(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: error.message });
        });
    });

    describe("findAll", () => {
        it("deveria retornar todas as categorias", async () => {
            const mockCategories = [
                { id: 1, nome: "Categoria 1" },
                { id: 2, nome: "Categoria 2" },
            ];

            CategoryService.findAll.mockResolvedValue(mockCategories);

            await CategoryController.findAll(req, res);

            expect(CategoryService.findAll).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledWith(mockCategories);
        });

        it("deveria retornar erro 500 ao falhar na busca", async () => {
            const error = new Error("Erro ao buscar categorias");

            CategoryService.findAll.mockRejectedValue(error);

            await CategoryController.findAll(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: error.message });
        });
    });

    describe("findById", () => {
        it("deveria retornar uma categoria por ID", async () => {
            const mockCategory = { id: 1, nome: "Categoria 1" };
            req.params.id = "1";

            CategoryService.findById.mockResolvedValue(mockCategory);

            await CategoryController.findById(req, res);

            expect(CategoryService.findById).toHaveBeenCalledWith("1");
            expect(res.json).toHaveBeenCalledWith(mockCategory);
        });

        it("deveria retornar 404 quando categoria não existe", async () => {
            req.params.id = "99999";

            CategoryService.findById.mockResolvedValue(null);

            await CategoryController.findById(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                error: "Categoria não encontrada",
            });
        });

        it("deveria retornar erro 500 ao falhar na busca", async () => {
            req.params.id = "1";
            const error = new Error("Erro ao buscarcategoria");

            CategoryService.findById.mockRejectedValue(error);

            await CategoryController.findById(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: error.message });
        });
    });

    describe("update", () => {
        it("deveria atualizar uma categoria", async () => {
            const mockCategory = { id: 1, nome: "Categoria Atualizada" };
            req.params.id = "1";
            req.body = { nome: "Categoria Atualizada" };

            CategoryService.update.mockResolvedValue(mockCategory);

            await CategoryController.update(req, res);

            expect(CategoryService.update).toHaveBeenCalledWith("1", req.body);
            expect(res.json).toHaveBeenCalledWith(mockCategory);
        });

        it("deveria retornar erro 404 ao atualizar categoria inexistente", async () => {
            req.params.id = "99999";
            req.body = { nome: "Categoria Atualizada" };
            const error = new Error("Categoria não encontrada");

            CategoryService.update.mockRejectedValue(error);

            await CategoryController.update(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: error.message });
        });
    });

    describe("delete", () => {
        it("deveria deletar uma categoria", async () => {
            req.params.id = "1";

            CategoryService.delete.mockResolvedValue({});

            await CategoryController.delete(req, res);

            expect(CategoryService.delete).toHaveBeenCalledWith("1");
            expect(res.status).toHaveBeenCalledWith(204);
            expect(res.send).toHaveBeenCalled();
        });

        it("deveria retornar erro 400 ao falhar na exclusão", async () => {
            req.params.id = "1";
            const error = new Error("Erro ao deletar categoria");

            CategoryService.delete.mockRejectedValue(error);

            await CategoryController.delete(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: error.message });
        });
    });
});
