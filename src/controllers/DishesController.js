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
    console.log("Search request:", request.query);

    try {
      let dishes;

      if (ingredients) {
        const filterIngredients = ingredients
          .split(",")
          .map((tag) => tag.trim());

        dishes = await knex("ingredients")
          .select(["dishes.id", "dishes.name", "dishes.user_id"])
          .whereLike("dishes.name", `%${name}%`)
          .whereIn("ingredients.name", filterIngredients)
          .innerJoin("dishes", "dishes.id", "ingredients.dishes_id")
          .orderBy("dishes.name")
          .distinct();
      } else if (name) {
        dishes = await knex("dishes")
          .select([
            "dishes.id",
            "dishes.name",
            "dishes.user_id",
            "dishes.categories",
            "dishes.description",
            "dishes.price",
            "dishes.image",
          ])
          .whereLike("dishes.name", `%${name}%`)
          .orderBy("name");
      } else {
        dishes = await knex("dishes").orderBy("name");
      }

      const userIngredients = await knex("ingredients");
      console.log("User ingredients:", userIngredients);

      const dishWithIngredient = dishes.map((dish) => {
        const dishIngredient = userIngredients.filter(
          (ingredient) => ingredient.dishes_id === dish.id
        );
        return {
          ...dish,
          ingredients: dishIngredient,
        };
      });

      console.log("Dishes with tags:", dishWithIngredient);

      return response.json(dishWithIngredient);
    } catch (error) {
      console.error("Error searching dishes:", error);
      return response.status(500).json({ error: "Internal Server Error" });
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
}

module.exports = DishesController;
