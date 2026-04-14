const request = require("supertest");
const app = require("../../app/app");
const CategoryService = require("./category.service");

// Mock the CategoryService
jest.mock("./category.service");

describe("Category Routes Integration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /api/categories", () => {
    it("deveria criar uma categoria", async () => {
      const mockCategory = { id: 1, nome: "Nova Categoria" };
      CategoryService.create.mockResolvedValue(mockCategory);

      const response = await request(app)
        .post("/api/categories")
        .send({ nome: "Nova Categoria" });

      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockCategory);
      expect(CategoryService.create).toHaveBeenCalledWith({ nome: "Nova Categoria" });
    });
  });

  describe("GET /api/categories", () => {
    it("deveria retornar todas as categorias", async () => {
      const mockCategories = [
        { id: 1, nome: "Categoria 1", produtos: [] },
        { id: 2, nome: "Categoria 2", produtos: [] },
      ];
      CategoryService.findAll.mockResolvedValue(mockCategories);

      const response = await request(app)
        .get("/api/categories");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockCategories);
    });
  });

  describe("GET /api/categories/:id", () => {
    it("deveria retornar uma categoria por ID", async () => {
      const mockCategory = { id: 1, nome: "Categoria 1", produtos: [] };
      CategoryService.findById.mockResolvedValue(mockCategory);

      const response = await request(app)
        .get("/api/categories/1");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockCategory);
      expect(CategoryService.findById).toHaveBeenCalledWith("1");
    });

    it("deveria retornar 404 quando categoria não existe", async () => {
      CategoryService.findById.mockResolvedValue(null);

      const response = await request(app)
        .get("/api/categories/99999");

      expect(response.status).toBe(404);
      expect(response.body.error).toBe("Categoria não encontrada");
    });
  });

  describe("PUT /api/categories/:id", () => {
    it("deveria atualizar uma categoria", async () => {
      const mockCategory = { id: 1, nome: "Categoria Atualizada", produtos: [] };
      CategoryService.update.mockResolvedValue(mockCategory);

      const response = await request(app)
        .put("/api/categories/1")
        .send({ nome: "Categoria Atualizada" });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockCategory);
      expect(CategoryService.update).toHaveBeenCalledWith("1", { nome: "Categoria Atualizada" });
    });
  });

  describe("DELETE /api/categories/:id", () => {
    it("deveria deletar uma categoria", async () => {
      CategoryService.delete.mockResolvedValue({});

      const response = await request(app)
        .delete("/api/categories/1");

      expect(response.status).toBe(204);
      expect(CategoryService.delete).toHaveBeenCalledWith("1");
    });
  });
});
