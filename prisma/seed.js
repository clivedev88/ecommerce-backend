const prisma = require("../src/database/prisma");
const bcrypt = require("bcryptjs");

async function seed() {
  const password = "teste123";
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.usuarios.create({
    data: {
      nome: "Usuário da Silva",
      genero: "Feminino",
      cpf: "12345678901",
      email: "usuario@email.com",
      telefone: "85999998888",
      senha: hashedPassword,
      data_nasc: new Date("1995-04-12"),
      nivel: "cliente",
    },
  });

  const categoria1 = await prisma.categoria.create({
    data: { nome: "Chaveiros" },
  });

  const categoria2 = await prisma.categoria.create({
    data: { nome: "Mascotes" },
  });

  const produto1 = await prisma.produtos.create({
    data: {
      nome: "Chaveiro JS",
      valor: "15",
      descricao: "Chaveiro 3D com logo do JavaScript, feito em ABS",
      estoque: 50,
      categoria_id: categoria1.id,
      tamanhos: "Pequeno",
      cores: "Amarelo",
      altura: "4cm",
      largura: "4cm",
      comprimento: "10cm",
      peso: "10g",
    },
  });

  const produto2 = await prisma.produtos.create({
    data: {
      nome: "Mascote Tux Linux",
      valor: "60",
      descricao:
        "Miniatura do Tux, mascote do Linux, ideal para decoração de mesa ou prateleira",
      estoque: 50,
      categoria_id: categoria2.id,
      tamanhos: "Médio",
      cores: "Preto e branco",
      altura: "12cm",
      largura: "8cm",
      comprimento: "7cm",
      peso: "180g",
    },
  });

  await prisma.produto_imagens.create({
    data: { url: "/images/produtos/chaveiroJS.png", produto_id: produto1.id },
  });

  await prisma.banner.create({
    data: {
      url_banner: "/images/banners/promocao-boas-vindas.jpg",
      validade: new Date("2026-04-31"),
      link: "https://3dtech.com/promocao",
    },
  });

  const cupom = await prisma.cupons.create({
    data: {
      nome: "BEMVINDO10",
      quantidade: 100,
      validade: new Date("2026-04-31"),
      valor_desc: 10,
    },
  });

  const pedido = await prisma.pedidos.create({
    data: {
      usuario_id: user.id,
      status: "pendente",
      valor_total: "75",
      valor_desc: "7.50",
      logradouro: "Av. Santos Dummont",
      numero: "1510",
      bairro: "Aldeota",
      cidade: "Fortaleza",
      estado: "CE",
      cep: "60150-161",
      previsao_entrega: new Date("2026-03-12"),
      cupom_id: cupom.id,
      pedido_produto: {
        create: [{ id_produto: produto1.id }, { id_produto: produto2.id }],
      },
    },
  });

  await prisma.avaliacoes.create({
    data: {
      nota: 5,
      descricao: "Produto incrível, entrega rápida e ótimo acabamento!",
      usuario_id: user.id,
      produto_id: produto1.id,
    },
  });
}

seed()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
