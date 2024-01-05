const DiskStorage = require("../providers/DiskStorage");
const knex = require("../database/knex");
const AppError = require("../utils/AppError");

const diskStorage = new DiskStorage();

class ImageDishController {
  async uploadImage(request, response) {
    try {
      const imageFilename = request.file.filename;

      const filename = await diskStorage.saveFile(imageFilename);

      const dish = await knex("dishes").first();

      if (!dish) {
        return response.status(404).json({ error: "Prato não encontrado" });
      }

      dish.image = filename;

      await knex("dishes").insert({ image: filename });

      return response.json(dish);
    } catch (error) {
      console.error(error);
      return response.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  async updateImage(request, response) {
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
