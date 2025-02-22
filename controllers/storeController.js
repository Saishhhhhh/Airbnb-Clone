const path = require("path");
const Home = require("../models/home");
const User = require("../models/User");
const pathUtil = require("../utils/pathUtil");


exports.getIndex = async(req, res, next) => {
  try{

    const registeredHomes = await Home.find();   

      res.render("store/index", {
        registeredHomes: registeredHomes,
        pageTitle: "airbnb Homet",
        currentPage: "index",
        isLoggedIn: req.session.isLoggedIn,
        user: req.session.user,
    })
  }catch(err){
    console.error("Error fetching homes:", error);
  }
}

exports.getHomes = (req, res, next) => {
  Home.find().then(registeredHomes => {
    res.render("store/home-list", {
      registeredHomes: registeredHomes,
      pageTitle: "Home List",
      currentPage: "Home",
      isLoggedIn: req.session.isLoggedIn,
      user: req.session.user,
    })
  }).catch((err) => {
    console.error('Error:', err);
  })
};

exports.getBookings = (req, res, next) => {
    res.render("store/bookings", {
      pageTitle: "My Bookings",
      currentPage: "bookings",
      isLoggedIn: req.session.isLoggedIn,
      user: req.session.user,
    })
};

exports.getFavouriteList = async function(req, res, next){

  const userId = req.session.user._id;

  User.findById(userId)
  .populate("favouriteHomes")
  .then((user) => {
    res.render("store/favourite-list", {
          favouriteHomes: user.favouriteHomes,
          pageTitle: "My Favourites",
          currentPage: "favourites",
          isLoggedIn: req.session.isLoggedIn,
          user: req.session.user,
    })
  }).catch((err) => {
    console.error('Error:', err);
  })
}

exports.postAddToFavourite = async function (req, res, next) {
  try {
    const homeId = req.body.id;
    const userId = req.session.user._id;

    const user = await User.findById(userId);

    if (!user) {
      console.log("User not found");
      return res.redirect("/favourites");
    }

    if (!user.favouriteHomes.includes(homeId)) {
      user.favouriteHomes.push(homeId);
      await user.save();
    }

    res.redirect("/favourites");
  } catch (err) {
    console.log("Error while adding to favourites:", err);
    res.redirect("/favourites");
  }
};

exports.getHomeDetails = (req, res, next) => {
  const homeId = req.params.homeId;
  Home.findById(homeId).then(home => {
    if (!home){
      console.log("Home not found");
      res.redirect("/homes");  
    }else{
        res.render("store/home-detail", {
          home: home,
          pageTitle: "Home Detail",
          currentPage: "Home",
          isLoggedIn: req.session.isLoggedIn,
          user: req.session.user,
      })
    }
  }).catch((err) => {
    console.error('Error:', err);
  })
};

exports.postRemoveFromFavourite = (req,res,next)=>{
  const homeId = req.params.homeId;
  const userId = req.session.user._id;
  
  User.findById(userId)
    .then(user => {
      user.favouriteHomes = user.favouriteHomes.filter(id => id.toString() !== homeId);

      return user.save();
    })
    .then(() => {
      res.redirect("/favourites");
    })
    .catch((error) => {
      console.log("Error while removing from favourites ", error);
      res.redirect("/favourites");
    })
}

exports.getRules = (req,res,next) => {
  const rulesFilename = "Airbnb-Rules.pdf";
  const filePath = path.join(pathUtil, "rules", rulesFilename);
  res.download(filePath, "Rules.pdf");
}