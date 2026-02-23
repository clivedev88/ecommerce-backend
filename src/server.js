const app = require("./app/app");
const { port } = require("./config/env");

function startServer() {
  app.listen(port, () => {
    console.log(`API rodando na porta ${port}`);
  });
}

module.exports = { startServer };