const { Router } = require("express");
const usersRoutes = require("./users.routes");
const sessionRoutes = require("./session.routes");
const dishesRoutes = require("./dishes.routes");

const routes = Router();

routes.use("/users", usersRoutes);
routes.use("/session", sessionRoutes);
routes.use("/dishes", dishesRoutes);

module.exports = routes;
