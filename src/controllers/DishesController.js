const knex = require("../database/knex");
const AppError = require("../utils/AppError");

class DishesController {
  async createDishes(request, response) {
    const { name, description, ingredients, discount, price } = request.body;
    const { user_id } = request.params;

    const user = await knex("users").where({ id: user_id }).first();

    if (!user) {
      throw new AppError("Usuário não encontrado", 404);
    }

    const dishesExists = await knex("dishes").where({ name }).first();

    if (dishesExists) {
      throw new AppError("Um prato com o mesmo nome já existe");
    }

    const [dishes_id] = await knex("dishes").insert({
      name,
      description,
      discount,
      price,
    });

    const ingredientsInsert = ingredients.map((name) => {
      return {
        name,
        dishes_id,
        user_id,
      };
    });

    await knex("ingredients").insert(ingredientsInsert);

    return response
      .status(201)
      .json({ message: { name, description, price, discount, user_id } });
  }

  async showDishes(request, response) {
    const { id } = request.params;

    const dishes = await knex("dishes").where({ id }).first();
    const ingredients = await knex("ingredients")
      .where({ dishes_id: id })
      .orderBy("name");

    return response.json({ ...dishes, ingredients });
  }

  async updateDish(request, response) {
    const { nameDishe } = request.body;

    const nameDishesExists = await knex("dishes").where({ name: nameDishe });
    if (!nameDishesExists || nameDishesExists.length === 0) {
      throw new AppError("Este prato não existe");
    }

    return response.json(nameDishesExists);
  }
}

module.exports = DishesController;
