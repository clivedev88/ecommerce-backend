const AppError = require("../../shared/errors/AppError");
const CouponRepository = require("./coupon.repository");

class CouponService {
  constructor() {
    this.repository = new CouponRepository();
  }

  async create(data) {
    if (!data.nome || typeof data.nome !== "string") {
      throw new AppError("Nome do cupom é obrigatório", 400);
    }

    if (data.quantidade === undefined || isNaN(data.quantidade)) {
      throw new AppError("Quantidade é obrigatória", 400);
    }

    if (!data.validade) {
      throw new AppError("Validade é obrigatória", 400);
    }

    if (data.valor_desc === undefined || isNaN(data.valor_desc)) {
      throw new AppError("Valor do desconto é obrigatório", 400);
    }

    const existingCoupon = await this.repository.findByName(data.nome.trim());
    if (existingCoupon) {
      throw new AppError("Já existe um cupom com este nome", 400);
    }

    const couponData = {
      nome: data.nome.trim(),
      quantidade: Number(data.quantidade),
      validade: new Date(data.validade),
      valor_desc: Number(data.valor_desc)
    };

    return await this.repository.create(couponData);
  }

  async findAll() {
    return await this.repository.findAll();
  }

  async findById(id) {
    if (!id || isNaN(id)) {
      throw new AppError("ID do cupom inválido", 400);
    }

    const coupon = await this.repository.findById(id);

    if (!coupon) {
      throw new AppError("Cupom não encontrado", 404);
    }

    return coupon;
  }

  async update(id, data) {
    await this.findById(id);

    if (data.nome) {
      const existingCoupon = await this.repository.findByName(data.nome.trim());
      if (existingCoupon && existingCoupon.id !== Number(id)) {
        throw new AppError("Já existe um cupom com este nome", 400);
      }
    }

    const updateData = {};

    if (data.nome !== undefined) updateData.nome = data.nome.trim();
    if (data.quantidade !== undefined) {
      if (isNaN(data.quantidade)) {
        throw new AppError("Quantidade inválida", 400);
      }
      updateData.quantidade = Number(data.quantidade);
    }

    if (data.validade !== undefined) {
      updateData.validade = new Date(data.validade);
    }

    if (data.valor_desc !== undefined) {
      if (isNaN(data.valor_desc)) {
        throw new AppError("Valor do desconto inválido", 400);
      }
      updateData.valor_desc = Number(data.valor_desc);
    }

    return await this.repository.update(id, updateData);
  }

  async delete(id) {
    await this.findById(id);
    await this.repository.delete(id);
    return true;
  }

  async validarCupom(id) {
    const coupon = await this.findById(id);

    if (coupon.quantidade <= 0) {
      throw new AppError("Cupom esgotado", 400);
    }

    if (new Date(coupon.validade) < new Date()) {
      throw new AppError("Cupom expirado", 400);
    }

    return coupon;
  }

  async buscarCuponsDisponiveis() {
    const hoje = new Date();
    const coupons = await this.repository.findAll();

    return coupons.filter((coupon) => {
      return coupon.quantidade > 0 && new Date(coupon.validade) >= hoje;
    });
  }

  async aplicarAProduto(couponId, productId) {
    if (!couponId || isNaN(couponId)) {
      throw new AppError("ID do cupom inválido", 400);
    }

    if (!productId || isNaN(productId)) {
      throw new AppError("ID do produto inválido", 400);
    }

    const coupon = await this.validarCupom(couponId);
    const product = await this.repository.findProductById(productId);

    if (!product) {
      throw new AppError("Produto não encontrado", 404);
    }

    if (Number(product.estoque) <= 0) {
      throw new AppError("Produto sem estoque", 400);
    }

    const valorOriginal = Number(product.valor);
    const valorDesconto = Number(coupon.valor_desc);
    const valorFinal = valorOriginal - valorDesconto > 0
      ? valorOriginal - valorDesconto
      : 0;

    return {
      cupom: {
        id: coupon.id,
        nome: coupon.nome,
        valor_desc: Number(coupon.valor_desc)
      },
      produto: {
        id: product.id,
        nome: product.nome,
        valor_original: valorOriginal,
        valor_final: valorFinal,
        economia: valorOriginal - valorFinal
      }
    };
  }

  async usarCupom(id) {
    await this.validarCupom(id);
    return await this.repository.decrementQuantidade(id);
  }
}

module.exports = CouponService;