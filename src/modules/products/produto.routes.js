const { Router } = require("express");
const ProdutoTamanhosService = require("./ProdutoTamanhosService");

const router = Router();

router.put("/:id/tamanhos", async (req, res, next) => {
  try {
    const produtoId = Number(req.params.id);
    const { tamanhos } = req.body;

    if (!produtoId) {
      return res.status(400).json({ error: "ID do produto inválido" });
    }

    if (!Array.isArray(tamanhos) || tamanhos.length === 0) {
      return res.status(400).json({ error: "Envie um array válido de IDs de tamanhos" });
    }

    const service = new ProdutoTamanhosService();
    const produtoAtualizado = await service.execute(produtoId, tamanhos);

    return res.json(produtoAtualizado);
  } catch (error) {
    next(error);
  }
});

module.exports = router;