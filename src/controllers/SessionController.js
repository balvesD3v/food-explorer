const knex = require("../database/knex");
const AppError = require("../utils/AppError");
const bcrypt = require("bcrypt");
const authConfig = require("../configs/auth");
const { sign } = require("jsonwebtoken");

class SessionController {
  async createSession(request, response) {
    const { email, password } = request.body;

    const user = await knex("users").where({ email }).first();

    if (!user) {
      throw new AppError("Email e senha incorretos", 401);
    }

    const passwordChecked = await bcrypt.compare(password, user.password);

    if (!passwordChecked) {
      throw new AppError("Email e senha incorretos", 401);
    }

    const { expiresIn, secret } = authConfig.jwt;
    const token = sign({}, secret, {
      subject: String(user.id),
      expiresIn,
    });

    return response.json({ user, token });
  }
}

module.exports = SessionController;
