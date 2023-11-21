const { Router } = require("express");
const multer = require("multer");
const uploadConfig = require("../configs/upload");
const UsersController = require("../controllers/UsersController");
const userAuthenticated = require("../middlewares/userAuthenticated");

const usersController = new UsersController();
const usersRoutes = Router();
const upload = multer(uploadConfig.MULTER);

usersRoutes.post("/", usersController.createUser);
usersRoutes.put("/:id", userAuthenticated, usersController.updateUser);
usersRoutes.patch(
  "/avatar",
  userAuthenticated,
  upload.single("avatar"),
  (request, response) => {
    console.log(request.file.filename);
    response.json();
  }
);

module.exports = usersRoutes;
