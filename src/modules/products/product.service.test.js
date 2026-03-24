const ProductService = require("./product.service");
const AppError = require("../../shared/errors/AppError");

describe("ProductService CRUD operations", () => {
  let service;
  let repositoryMock;

  beforeEach(() => {
    service = new ProductService();

    repositoryMock = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    service.repository = repositoryMock;
  });

  it("deve criar um produto", async () => {
    const data = {
      nome: "Camisa",
      valor: 99.9,
      descricao: "Camisa de algodão",
      desconto: 10,
      estoque: "15",
      categoria_id: "2",
      tamanhos: ["P", "M"],
      cores: ["preto", "branco"],
      altura: 10,
      largura: 20,
      comprimento: 30,
      peso: 0.5,
    };

    const mockProduct = {
      id: 1,
      ...data,
      estoque: 15,
      categoria_id: 2,
      tamanhos: JSON.stringify(data.tamanhos),
      cores: JSON.stringify(data.cores),
    };

    repositoryMock.create.mockResolvedValue(mockProduct);

    const result = await service.create(data);

    expect(repositoryMock.create).toHaveBeenCalledWith({
      nome: "Camisa",
      valor: 99.9,
      descricao: "Camisa de algodão",
      desconto: 10,
      estoque: 15,
      categoria_id: 2,
      tamanhos: JSON.stringify(data.tamanhos),
      cores: JSON.stringify(data.cores),
      altura: 10,
      largura: 20,
      comprimento: 30,
      peso: 0.5,
    });

    expect(result).toHaveProperty("id");
    expect(result.nome).toBe("Camisa");
  });

  it("deve buscar todos os produtos", async () => {
    const mockProducts = [
      { id: 1, nome: "A", valor: 10, estoque: 1 },
      { id: 2, nome: "B", valor: 20, estoque: 2 },
    ];

    repositoryMock.findAll.mockResolvedValue(mockProducts);

    const result = await service.findAll();

    expect(repositoryMock.findAll).toHaveBeenCalled();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(2);
  });

  it("deve buscar um produto por ID", async () => {
    const mockProduct = { id: 1, nome: "A", valor: 10, estoque: 1 };

    repositoryMock.findById.mockResolvedValue(mockProduct);

    const result = await service.findById(1);

    expect(repositoryMock.findById).toHaveBeenCalledWith(1);
    expect(result.id).toBe(1);
    expect(result.nome).toBe("A");
  });

  it("deve lançar erro ao buscar produto inexistente", async () => {
    repositoryMock.findById.mockResolvedValue(null);

    await expect(service.findById(99999)).rejects.toThrow(
      new AppError("Produto não encontrado", 404)
    );
  });

  it("deve atualizar um produto", async () => {
    const existing = { id: 1, nome: "A", valor: 10, estoque: 1 };
    const updated = { id: 1, nome: "A+", valor: 12, estoque: 5 };

    repositoryMock.findById.mockResolvedValue(existing);
    repositoryMock.update.mockResolvedValue(updated);

    const result = await service.update(1, { nome: "A+", valor: 12, estoque: "5" });

    expect(repositoryMock.findById).toHaveBeenCalledWith(1);
    expect(repositoryMock.update).toHaveBeenCalledWith(1, {
      nome: "A+",
      valor: 12,
      estoque: 5,
    });
    expect(result.nome).toBe("A+");
  });

  it("deve lançar erro ao atualizar produto inexistente", async () => {
    repositoryMock.findById.mockResolvedValue(null);

    await expect(service.update(99999, { nome: "B" })).rejects.toThrow(
      new AppError("Produto não encontrado", 404)
    );
  });

  it("deve deletar um produto", async () => {
    const existing = { id: 1, nome: "A" };

    repositoryMock.findById.mockResolvedValue(existing);
    repositoryMock.delete.mockResolvedValue(existing);

    const result = await service.delete(1);

    expect(repositoryMock.findById).toHaveBeenCalledWith(1);
    expect(repositoryMock.delete).toHaveBeenCalledWith(1);
    expect(result).toEqual(existing);
  });

  it("deve lançar erro ao deletar produto inexistente", async () => {
    repositoryMock.findById.mockResolvedValue(null);

    await expect(service.delete(99999)).rejects.toThrow(
      new AppError("Produto não encontrado", 404)
    );
  });
});
