// const AppError = require("../../shared/errors/AppError");
const ProductService = require("./product.service");

// const serializeProduct = (product) => {
//   if (!product) return null;
//   return {
//     ...product,
//     desconto: product.desconto ? Number(product.desconto) : 0,
//     estoque: product.estoque ? Number(product.estoque) : 0,
//     avaliacoes: product.avaliacoes?.map(av => ({
//       ...av,
//       nota: Number(av.nota)
//     }))
//   };
// };

class ProductController {
  constructor() {
    this.produtoService = new ProductService();
  }

  static async create(req, res, next) {
    try {
      const resultado = await this.produtoService.create(req.body);

      return res.status(201).json({
        tipo: "success",
        mensagem: "Produto criado com sucesso",
        dados: resultado
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAll(req, res, next) {
    try {
      const resultado = await this.produtoService.findAll();

      if (!products || products.length === 0) {
        return res.status(200).json({
          tipo: "warning",
          mensagem: "Nenhum produto encontrado",
          dados: []
        });
      }
      return res.status(200).json({
        tipo: "success",
        mensagem: `${resultado.length} produto(s) encontrado(s)`,
        dados: resultado
      });
    } catch (error) {
      next(error);
    }
  }

  static async getById(req, res, next) {
    try {
      const { id } = req.params;
      const resultado = await this.produtoService.getById(id);

      return res.status(200).json({
        tipo: "success",
        mensagem: "Produto encontrado",
        dados: resultado
      });
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const { id } = req.params;
      const resultado = await this.produtoService.upd (id, req.body);
      
      return res.status(200).json({
        tipo: "success",
        mensagem: "Produto atualizado com sucesso",
        dados: resultado
      });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      const { id } = req.params;
      await this.produtoService.delete(id);

      return res.status(200).json({
        tipo: "success",
        mensagem: "Produto deletado com sucesso"
      });
    } catch (error) {
      next(error);
    }
  }

  static async atualizarTamanhos(req, res, next) {
    try {
      const { id } = req.params;
      const { tamanhos } = req.body;

      if (!Array.isArray(tamanhos)) {
        return res.status(400).json({
          tipo: "error",
          mensagem: "O campo 'tamanhos' deve ser um array"
        });
      }

      const updated = await this.produtoService.atualizarTamanhos(id, tamanhos);

      return res.status(200).json({
        tipo: "success",
        mensagem: "Tamanhos atualizados com sucesso",
        dados: updated
      });
    } catch (error) {
      next(error);
    }
  }

  static async atualizarCores(req, res) {
  try {
    const { id } = req.params;
    const { cores } = req.body;

    if (!Array.isArray(cores)) {
      return res.status(400).json({
        tipo: "error",
        mensagem: "O campo 'cores' deve ser um array"
      });
    }

    const resultado = await this.produtoService.atualizarCores(id, cores);

    return res.status(400).json({
      tipo: "success",
      mensagem: "Cores atualizadas com sucesso",
      dados: resultado
    });
  } catch (error) {
    next(error);
  }
}

  async validateStock(req, res, next) {
    try {
      const { items } = req.body;
      const result = await this.service.validateStock(items);

      return res.status(200).json({
        tipo: "success",
        mensagem: "Estoque validado",
        dados: result
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ProductController;


// src/shared/middlewares/product.middleware.js
// const AppError = require("../errors/AppError");

// function validarProduto(req, res, next) {
//   try {
//     const { nome, valor, categoria_id } = req.body;

//     if (!nome || typeof nome !== "string" || nome.length < 3) {
//       throw new AppError("Nome deve ter pelo menos 3 caracteres", 400);
//     }

//     if (valor === undefined || isNaN(valor)) {
//       throw new AppError("Valor deve ser um número", 400);
//     }

//     if (!categoria_id || isNaN(categoria_id)) {
//       throw new AppError("categoria_id deve ser um número", 400);
//     }

//     next();
//   } catch (error) {
//     next(error);
//   }
// }

// module.exports = { validarProduto };