const app = require("./app/app");
const { PORT } = require("./config/env");

function startServer() {
  app.listen(PORT, () => {
    console.log(`✅ API rodando na porta ${PORT}`);
  });
}

module.exports = { startServer };