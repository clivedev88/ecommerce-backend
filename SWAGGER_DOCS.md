# 📚 Documentação Swagger Modular - E-commerce Backend API

## 🏗️ Arquitetura Modular

A documentação Swagger agora segue o padrão modular do projeto!

```
ecommerce-backend/
├── swagger.base.yaml              # Config base (info, servers, security)
├── swagger.yaml                   # [DEPRECATED] Mantido para referência
└── src/
    ├── config/
    │   └── swagger.js             # Agregador modular
    └── modules/
        ├── health/
        │   ├── health.routes.js
        │   ├── health.controller.js
        │   └── health.swagger.yaml     ✅ Docs do módulo
        ├── products/
        │   ├── product.routes.js
        │   ├── product.controller.js
        │   ├── product.service.js
        │   └── product.swagger.yaml    ✅ Docs do módulo
        ├── coupons/
        │   ├── coupon.routes.js
        │   ├── coupon.controller.js
        │   ├── coupon.service.js
        │   └── coupon.swagger.yaml     ✅ Docs do módulo
        └── orders/
            ├── order.routes.js
            └── order.swagger.yaml      ✅ Docs do módulo
```

---

## 🚀 Como Acessar

Após iniciar o servidor, acesse a documentação interativa em:

```
http://localhost:3000/api-docs
```

---

## 📋 Módulos Documentados

### ✅ Health (`health.swagger.yaml`)
- `GET /api/health` - Verificar status da API

### ✅ Products (`product.swagger.yaml`)
- `POST /api/products` - Criar novo produto
- `GET /api/products` - Listar todos os produtos (com relacionamentos)
- `GET /api/products/{id}` - Buscar produto por ID (com relacionamentos)

**Schemas:**
- `ProductCreateInput`
- `ProductResponse`
- `ProductResponseWithRelations`

### ✅ Coupons (`coupon.swagger.yaml`)
- `POST /api/coupons` - Criar novo cupom
- `GET /api/coupons` - Listar todos os cupons (🔒 requer autenticação)
- `GET /api/coupons/{id}` - Buscar cupom por ID

**Schemas:**
- `CouponCreateInput`
- `CouponResponse`

### ✅ Orders (`order.swagger.yaml`)
- `POST /api/orders` - Criar novo pedido (com validação de estoque)

**Schemas:**
- `OrderCreateInput`
- `ErrorResponse`

---

## 🔧 Como Funciona o Agregador

**`src/config/swagger.js`** carrega e mescla todos os módulos:

```javascript
// 1. Carrega base (info, servers, security)
const baseSwagger = YAML.parse('swagger.base.yaml');

// 2. Carrega cada módulo
const healthSwagger = YAML.parse('health.swagger.yaml');
const productSwagger = YAML.parse('product.swagger.yaml');
const couponSwagger = YAML.parse('coupon.swagger.yaml');
const orderSwagger = YAML.parse('order.swagger.yaml');

// 3. Mescla tudo
const swaggerDocument = {
  ...baseSwagger,
  paths: { ...health, ...product, ...coupon, ...order },
  components: { schemas: { ...todos os schemas } }
};
```

---

## ✨ Vantagens da Modularização

### ✅ Isolamento
- Cada módulo tem sua própria documentação
- Alterações não afetam outros módulos

### ✅ Manutenção
- Documentação junto com o código
- Fácil de encontrar e atualizar

### ✅ Escalabilidade
- Adicionar novo módulo = criar novo `.swagger.yaml`
- Sem conflitos de merge

### ✅ Organização
- Segue o padrão do projeto
- Estrutura clara e previsível

---

## 🛠️ Como Adicionar Novo Módulo

### 1. Crie o arquivo swagger do módulo

**`src/modules/users/user.swagger.yaml`**
```yaml
paths:
  /users:
    get:
      tags: [Users]
      summary: Listar usuários
      responses:
        '200':
          description: Lista de usuários

components:
  schemas:
    UserResponse:
      type: object
      properties:
        id:
          type: integer
        nome:
          type: string
```

### 2. Adicione no agregador

**`src/config/swagger.js`**
```javascript
// Adicione o import
const userSwagger = YAML.parse(
  fs.readFileSync(path.join(__dirname, '../modules/users/user.swagger.yaml'), 'utf8')
);

// Adicione na mesclagem
const swaggerDocument = {
  ...baseSwagger,
  paths: {
    ...healthSwagger.paths,
    ...productSwagger.paths,
    ...couponSwagger.paths,
    ...orderSwagger.paths,
    ...userSwagger.paths,  // ✅ Adicione aqui
  },
  components: {
    ...baseSwagger.components,
    schemas: {
      ...productSwagger.components?.schemas,
      ...couponSwagger.components?.schemas,
      ...orderSwagger.components?.schemas,
      ...userSwagger.components?.schemas,  // ✅ E aqui
    }
  }
};
```

### 3. Reinicie o servidor

```bash
npm run dev
```

Pronto! O novo módulo aparecerá no Swagger UI.

---

## 🔐 Autenticação

Configurada em `swagger.base.yaml`:

```yaml
components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
```

Para usar em rotas protegidas:

```yaml
paths:
  /coupons:
    get:
      security:
        - bearerAuth: []  # ✅ Rota protegida
```

---

## 📝 Estrutura de um Módulo Swagger

```yaml
# Sempre inclua paths
paths:
  /seu-endpoint:
    get:
      tags: [SuaTag]
      summary: Descrição
      responses:
        '200':
          description: Sucesso

# Schemas são opcionais
components:
  schemas:
    SeuSchema:
      type: object
      properties:
        campo:
          type: string
```

---

## 🎯 Padrões do Projeto

### Nomenclatura
- Rotas: **plural** (products, coupons, orders)
- Parâmetros: **snake_case** (categoria_id, valor_desc)
- Schemas: **PascalCase** (ProductResponse, CouponCreateInput)

### Status Codes
- `200` - Sucesso (GET)
- `201` - Criado (POST)
- `400` - Requisição inválida
- `401` - Não autorizado
- `404` - Não encontrado
- `500` - Erro interno

---

## 📦 Arquivos

### Base
- `swagger.base.yaml` - Configurações globais
- `src/config/swagger.js` - Agregador modular

### Módulos
- `src/modules/health/health.swagger.yaml`
- `src/modules/products/product.swagger.yaml`
- `src/modules/coupons/coupon.swagger.yaml`
- `src/modules/orders/order.swagger.yaml`

---

## 🧪 Testar Endpoints

1. Acesse http://localhost:3000/api-docs
2. Expanda o endpoint desejado
3. Clique em **"Try it out"**
4. Preencha os dados
5. Clique em **"Execute"**
6. Veja a resposta real da API

---

## 📚 Referências

- [OpenAPI 3.0 Specification](https://swagger.io/specification/)
- [Swagger UI Express](https://github.com/scottie1984/swagger-ui-express)
- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)

---

**✅ Documentação agora é modular e segue o padrão do projeto!**
