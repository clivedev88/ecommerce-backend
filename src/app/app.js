const express = require("express");
const cors = require("cors");

const routes = require("./routes");
const errorMiddleware = require("../shared/middlewares/error.middleware");
const produtoTamanhosRouter = require("../modules/products/produto.routes");

const { swaggerUi, swaggerDocument, swaggerOptions } = require("../config/swagger");

const app = express();

app.use(cors());
app.use(express.json());

// Swagger Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerOptions));

app.use(errorMiddleware);

app.use("/api", routes);
app.use("/api/produtos/tamanhos", produtoTamanhosRouter);

module.exports = app;