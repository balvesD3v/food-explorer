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
      throw new AppError("Este prato não existe", 404);
    }

    if (dish.image) {
      await diskStorage.deleteFile(dish.image);
    }

    const filename = await diskStorage.saveFile(imageFileName);
    dish.image = filename;

    await knex("dishes")
      .update({ image: imageFileName })
      .where({ id: dish_id });
    return respose.json(dish);
  }
}

module.exports = ImageDishController;
