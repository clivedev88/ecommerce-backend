const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient({
  omit: {
    usuarios: {
      senha: true,
    },
  },
});

module.exports = prisma;
