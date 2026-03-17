const mockRes = () => ({
  status: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis(),
  send: jest.fn().mockReturnThis(),
});

// pedidoMock como factory que aceita overrides
const pedidoMock = (overrides = {}) => ({
  id: 'p1',
  cliente: 'João Silva',
  itens: [{ produto: 'Pizza', quantidade: 2 }],
  total: 59.9,
  userId: 'u1',
  status: 'pendente',
  ...overrides,
});

// Factories de req que retornam os campos usados pelo controller: usuarioId e usuario
const makeReqCreate = (overrides = {}) => ({
  body: { items: [{ produtoId: 'prod1', quantidade: 1 }], total: 0 },
  usuarioId: 'u1',
  usuario: { nivel: 'user' },
  ...overrides,
});

const makeReqById = (overrides = {}) => ({
  params: { id: '1' },
  usuarioId: 'u1',
  usuario: { nivel: 'user' },
  ...overrides,
});

const makeReqUpdate = (overrides = {}) => ({
  params: { id: '1' },
  body: { status: 'pendente' },
  usuarioId: 'u1',
  usuario: { nivel: 'user' },
  ...overrides,
});

const makeReqDelete = (overrides = {}) => ({
  params: { id: '1' },
  usuarioId: 'u1',
  usuario: { nivel: 'user' },
  ...overrides,
});

const makeReqAdmin = (overrides = {}) => ({
  params: { id: '1' },
  usuarioId: 99,
  usuario: { nivel: 'admin' },
  ...overrides,
});

const makeReqSemUser = (overrides = {}) => ({
  params: { id: '1' },
  usuario: undefined,
  ...overrides,
});

module.exports = {
  mockRes,
  pedidoMock,
  makeReqCreate,
  makeReqById,
  makeReqUpdate,
  makeReqDelete,
  makeReqAdmin,
  makeReqSemUser,
};
