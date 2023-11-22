const DiskStorage = require("../providers/DiskStorage");
const knex = require("../database/knex");
const AppError = require("../utils/AppError");

const diskStorage = new DiskStorage();

class ImageDishController {
  async updateImageDish(request, response) {
    try {
      const imageFilename = request.file.filename;

      const dish = await knex("dishes").first();

      if (!dish) {
        throw new AppError(
          "Somente usuário autorizados podem alterar a imagem"
        );
      }

      if (dish.image) {
        await diskStorage.deleteFile(dish.image);
      }

      const filename = await diskStorage.saveFile(imageFilename);
      dish.image = filename;

      await knex("dishes").where({ id: dish.id }).update({ image: dish.image });

      return response.json(dish);
    } catch (error) {
      console.error(error);
      return response.status(500).json({ error: "Erro interno do servidor" });
    }
  }
}

module.exports = ImageDishController;
