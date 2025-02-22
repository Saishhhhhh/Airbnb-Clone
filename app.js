require("dotenv").config();

// Core Module
const path = require('path');

// External Module
const express = require('express');
const mongoose = require("mongoose");
const session = require("express-session")    //express sessions ko integrate karne keliye
const MongoDBStore = require("connect-mongodb-session")(session);
const multer =  require("multer");

//Local Module
const storeRouter = require("./routes/storeRouter")
const {hostRouter} = require("./routes/hostRouter")
const rootDir = require("./utils/pathUtil");
const errorsController = require("./controllers/errors");
const { authRouter } = require('./routes/authRouter');

const MONGO_DB_URL = "mongodb+srv://Saishhhhhh:Lmao_xd2@airbnbdatabase.6gacu.mongodb.net/"

const store = new MongoDBStore({
  uri : MONGO_DB_URL,
  collections : "sessions"
})

const storage = multer.diskStorage({
  destination: (req,res, cb) => {
    cb(null, "uploads/");
  },
  filename: (req,file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
})

//mimetype  ek file ka meta data hota hai jo file ka mime type save karta hai...like image/jpeg, image/gif etd
const fileFilter = (req,file,cb) => {
  const isValidFile = ["image/png", "image/jpeg", "image/jpg"].includes(file.mimetype);
  cb(null, isValidFile);   //agar file ke mimetype png,jpeg,jpg main se ek hoga toh isValidFile true return hoga
}

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use("/uploads", express.static(path.join(rootDir, "uploads")));  //isko static kardiya hai...matlab public folder ke jaise kardiya hai
app.use(multer({storage, fileFilter}).single("photo"))  //app.use() → Applies this middleware globally to all routes

app.use(express.urlencoded({extended : true}));

app.use(session({  //This is a middleware that will work everytime a request is sent to the server
    secret: "Secret Key that will sign the session ID cookie",    //This is the key that will sign and encrypt cookie
    resave: false,           //This controls session saving behavior. false: Session is not saved back to the store if it hasn't been modified. true: Session is saved back to the store even if nothing changed.
    saveUninitialized: false,  //false: A session is not created until something is stored in it.true: A session is created even if it’s empty.
    store: store    //store: store → This tells Express to use MongoDB to store sessions. Without this, sessions would be stored in memory, leading to scaling issues.
}))

app.use(storeRouter);

app.use("/host", (req,res,next) => {
  if(!req.session.isLoggedIn){
    return res.redirect("/login");
  }
  next();
})

app.use("/host", hostRouter);
app.use(authRouter);

app.use(express.static(path.join(rootDir, 'public')))

app.use(errorsController.pageNotFound)

const PORT = process.env.PORT || 3000;

async function MongooseConnection(){
  try{
    await mongoose.connect(process.env.MONGO_URL);   
    console.log("Connected to MongoDB");
    app.listen(PORT, function(){
      console.log(`Server running at: http://localhost:${PORT}`);
    });
  }
  catch(err){
    console.log("Error while connecting to MongoDB: ", err)
  }
}

MongooseConnection();