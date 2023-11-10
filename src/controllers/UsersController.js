const sqliteConnection = require("../database/sqlite/index");
const AppError = require("../utils/AppError");
const bcrypt = require("bcrypt");

class UsersController {
  async createUser(request, response) {
    const { name, email, password } = request.body;

    const database = await sqliteConnection();
    const checkUserExists = await database.get(
      "SELECT * FROM users WHERE email = (?)",
      [email]
    );

    if (checkUserExists) {
      throw new AppError("Este email já está em uso.");
    }

    const hashedPassoword = await bcrypt.hash(password, 10);

    await database.run(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassoword]
    );

    return response
      .status(201)
      .json({ name, email, password: hashedPassoword });
  }

  async updateUser(request, response) {
    const { name, email, password, updatedPassword } = request.body;
    const { id } = request.params;

    const database = await sqliteConnection();
    const user = await database.get("SELECT * FROM users WHERE id = (?)", [id]);

    if (!user) {
      throw new AppError("Esse usuário não existe");
    }

    const userWithUpdatedEmail = await database.get(
      "SELECT * FROM users WHERE email = (?)",
      [email]
    );

    if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id) {
      throw new AppError("Este email já está em uso");
    }

    user.name = name ?? user.name;
    user.email = email ?? user.email;

    if (updatedPassword && !password) {
      throw new AppError("Insira a senha antiga");
    }

    if (updatedPassword && password) {
      const checkOldPassword = await bcrypt.compare(password, user.password);

      if (!checkOldPassword) {
        throw new AppError("A senha antiga não é a mesma");
      }

      user.password = await bcrypt.hash(updatedPassword, 10);
    }

    await database.run(
      `
      UPDATE users SET 
      name = ?,
      email = ?,
      password = ?,
      updated_at = DATETIME('now') 
      WHERE id = ?`,
      [user.name, user.email, user.password, id]
    );

    return response.json("Usuário atualizado");
  }
}

module.exports = UsersController;
