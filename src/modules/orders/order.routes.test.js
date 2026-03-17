const request = require('supertest');

// Mocks: antes de require do app para interceptar middlewares/controles usados nas rotas
jest.mock('./order.controller', () => ({
  create: jest.fn((req, res) => res.status(201).json({ created: true })),
  findAll: jest.fn((req, res) => res.status(200).json([{ id: 'p1' }])),
  findById: jest.fn((req, res) => res.status(200).json({ id: req.params.id })),
  updateStatus: jest.fn((req, res) => res.status(200).json({ status: 'ok' })),
  delete: jest.fn((req, res) => res.status(204).send()),
}));

// mock middlewares que bloqueiam requests (rotaProtegida e verifyAccess) para facilitar testes
const mockRotaProtegida = jest.fn((req, _res, next) => {
  req.usuarioId = 'u1';
  req.usuario = { nivel: 'user' };
  return next();
});
jest.mock('../../shared/middlewares/token.middleware', () => ({
  rotaProtegida: (req, res, next) => mockRotaProtegida(req, res, next),
}));

const mockVerifyAccess = jest.fn((req, _res, next) => next());
jest.mock('../../shared/middlewares/access.middleware', () => ({
  verifyAccess: (req, res, next) => mockVerifyAccess(req, res, next),
}));

// mock validadores que são encadeados nas rotas de criação (spies para asserções)
const mockValidarUsuario = jest.fn((req, _res, next) => next());
const mockValidarCEP = jest.fn((req, _res, next) => next());
const mockValidarCupom = jest.fn((req, _res, next) => next());
const mockValidarDesconto = jest.fn((req, _res, next) => next());
const mockValidarPrevisaoEntrega = jest.fn((req, _res, next) => next());
const mockValidarPedido = jest.fn((req, _res, next) => next());

jest.mock('../../middlewares/validarUsuario.middleware', () => (req, _res, next) => mockValidarUsuario(req, _res, next));
jest.mock('../../middlewares/validarCEP.middleware', () => (req, _res, next) => mockValidarCEP(req, _res, next));
jest.mock('../../middlewares/validarCupom.middleware', () => (req, _res, next) => mockValidarCupom(req, _res, next));
jest.mock('../../middlewares/validarDesconto.middleware', () => (req, _res, next) => mockValidarDesconto(req, _res, next));
jest.mock('../../middlewares/validarPrevisaoEntrega.middleware', () => (req, _res, next) => mockValidarPrevisaoEntrega(req, _res, next));
jest.mock('../../middlewares/validarPedido.middleware', () => (req, _res, next) => mockValidarPedido(req, _res, next));

const app = require('../../app/app');
const OrderController = require('./order.controller');

describe('Order Routes', () => {
  beforeEach(() => jest.clearAllMocks());

  it('POST /api/orders/ deve chamar middlewares e controller.create', async () => {
    const res = await request(app)
      .post('/api/orders')
      .send({ itens: [{ produtoId: 'p1', quantidade: 1 }], total: 10 });

    expect(res.status).toBe(201);
    expect(res.body).toEqual({ created: true });
    expect(OrderController.create).toHaveBeenCalled();
  // middlewares executados
  expect(mockRotaProtegida).toHaveBeenCalled();
  expect(mockValidarUsuario).toHaveBeenCalled();
  expect(mockValidarCEP).toHaveBeenCalled();
  expect(mockValidarCupom).toHaveBeenCalled();
  expect(mockValidarDesconto).toHaveBeenCalled();
  expect(mockValidarPrevisaoEntrega).toHaveBeenCalled();
  expect(mockValidarPedido).toHaveBeenCalled();
  });

  it('GET /api/orders deve chamar controller.findAll', async () => {
    const res = await request(app).get('/api/orders');

    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: 'p1' }]);
    expect(OrderController.findAll).toHaveBeenCalled();
  expect(mockRotaProtegida).toHaveBeenCalled();
  expect(mockVerifyAccess).toHaveBeenCalled();
  });

  it('GET /api/orders/:id deve chamar controller.findById', async () => {
    const res = await request(app).get('/api/orders/123');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ id: '123' });
    expect(OrderController.findById).toHaveBeenCalled();
  expect(mockRotaProtegida).toHaveBeenCalled();
  });

  it('PUT /api/orders/:id/status deve chamar controller.updateStatus', async () => {
    const res = await request(app)
      .put('/api/orders/1/status')
      .send({ status: 'entregue' });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
    expect(OrderController.updateStatus).toHaveBeenCalled();
  expect(mockRotaProtegida).toHaveBeenCalled();
  expect(mockVerifyAccess).toHaveBeenCalled();
  });

  it('DELETE /api/orders/:id deve chamar controller.delete', async () => {
    const res = await request(app).delete('/api/orders/1');

    expect(res.status).toBe(204);
    expect(OrderController.delete).toHaveBeenCalled();
  expect(mockRotaProtegida).toHaveBeenCalled();
  });

  it('POST /api/orders → quando o controller lançar, middleware de erro responde 500', async () => {
    // faz com que o próximo handler (controller.create) encaminhe erro via next(err)
    OrderController.create.mockImplementationOnce((req, _res, next) => next(new Error('boom')));

    const res = await request(app)
      .post('/api/orders')
      .send({ itens: [{ produtoId: 'p1', quantidade: 1 }], total: 10 });

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty('message', 'Erro interno do servidor');
    expect(res.body).toHaveProperty('path', '/api/orders');
    expect(typeof res.body.timestamp).toBe('string');
  });

  it('GET /api/orders/:id → quando controller lançar, middleware de erro responde 500', async () => {
    OrderController.findById.mockImplementationOnce((req, _res, next) => next(new Error('boom')));

    const res = await request(app).get('/api/orders/999');

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty('message', 'Erro interno do servidor');
    expect(res.body).toHaveProperty('path', '/api/orders/999');
    expect(typeof res.body.timestamp).toBe('string');
  });
});
