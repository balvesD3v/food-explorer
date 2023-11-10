const { Router } = require("express");
const SessionController = require("../controllers/SessionController");

const sessionController = new SessionController();
const sessionRoutes = Router();

sessionRoutes.post("/", sessionController.createSession);

module.exports = sessionRoutes;
