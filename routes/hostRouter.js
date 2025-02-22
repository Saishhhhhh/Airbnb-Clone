// External Module
const express = require('express');
const hostRouter = express.Router();

// Local Module
const hostController = require("../controllers/hostController");
const { isAuth } = require('../controllers/authController');

hostRouter.get("/add-home", isAuth,hostController.getAddHome)

hostRouter.post("/add-home", isAuth, hostController.postAddHome)

hostRouter.get("/host-home-list", isAuth, hostController.getHostHomes)

hostRouter.get("/edit-home/:homeId", isAuth, hostController.getEditHome)

hostRouter.post("/edit-home", isAuth, hostController.postEditHome)

hostRouter.post("/delete-home/:homeId", isAuth, hostController.postDeleteHome);

exports.hostRouter = hostRouter;
