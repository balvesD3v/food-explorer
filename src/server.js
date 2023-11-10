require("express-async-errors");
const express = require("express");
const cors = require("cors");
const routes = require("./routes");
const migrationsRun = require("./database/sqlite/migrations");
const AppError = require("./utils/AppError");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(routes);
migrationsRun();

app.use((error, request, response, next) => {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      status: "error",
      message: error.message,
    });
  }

  console.error(error);

  return response.status(500).json({
    status: "error",
    message: "Internal Server Error",
  });
});

app.listen(port, () => {
  console.log("Express server listening on port " + port);
  console.log(`${"http://localhost:" + port}`);
});
