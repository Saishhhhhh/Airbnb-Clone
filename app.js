require("dotenv").config();

// Core Module
const path = require('path');

// External Module
const express = require('express');
const mongoose = require("mongoose");
const session = require("express-session")    
const MongoDBStore = require("connect-mongodb-session")(session);
const multer =  require("multer");

//Local Module
const storeRouter = require("./routes/storeRouter")
const {hostRouter} = require("./routes/hostRouter")
const rootDir = require("./utils/pathUtil");
const errorsController = require("./controllers/errors");
const { authRouter } = require('./routes/authRouter');

const MONGO_DB_URL = process.env.MONGO_URL_2

const store = new MongoDBStore({
  uri : MONGO_DB_URL,
  collections : "sessions"
})

const storage = multer.diskStorage({
  destination: (req,res, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    if (!file) { 
      return cb(new Error("No file provided!")); // Handle undefined file error
    }
    cb(null, `${Date.now()}-${file.originalname}`);
  },
})

const fileFilter = (req,file,cb) => {
  const isValidFile = ["image/png", "image/jpeg", "image/jpg"].includes(file.mimetype);
  cb(null, isValidFile);   
}

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use("/uploads", express.static(path.join(rootDir, "uploads")));  
app.use(multer({storage, fileFilter}).single("photo"))  

app.use(express.urlencoded({extended : true}));

app.use(session({  
    secret: "Secret Key that will sign the session ID cookie",    
    resave: false,           
    saveUninitialized: false,  
    store: store    
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