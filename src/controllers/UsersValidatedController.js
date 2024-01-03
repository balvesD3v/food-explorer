const sqliteConnection = require("../database/sqlite/index");
const AppError = require("../utils/AppError");
const bcrypt = require("bcrypt");

class UsersValidatedController {
  async index(request, response) {
    const { user } = request;

    const checkUserExists = await knex("users").where({ id: user.id });

    if (checkUserExists === 0) {
      throw new AppError("Unauthorized", 401);
    }

    return response.stauts(200).json();
  }
}

module.exports = UsersValidatedController;
