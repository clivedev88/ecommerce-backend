const OrderController = require("./order.controller");
jest.mock("./order.service");
const OrderService = require("./order.service");

// helpers locais (não dependem de um arquivo externo)
const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnThis();
  res.json = jest.fn().mockReturnThis();
  res.send = jest.fn().mockReturnThis();
  return res;
};

const pedidoMock = ({
  id = 'p1',
  cliente = 'Cliente Teste',
  itens = [{ produtoId: 'prod1', quantidade: 2 }],
  total = 100.0,
  userId = 'u1',
  status = 'pendente',
} = {}) => ({ id, cliente, itens, total, userId, status });

// factories flexíveis: aceitam dois formatos de overrides usados nos testes
// 1) makeReqCreate({ body }, { usuarioId, usuario })
// 2) makeReqCreate(bodyObject, { id, isAdmin })
const normalizeUser = (userOrOverrides = {}) => {
  if (!userOrOverrides) return { usuarioId: undefined, usuario: undefined };
  if (userOrOverrides.usuarioId !== undefined || userOrOverrides.usuario !== undefined) {
    return { usuarioId: userOrOverrides.usuarioId, usuario: userOrOverrides.usuario || { nivel: 'user' } };
  }
  if (userOrOverrides.id !== undefined) {
    return { usuarioId: userOrOverrides.id, usuario: { nivel: userOrOverrides.isAdmin ? 'admin' : 'user' } };
  }
  return { usuarioId: undefined, usuario: undefined };
};

const makeReqCreate = (arg1 = {}, arg2 = {}) => {
  const body = arg1 && arg1.body !== undefined ? arg1.body : arg1;
  const fromArg1 = (arg1 && (arg1.usuarioId !== undefined || arg1.usuario !== undefined)) ? normalizeUser(arg1) : null;
  const fromArg2 = normalizeUser(arg2);
  const { usuarioId, usuario } = fromArg1 || fromArg2;
  return { body, usuarioId, usuario };
};

const makeReqById = (arg1 = {}, arg2 = {}) => {
  const params = arg1 && arg1.params !== undefined ? arg1.params : arg1;
  const fromArg1 = (arg1 && (arg1.usuarioId !== undefined || arg1.usuario !== undefined)) ? normalizeUser(arg1) : null;
  const fromArg2 = normalizeUser(arg2);
  const { usuarioId, usuario } = fromArg1 || fromArg2;
  return { params, usuarioId, usuario };
};

const makeReqUpdate = (arg1 = {}, arg2 = {}, arg3 = {}) => {
  // supports (params, body, user) or ( { params, body, usuarioId }, {} )
  const params = arg1 && arg1.params !== undefined ? arg1.params : arg1;
  const body = (arg2 && arg2.body !== undefined) ? arg2.body : (arg1 && arg1.body !== undefined ? arg1.body : arg2);
  const fromArg1 = (arg1 && (arg1.usuarioId !== undefined || arg1.usuario !== undefined)) ? normalizeUser(arg1) : null;
  const fromArg3 = normalizeUser(arg3);
  const userFromArg2 = (arg2 && (arg2.usuarioId !== undefined || arg2.usuario !== undefined)) ? normalizeUser(arg2) : null;
  const { usuarioId, usuario } = fromArg1 || userFromArg2 || fromArg3;
  return { params, body, usuarioId, usuario };
};

const makeReqDelete = (arg1 = {}, arg2 = {}) => {
  const params = arg1 && arg1.params !== undefined ? arg1.params : arg1;
  const fromArg1 = (arg1 && (arg1.usuarioId !== undefined || arg1.usuario !== undefined)) ? normalizeUser(arg1) : null;
  const fromArg2 = normalizeUser(arg2);
  const { usuarioId, usuario } = fromArg1 || fromArg2;
  return { params, usuarioId, usuario };
};

beforeEach(() => {
  jest.clearAllMocks();
});

// Se houver conexões (ex: prisma), tenta desconectar ao final dos testes
afterAll(async () => {
  try {
    // tenta desconectar do prisma se existir
    // eslint-disable-next-line global-require, import/no-dynamic-require
    const prisma = require('../../../database/prisma');
    if (prisma && typeof prisma.$disconnect === 'function') {
      await prisma.$disconnect();
    }
  } catch (err) {
    // não faz nada se o módulo não existir
  }
});

describe("OrderController", () => {
  describe("create", () => {
    it("✅ deve criar um pedido e retornar 201 com o pedido", async () => {
      // Arrange
      const body = { items: [1, 2] };
  const req = makeReqCreate({ body }, { usuarioId: 'u1', usuario: { nivel: 'user' } });
      const res = mockRes();
      const pedido = pedidoMock({ id: 'p1', itens: body.items, userId: 'u1' });

      OrderService.create.mockResolvedValue(pedido);

      // Act
      await OrderController.create(req, res);

      // Assert
      expect(OrderService.create).toHaveBeenCalledWith('u1', body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(pedido);
    });

  const reqCreate = makeReqCreate({ body: { items: [1] }, usuarioId: 'u1' });

    const errosComunsCreate = [
      ['erro com mensagem', new Error('Dados inválidos'),  400, { erro: 'Dados inválidos' }],
      ['erro sem mensagem', new Error(),                   500, { erro: 'Erro interno do servidor' }],
      ['objeto puro',       { code: 500 },                 500, { erro: 'Erro interno do servidor' }],
      ['resolve null',      null,                          400, { erro: 'Dados inválidos' }],
    ];

    test.each(errosComunsCreate)(
      '❌ create → %s → deve retornar status %i',
      async (_, mockValue, expectedStatus, expectedBody) => {
        // Arrange
        const res = mockRes();

        if (mockValue === null) {
          OrderService.create.mockResolvedValue(null);
        } else {
          OrderService.create.mockRejectedValue(mockValue);
        }

        // Act
        await OrderController.create(reqCreate, res);

        // Assert
        expect(res.status).toHaveBeenCalledWith(expectedStatus);
        expect(res.json).toHaveBeenCalledWith(expectedBody);
      }
    );
  });

  describe("findAll", () => {
    it("✅ deve listar pedidos do usuário com status 200", async () => {
      // Arrange
  const req = makeReqById({ params: {}, usuarioId: 'u1', usuario: { nivel: 'user' } });
      const res = mockRes();
      const pedidos = [pedidoMock({ id: 'p1' })];

      OrderService.findAll.mockResolvedValue(pedidos);

      // Act
      await OrderController.findAll(req, res);

      // Assert
      expect(OrderService.findAll).toHaveBeenCalledWith('u1', false);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(pedidos);
    });

    it("✅ deve retornar lista vazia com status 200 quando não houver pedidos", async () => {
      // Arrange
  const req = makeReqById({ params: {}, usuarioId: 'u1', usuario: { nivel: 'user' } });
      const res = mockRes();

      OrderService.findAll.mockResolvedValue([]);

      // Act
      await OrderController.findAll(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([]);
    });

  const reqFindAll = makeReqById({ params: {}, usuarioId: 'u1', usuario: { nivel: 'user' } });

    const errosComunsFindAll = [
      ['erro com mensagem', new Error('Erro ao buscar pedidos'), 500, { erro: 'Erro ao buscar pedidos' }],
      ['erro sem mensagem', new Error(), 500, { erro: 'Erro interno do servidor' }],
      ['objeto puro', { code: 500 }, 500, { erro: 'Erro interno do servidor' }],
      ['resolve null', null, 200, []],
    ];

    test.each(errosComunsFindAll)(
      '❌ findAll → %s → deve retornar status %i',
      async (_, mockValue, expectedStatus, expectedBody) => {
        // Arrange
        const res = mockRes();

        if (mockValue === null) {
          OrderService.findAll.mockResolvedValue(null);
        } else {
          OrderService.findAll.mockRejectedValue(mockValue);
        }

        // Act
        await OrderController.findAll(reqFindAll, res);

        // Assert
        expect(res.status).toHaveBeenCalledWith(expectedStatus);
        expect(res.json).toHaveBeenCalledWith(expectedBody);
      }
    );
  });

  describe("findById", () => {
    it("✅ deve retornar pedido encontrado com status 200 e chamar service com (id, userId, isAdmin)", async () => {
      // Arrange
  const req = makeReqById({ params: { id: 'p1' }, usuarioId: 'u1', usuario: { nivel: 'user' } });
      const res = mockRes();
      const pedido = pedidoMock({ id: 'p1' });

      OrderService.findById.mockResolvedValue(pedido);

      // Act
      await OrderController.findById(req, res);

      // Assert
      expect(OrderService.findById).toHaveBeenCalledWith('p1', 'u1', false);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(pedido);
    });

  const reqFindById = makeReqById({ params: { id: 'p1' }, usuarioId: 'u1', usuario: { nivel: 'user' } });

    const errosComunsFindById = [
      ['mensagem: pedido não encontrado', new Error('Pedido não encontrado'), 404, { erro: 'Pedido não encontrado' }],
      ['mensagem: acesso negado', new Error('Acesso negado'), 403, { erro: 'Acesso negado' }],
      ['erro sem mensagem', new Error(), 500, { erro: 'Erro interno do servidor' }],
      ['objeto puro', {}, 500, { erro: 'Erro interno do servidor' }],
      ['resolve null', null, 404, { erro: 'Pedido não encontrado' }],
    ];

    test.each(errosComunsFindById)(
      '❌ findById → %s → deve retornar status %i',
      async (_, mockValue, expectedStatus, expectedBody) => {
        // Arrange
        const res = mockRes();

        if (mockValue === null) {
          OrderService.findById.mockResolvedValue(null);
        } else {
          OrderService.findById.mockRejectedValue(mockValue);
        }

        // Act
        await OrderController.findById(reqFindById, res);

        // Assert
        expect(res.status).toHaveBeenCalledWith(expectedStatus);
        expect(res.json).toHaveBeenCalledWith(expectedBody);
      }
    );

    it("✅ Admin acessando pedido de outro usuário deve ter acesso", async () => {
      // Arrange
  const req = makeReqById({ params: { id: '1' }, usuarioId: 99, usuario: { nivel: 'admin' } });
      const res = mockRes();
      const pedido = pedidoMock({ id: '1', userId: 42 });

      OrderService.findById.mockResolvedValue(pedido);

      // Act
      await OrderController.findById(req, res);

      // Assert
      expect(OrderService.findById).toHaveBeenCalledWith('1', 99, true);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(pedido);
    });

    it("❌ Não-admin tentando acessar pedido de outro usuário deve ser negado (Acesso negado)", async () => {
      // Arrange
  const req = makeReqById({ params: { id: '1' }, usuarioId: 99, usuario: { nivel: 'user' } });
      const res = mockRes();

      OrderService.findById.mockRejectedValue(new Error('Acesso negado'));

      // Act
      await OrderController.findById(req, res);

      // Assert
      expect(OrderService.findById).toHaveBeenCalledWith('1', 99, false);
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ erro: 'Acesso negado' });
    });

    it("❌ deve retornar 401 quando req.usuario estiver indefinido (não autorizado)", async () => {
      // Arrange
  const req = { params: { id: '1' } }; // sem usuario / usuarioId
      const res = mockRes();

      // Act
      await OrderController.findById(req, res);

      // Assert
      expect(OrderService.findById).toHaveBeenCalledTimes(0);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ erro: 'Não autorizado' });
    });

    it("❌ deve retornar 401 quando req.usuario existir mas usuarioId indefinido", async () => {
      // Arrange
  const req = { params: { id: '1' }, usuario: { nivel: 'user' } }; // usuarioId ausente
      const res = mockRes();

      // Act
      await OrderController.findById(req, res);

      // Assert
      expect(OrderService.findById).toHaveBeenCalledTimes(0);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ erro: 'Não autorizado' });
    });

    it("❌ deve retornar 404 quando OrderService.findById resolver null (não encontrado)", async () => {
      // Arrange
  const req = makeReqById({ params: { id: 'p-null' }, usuarioId: 'u1', usuario: { nivel: 'user' } });
      const res = mockRes();

      OrderService.findById.mockResolvedValue(null);

      // Act
      await OrderController.findById(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ erro: 'Pedido não encontrado' });
    });
  });

  describe("updateStatus", () => {
    it("✅ deve atualizar pedido com sucesso e retornar 200 com os campos alterados", async () => {
      // Arrange
      const reqBody = { status: 'entregue' };
  const req = makeReqUpdate({ params: { id: 'p1' }, body: reqBody, usuarioId: 'u1', usuario: { nivel: 'user' } });
      const res = mockRes();
      const original = pedidoMock({ id: 'p1', status: 'pendente' });
      const updated = { ...original, status: 'entregue' };

      OrderService.updateStatus.mockResolvedValue(updated);

      // Act
      await OrderController.updateStatus(req, res);

      // Assert
      expect(OrderService.updateStatus).toHaveBeenCalledWith('p1', 'entregue', false);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ status: 'entregue' }));
      // Verifica que apenas o campo enviado foi alterado (total permanece igual ao original)
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ total: original.total }));
    });

  const reqUpdate = makeReqUpdate({ params: { id: 'p1' }, body: { status: 'entregue' }, usuarioId: 'u1' });

    const errosComunsUpdate = [
      ['Pedido não encontrado', new Error('Pedido não encontrado'), 404, { erro: 'Pedido não encontrado' }],
      ['Dados inválidos', new Error('Dados inválidos'), 400, { erro: 'Dados inválidos' }],
      ['Acesso negado', new Error('Acesso negado'), 403, { erro: 'Acesso negado' }],
      ['erro sem mensagem', new Error(), 500, { erro: 'Erro interno do servidor' }],
      ['objeto puro', {}, 500, { erro: 'Erro interno do servidor' }],
      ['resolve null', null, 404, { erro: 'Pedido não encontrado' }],
    ];

    test.each(errosComunsUpdate)(
      '❌ updateStatus → %s → deve retornar status %i',
      async (_, mockValue, expectedStatus, expectedBody) => {
        // Arrange
        const res = mockRes();

        if (mockValue === null) {
          OrderService.updateStatus.mockResolvedValue(null);
        } else {
          OrderService.updateStatus.mockRejectedValue(mockValue);
        }

        // Act
        await OrderController.updateStatus(reqUpdate, res);

        // Assert
        expect(res.status).toHaveBeenCalledWith(expectedStatus);
        expect(res.json).toHaveBeenCalledWith(expectedBody);
      }
    );
  });

  describe("delete", () => {
    it("✅ deve deletar pedido com sucesso retornando 204 e sem body", async () => {
      // Arrange
  const req = makeReqDelete({ params: { id: 'p1' }, usuarioId: 'u1', usuario: { nivel: 'user' } });
      const res = mockRes();

      OrderService.delete.mockResolvedValue(true);

      // Act
      await OrderController.delete(req, res);

      // Assert
      expect(OrderService.delete).toHaveBeenCalledTimes(1);
      expect(OrderService.delete).toHaveBeenCalledWith('p1', false);
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

  const reqDelete = makeReqDelete({ params: { id: 'p1' }, usuarioId: 'u1', usuario: { nivel: 'user' } });

    const errosComunsDelete = [
      ['Pedido não encontrado', new Error('Pedido não encontrado'), 404, { erro: 'Pedido não encontrado' }],
      ['Acesso negado', new Error('Acesso negado'), 403, { erro: 'Acesso negado' }],
      ['erro sem mensagem', new Error(), 500, { erro: 'Erro interno do servidor' }],
      ['objeto puro', {}, 500, { erro: 'Erro interno do servidor' }],
      ['resolve null', null, 404, { erro: 'Pedido não encontrado' }],
    ];

    test.each(errosComunsDelete)(
      '❌ delete → %s → deve retornar status %i',
      async (_, mockValue, expectedStatus, expectedBody) => {
        // Arrange
        const res = mockRes();

        if (mockValue === null) {
          OrderService.delete.mockResolvedValue(null);
        } else {
          OrderService.delete.mockRejectedValue(mockValue);
        }

        // Act
        await OrderController.delete(reqDelete, res);

        // Assert
        expect(res.status).toHaveBeenCalledWith(expectedStatus);
        expect(res.json).toHaveBeenCalledWith(expectedBody);
      }
    );

    it("✅ Admin pode deletar pedido de qualquer usuário", async () => {
      // Arrange
  const req = makeReqDelete({ params: { id: '1' }, usuarioId: 99, usuario: { nivel: 'admin' } });
      const res = mockRes();

      OrderService.delete.mockResolvedValue(true);

      // Act
      await OrderController.delete(req, res);

      // Assert
      expect(OrderService.delete).toHaveBeenCalledTimes(1);
      expect(OrderService.delete).toHaveBeenCalledWith('1', true);
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });

    it("❌ deve retornar 401 quando req.usuario estiver indefinido (não autorizado) para delete", async () => {
      // Arrange
      const req = { params: { id: '1' } }; // sem usuario
      const res = mockRes();

      // Act
      await OrderController.delete(req, res);

      // Assert
      expect(OrderService.delete).toHaveBeenCalledTimes(0);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ erro: 'Não autorizado' });
    });

    it("❌ deve retornar 401 quando req.usuario.id estiver indefinido para delete", async () => {
      // Arrange
      const req = { params: { id: '1' }, usuario: { nivel: 'user' } };
      const res = mockRes();

      // Act
      await OrderController.delete(req, res);

      // Assert
      expect(OrderService.delete).toHaveBeenCalledTimes(0);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ erro: 'Não autorizado' });
    });

    it("❌ deve retornar 404 quando OrderService.delete resolver null", async () => {
      // Arrange
  const req = makeReqDelete({ params: { id: 'p-null' }, usuarioId: 'u1' });
      const res = mockRes();

      OrderService.delete.mockResolvedValue(null);

      // Act
      await OrderController.delete(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ erro: 'Pedido não encontrado' });
    });
  });
});
