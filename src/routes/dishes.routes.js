const { Router } = require("express");
const DishesController = require("../controllers/DishesController");

const dishesController = new DishesController();
const dishesRoutes = Router();

dishesRoutes.post("/:user_id", dishesController.createDishes);
dishesRoutes.get("/:id", dishesController.showDishes);
dishesRoutes.get("/", dishesController.searchDishes);
dishesRoutes.put("/:id", dishesController.updateDish);

module.exports = dishesRoutes;
