const express = require("express");
const cors = require("cors");

const routes = require("./routes");
const errorMiddleware = require("../shared/middlewares/error.middleware");

const app = express();

app.use(cors());
app.use(express.json());
app.use(errorMiddleware);

app.use("/api", routes);

module.exports = app;