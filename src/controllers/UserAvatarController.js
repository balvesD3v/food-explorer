const DiskStorage = require("../providers/DiskStorage");
const knex = require("../database/knex");
const AppError = require("../utils/AppError");

const diskStorage = new DiskStorage();

class UserAvatarController {
  async updateAvatar(request, response) {
    const user_id = request.user.id;
    const avatarFilename = request.file.filename;

    const user = await knex("users").where({ id: user_id }).first();

    if (!user) {
      throw new AppError(
        "Somente usuário autenticados podem mudar o avatar",
        401
      );
    }

    if (user.avatar) {
      await diskStorage.deleteFile(user.avatar);
    }

    const filename = await diskStorage.saveFile(avatarFilename);
    user.avatar = filename;

    await knex("users").update(user).where({ id: user.id });

    return response.json(user);
  }
}

module.exports = UserAvatarController;
