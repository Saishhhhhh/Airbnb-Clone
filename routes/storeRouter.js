// External Module
const express = require('express');
const storeRouter = express.Router();

// Local Module
const storeController = require("../controllers/storeController");
const { isAuth } = require('../controllers/authController');

storeRouter.get("/", storeController.getIndex);
storeRouter.get("/homes", isAuth, storeController.getHomes);
storeRouter.get("/bookings", isAuth, storeController.getBookings);
storeRouter.get("/favourites", isAuth, storeController.getFavouriteList);

storeRouter.get("/homes/:homeId", isAuth, storeController.getHomeDetails)
storeRouter.post("/favourites", isAuth, storeController.postAddToFavourite);
storeRouter.post("/favourites/delete/:homeId", isAuth, storeController.postRemoveFromFavourite);
storeRouter.get('/rules/:houseId', storeController.getRules);


module.exports = storeRouter;