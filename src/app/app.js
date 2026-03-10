const express = require("express");
const cors = require("cors");

const routes = require("./routes");
const errorMiddleware = require("../shared/middlewares/error.middleware");
const categoriesRoutes = require("./../modules/categories/categories.routes");

const {
  swaggerUi,
  swaggerDocument,
  swaggerOptions,
} = require("../config/swagger");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/categories", categoriesRoutes);
app.use("/api", routes);

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, swaggerOptions),
);

app.use(errorMiddleware);

module.exports = app;
