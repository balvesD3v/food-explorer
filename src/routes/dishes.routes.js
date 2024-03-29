const { Router } = require("express");
const DishesController = require("../controllers/DishesController");
const ImageDishController = require("../controllers/ImageDishController");
const IngrendientController = require("../controllers/IngrendientController");
const userAuthenticated = require("../middlewares/userAuthenticated");
const verifyUserAuthorization = require("../middlewares/verifyUserAuthorization");
const uploadConfig = require("../configs/upload");
const multer = require("multer");

const dishesController = new DishesController();
const imageDishController = new ImageDishController();
const ingrendientController = new IngrendientController();
const dishesRoutes = Router();
const upload = multer(uploadConfig.MULTER);

dishesRoutes.use(userAuthenticated);

dishesRoutes.post(
  "/",
  verifyUserAuthorization("admin"),
  dishesController.createDishes
);

dishesRoutes.put(
  "/:dish_id",
  verifyUserAuthorization("admin"),
  dishesController.updateDish
);

dishesRoutes.delete(
  "/:dish_id",
  verifyUserAuthorization("admin"),
  dishesController.deleteDish
);

dishesRoutes.get("/:id", dishesController.showDishes);

dishesRoutes.get("/", dishesController.searchDishes);

dishesRoutes.delete("/ingredients/:id", ingrendientController.deleteIngredient);

dishesRoutes.post("/ingredients", ingrendientController.addIngredient);

dishesRoutes.patch(
  "/:dish_id/image",
  verifyUserAuthorization("admin"),
  upload.single("image"),
  imageDishController.update
);

module.exports = dishesRoutes;
