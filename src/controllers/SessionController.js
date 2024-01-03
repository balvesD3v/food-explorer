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

    const token = sign({ role: user.role }, secret, {
      subject: String(user.id),
      expiresIn,
    });

    response.cookie("token", token, {
      httpOnly: true,
      sameSite: "none",
      secure: "true",
      maxAge: 15 * 60 * 1000,
    });

    delete user.password;

    return response.json({ user });
  }
}

module.exports = SessionController;
