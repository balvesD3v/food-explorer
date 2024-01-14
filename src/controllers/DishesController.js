const knex = require("../database/knex");
const AppError = require("../utils/AppError");

class DishesController {
  async createDishes(request, response) {
    try {
      const { name, description, ingredients, discount, categories, price } =
        request.body;
      const user_id = request.user.id;

      const user = await knex("users").where({ id: user_id }).first();

      if (!user) {
        throw new AppError("Usuário não encontrado", 404);
      }

      const dishesExists = await knex("dishes").where({ name }).first();

      if (dishesExists) {
        throw new AppError("Um prato com o mesmo nome já existe");
      }

      const [dish_id] = await knex("dishes").insert({
        name,
        user_id,
        description,
        discount,
        price,
        categories,
      });

      const ingredientsInsert = ingredients.map((name) => {
        return {
          name,
          dishes_id: dish_id,
          user_id,
        };
      });

      const insertInIngredients = await knex("ingredients").insert(
        ingredientsInsert
      );

      return response.status(201).json({ dish_id });
    } catch (error) {
      console.error("Error during dish creation:", error);
      return response
        .status(500)
        .json({ error: "Erro durante a criação do prato" });
    }
  }

  async searchDishes(request, response) {
    const { name, ingredients } = request.query;

    try {
      let dishes;

      if (!name && !ingredients) {
        // Se tanto name quanto ingredients não estiverem presentes,
        // retorna todos os pratos
        dishes = await knex("dishes").select("*");
      } else if (ingredients) {
        const filterIngredients = ingredients
          .split(",")
          .map((tag) => tag.trim());

        // Se ingredients estiver presente, mas não name, realiza uma busca
        // considerando apenas os ingredients
        dishes = await knex("dishes")
          .select(["dishes.id", "dishes.name", "dishes.user_id"])
          .join("ingredients", "dishes.id", "ingredients.dishes_id")
          .where("dishes.name", "like", `%${name || ""}%`)
          .whereIn("ingredients.name", filterIngredients)
          .orderBy("dishes.name");
      } else {
        // Se name estiver presente, mas não ingredients, realiza uma busca
        // considerando apenas o name
        dishes = await knex("dishes")
          .where("name", "like", `%${name}%`)
          .orderBy("name");
      }

      return response.json(dishes);
    } catch (error) {
      console.error("Erro no servidor:", error);
      return response.status(500).json({ error: "Erro interno do servidor" });
    }
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
    const { newNameDish, newDescription, newDiscount, newPrice, newCategory } =
      request.body;
    const { dish_id } = request.params;

    const dish = await knex("dishes").where({ id: dish_id }).first();
    if (!dish) {
      throw new AppError("Este prato não existe");
    }

    await knex("dishes").where({ id: dish_id }).update({
      name: newNameDish,
      description: newDescription,
      discount: newDiscount,
      price: newPrice,
      categories: newCategory,
    });

    const updatedDish = await knex("dishes").where({ id: dish_id }).first();

    return response.json({ dish_id });
  }

  async deleteDish(request, response) {
    const { dish_id } = request.params;

    const dish = await knex("dishes").where({ id: dish_id }).first();

    if (!dish) {
      throw new AppError("Couldn't find dish", 404);
    }

    await knex("dishes").where({ id: dish_id }).delete();

    return response.json("Prato deletado");
  }

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

module.exports = DishesController;
