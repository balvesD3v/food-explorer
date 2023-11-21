const { Router } = require("express");
const DishesController = require("../controllers/DishesController");
const userAuthenticated = require("../middlewares/userAuthenticated");

const dishesController = new DishesController();
const dishesRoutes = Router();
dishesRoutes.use(userAuthenticated);
dishesRoutes.post("/:user_id", dishesController.createDishes);
dishesRoutes.get("/:id", dishesController.showDishes);
dishesRoutes.get("/", dishesController.searchDishes);
dishesRoutes.put("/:dish_id", dishesController.updateDish);
dishesRoutes.delete("/:dish_id", dishesController.deleteDish);

module.exports = dishesRoutes;
