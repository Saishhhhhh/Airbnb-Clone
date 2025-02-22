const Home = require("../models/home");
const { deleteFile } = require("../utils/file");

exports.getAddHome = (req, res, next) => {
  res.render("host/edit-home", {
    pageTitle: "Add Home to airbnb",
    currentPage: "addHome",
    editing: false,
    isLoggedIn: req.session.isLoggedIn,
    user: req.session.user,
  });
};

exports.getEditHome = (req, res, next) => {
  const homeId = req.params.homeId;
  const editing = req.query.editing === "true";   

  Home.findById(homeId).then(home => {
    if(!home){
      console.log("Home not found for editing");
      return res.redirect("/host/host-home-list");
    }

    // console.log(homeId, editing, home);
    res.render("host/edit-home", {
      home: home,
      pageTitle: "Edit your Home",
      currentPage: "host-homes",
      editing: editing,
      isLoggedIn: req.session.isLoggedIn,
      user: req.session.user,
    });

  }).catch((err) => {
    console.error('Error:', err);
  })
};

exports.postAddHome = (req, res, next) => {
  const { houseName, price, location, rating, description } = req.body;
  const hostId = req.session.user._id;

  console.log('Req body: ', req.body);
  console.log('House Photo: ', req.file);

  if (!req.file) {
    return res.status(400).send('No valid image provided');
  }

  const photoURL = "/" + req.file.path;

  const newHome = new Home({
    houseName, price, location, rating, photoURL, description, hostId
  })
  newHome.save()
  .then(function(rows){ 
       
    res.redirect("host-home-list")   

  })
  .catch((err) => {
    console.error('Error:', err);
  })
};

exports.getHostHomes = (req, res, next) => {
  Home.find({hostId: req.session.user._id}).then(registeredHomes => {
    res.render("host/host-home-list", {
      registeredHomes: registeredHomes,
      pageTitle: "Home Homes List",
      currentPage: "host-homes",
      isLoggedIn: req.session.isLoggedIn,
      user: req.session.user,
    })
  })
  .catch((err) => {
    console.error('Error:', err);
  })
};

exports.postEditHome = async (req, res, next) => {
  try {
    // Destructure the fields from req.body
    const { id, houseName, price, location, rating, description } = req.body;

    console.log('Req body: ', req.body);
    console.log('House Photo: ', req.file);


    // Find the home by its ID
    const home = await Home.findById(id);

    // If no home is found, redirect to the list
    if (!home) {
      console.log("Home not found for editing");
      return res.redirect("/host/host-home-list");
    }

    // Update the home details
    home.houseName = houseName;
    home.price = price;
    home.location = location;
    home.rating = rating;
    if(req.file){
      deleteFile(home.photoURL.substring(1));
      home.photoURL = "/"+req.file.path;
    }
    home.description = description;

    // Save the updated home document
    await home.save();

    // Redirect after successful save
    res.redirect("/host/host-home-list");
  } 
  catch (err) {
    console.log("Error while updating home", err);
    next(err); // Pass the error to the next middleware (e.g., error handler)
  }
};


exports.postDeleteHome = (req,res,next) => {
  const homeId = req.params.homeId;

  // console.log("Came to delete", homeId);
  Home.findByIdAndDelete(homeId)          
  .then(()=>{    
    res.redirect("/host/host-home-list");
  }).catch(error => {
    console.log("Error while deleting", error);
  }   
  )
}