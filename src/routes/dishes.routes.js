const { Router } = require("express");
const DishesController = require("../controllers/DishesController");
const userAuthenticated = require("../middlewares/userAuthenticated");
const verifyUserAuthorization = require("../middlewares/verifyUserAuthorization");

const dishesController = new DishesController();
const dishesRoutes = Router();
dishesRoutes.use(userAuthenticated);
dishesRoutes.post(
  "/:user_id",
  verifyUserAuthorization("admin"),
  dishesController.createDishes
);
dishesRoutes.get("/:id", dishesController.showDishes);
dishesRoutes.get("/", dishesController.searchDishes);
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

module.exports = dishesRoutes;
