const knex = require("../database/knex");
const AppError = require("../utils/AppError");
const DiskStorage = require("../providers/DiskStorage");

class ImageDishController {
  async update(request, respose) {
    const { dish_id } = request.params;
    const imageFileName = request.file.filename;

    const diskStorage = new DiskStorage();

    const dish = await knex("dishes").where({ id: dish_id }).first();

    if (!dish) {
      throw new AppError(
        "Somente usuários autenticados podem mudar o avatar",
        401
      );
    }
    if (dish.image) {
      await diskStorage.deleteFile(dish.image);
    }

    const filename = await diskStorage.saveFile(imageFileName);
    dish.image = filename;

    await knex("dishes").update(dish).where({ id: dish_id });
    return respose.json(dish);
  }

  async getImage(request, response) {
    const { id } = request.body;

    const checkDishExists = await knex("dishes").select("*").where({ id: id });

    if (!checkDishExists) {
      throw new AppError("Este prato não existe");
    }
    console.log(checkDishExists);
    return response.json(checkDishExists);
  }
}

module.exports = ImageDishController;
