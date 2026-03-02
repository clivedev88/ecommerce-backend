const prisma = require("../../database/prisma");
const serialize = require("../../shared/utils/serialize");

class CouponService {
  static async create(data) {
    try {
      const { nome, quantidade, validade, valor_desc } = data;
      
      const coupon = await prisma.cupons.create({
        data: {
          nome,
          quantidade: parseInt(quantidade),
          validade: new Date(validade),
<<<<<<< HEAD
          valor_desc: parseInt(valor_desc)
        }
=======
          valor_desc: parseInt(valor_desc),
        },
>>>>>>> 1c84707 (:books:: Documentação modular)
      });
      
      return {
        sucesso: true,
        dados: serialize(coupon)
      };
    } catch (error) {
<<<<<<< HEAD
      return {
        sucesso: false,
        erro: error.message
      };
=======
      console.error('Erro ao criar cupom:', error);
      throw new Error(`Erro ao criar cupom: ${error.message}`);
>>>>>>> 1c84707 (:books:: Documentação modular)
    }
  }

  static async findAll() {
    try {
      const coupons = await prisma.cupons.findMany({
<<<<<<< HEAD
        orderBy: { validade: 'asc' }
      });
      
      return {
        sucesso: true,
        dados: serialize(coupons)
      };
    } catch (error) {
      return {
        sucesso: false,
        erro: error.message
      };
=======
        orderBy: {
          id: 'desc'
        }
      });
      return coupons;
    } catch (error) {
      console.error('Erro ao listar cupons:', error);
      throw new Error(`Erro ao listar cupons: ${error.message}`);
>>>>>>> 1c84707 (:books:: Documentação modular)
    }
  }

  static async findById(id) {
    try {
      const coupon = await prisma.cupons.findUnique({
        where: { id: parseInt(id) },
        include: { pedidos: true }
      });
      
      if (!coupon) {
        return {
          sucesso: false,
          erro: "Cupom não encontrado"
        };
      }
      
      return {
        sucesso: true,
        dados: serialize(coupon)
      };
    } catch (error) {
<<<<<<< HEAD
      return {
        sucesso: false,
        erro: error.message
      };
    }
  }

  static async update(id, data) {
    try {
      const { nome, quantidade, validade, valor_desc } = data;
      
      const existe = await prisma.cupons.findUnique({
        where: { id: parseInt(id) }
      });
      
      if (!existe) {
        return {
          sucesso: false,
          erro: "Cupom não encontrado"
        };
      }
      
      const coupon = await prisma.cupons.update({
        where: { id: parseInt(id) },
        data: {
          nome,
          quantidade: parseInt(quantidade),
          validade: new Date(validade),
          valor_desc: parseInt(valor_desc)
        }
      });
      
      return {
        sucesso: true,
        dados: serialize(coupon)
      };
    } catch (error) {
      return {
        sucesso: false,
        erro: error.message
      };
    }
  }

  static async delete(id) {
    try {
      const existe = await prisma.cupons.findUnique({
        where: { id: parseInt(id) }
      });
      
      if (!existe) {
        return {
          sucesso: false,
          erro: "Cupom não encontrado"
        };
      }
      
      await prisma.cupons.delete({
        where: { id: parseInt(id) }
      });
      
      return {
        sucesso: true,
        mensagem: "Cupom deletado com sucesso"
      };
    } catch (error) {
      return {
        sucesso: false,
        erro: error.message
      };
    }
  }

  static async validarCupom(id) {
    try {
      const cupom = await prisma.cupons.findUnique({
        where: { id: parseInt(id) }
      });

      if (!cupom) {
        return {
          valido: false,
          erro: "Cupom não encontrado"
        };
      }
      
      if (cupom.quantidade <= 0) {
        return {
          valido: false,
          erro: "Cupom esgotado"
        };
      }
      
      if (new Date(cupom.validade) < new Date()) {
        return {
          valido: false,
          erro: "Cupom expirado"
        };
      }

      return {
        valido: true,
        dados: serialize(cupom)
      };
    } catch (error) {
      return {
        valido: false,
        erro: error.message
      };
=======
      console.error('Erro ao buscar cupom:', error);
      throw new Error(`Erro ao buscar cupom: ${error.message}`);
>>>>>>> 1c84707 (:books:: Documentação modular)
    }
  }
}

module.exports = CouponService;