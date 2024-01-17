const knex = require("../database/knex");
const AppError = require("../utils/AppError");

class IngredientsController {
  async deleteIngredient(request, response) {
    const { id } = request.params;

    const ingredients = await knex("ingredients").where({ id: id });

    if (!ingredients.length) {
      throw new AppError("Este ingrediente não existe", 404);
    }

    const result = await knex("ingredients").where({ id: id }).delete();

    return response.json(result);
  }

  async addIngredient(request, response) {
    const { dishes_id, name } = request.body;
    const user_id = request.user.id;

    const ingredient = await knex("ingredients").insert({
      name,
      dishes_id,
      user_id,
    });

    return response.status(201).json({ ingredient });
  }
}

module.exports = IngredientsController;
