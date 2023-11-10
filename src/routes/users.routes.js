const { Router } = require("express");
const UsersController = require("../controllers/UsersController");
const userAuthenticated = require("../middlewares/userAuthenticated");

const usersController = new UsersController();
const usersRoutes = Router();

usersRoutes.post("/", usersController.createUser);
usersRoutes.put("/:id", userAuthenticated, usersController.updateUser);

module.exports = usersRoutes;
