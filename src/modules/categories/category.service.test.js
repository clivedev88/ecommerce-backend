const prisma = require("../../database/prisma");
const CategoryService = require("./category.service");

// Mock the prisma client
jest.mock("../../database/prisma", () => ({
  categoria: {
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

describe("CategoryService CRUD operations", () => {
    it("Criar uma categoria", async () => {
        const data = { nome: "Teste" };
        const mockCategory = { id: 1, nome: "Teste", produtos: [] };
        
        prisma.categoria.create.mockResolvedValue(mockCategory);

        const created = await CategoryService.create(data);

        expect(prisma.categoria.create).toHaveBeenCalledWith({ data });
        expect(created).toHaveProperty("id");
        expect(created.nome).toBe(data.nome);
    });

    it("Buscar todas as categorias", async () => {
        const mockCategories = [
            { id: 1, nome: "Foo", produtos: [] },
            { id: 2, nome: "Bar", produtos: [] },
        ];
        
        prisma.categoria.findMany.mockResolvedValue(mockCategories);

        const list = await CategoryService.findAll();
        
        expect(prisma.categoria.findMany).toHaveBeenCalledWith({
            include: { produtos: true },
        });
        expect(Array.isArray(list)).toBe(true);
        expect(list.length).toBe(2);
    });

    it("Buscar uma categoria que não existe", async () => {
        prisma.categoria.findUnique.mockResolvedValue(null);
        
        const result = await CategoryService.findById(99999);
        
        expect(prisma.categoria.findUnique).toHaveBeenCalledWith({
            where: { id: 99999 },
            include: { produtos: true },
        });
        expect(result).toBeNull();
    });

    it("Buscar uma categoria por Id", async () => {
        const mockCategory = { id: 1, nome: "Bar", produtos: [] };
        
        prisma.categoria.findUnique.mockResolvedValue(mockCategory);
        
        const result = await CategoryService.findById(1);
        
        expect(prisma.categoria.findUnique).toHaveBeenCalledWith({
            where: { id: 1 },
            include: { produtos: true },
        });
        expect(result).not.toBeNull();
        expect(result.id).toBe(1);
        expect(result.nome).toBe("Bar");
    });

    it("Editar categoria", async () => {
        const updatedData = { nome: "New" };
        const mockCategory = { id: 1, nome: "New", produtos: [] };
        
        prisma.categoria.update.mockResolvedValue(mockCategory);
        
        const updated = await CategoryService.update(1, updatedData);
        
        expect(prisma.categoria.update).toHaveBeenCalledWith({
            where: { id: 1 },
            data: updatedData,
        });
        expect(updated.id).toBe(1);
        expect(updated.nome).toBe("New");
    });

    it("Deletar categoria", async () => {
        const mockCategory = { id: 1, nome: "ToRemove", produtos: [] };
        
        prisma.categoria.delete.mockResolvedValue(mockCategory);
        
        await CategoryService.delete(1);
        
        expect(prisma.categoria.delete).toHaveBeenCalledWith({
            where: { id: 1 },
        });
    });
});
