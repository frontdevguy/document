var express = require("express"),
    bodyParser = require("body-parser"),
    cookieParser = require("cookie-parser"),
    session = require("express-session"),
    flash = require("express-flash-2"),
    dotenv = require("dotenv"),
    morgan = require("morgan"),
    ejs = require("ejs"),
    firebase = require("firebase");

var routes = require("./routes/routes.js"),

    app = express();

// Initialize Firebase
  var config = {
    apiKey: "AIzaSyDi-dpCBd-XTbc3a3JaA8vzO1jn4_vzETQ",
    authDomain: "document-manager-ec280.firebaseapp.com",
    databaseURL: "https://document-manager-ec280.firebaseio.com",
    projectId: "document-manager-ec280",
    storageBucket: "document-manager-ec280.appspot.com",
    messagingSenderId: "621475035321"
  };
  firebase.initializeApp(config);


app.set("port", process.env.PORT || 3000); 

//set the view engine with directory
app.set("views", (__dirname + "/views"));
app.set("view engine", "ejs");

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(cookieParser("secret"));
app.use(session({
    secret: "12$!45*&^98836673!!##6590",
    resave: true,
    saveUninitialized: true }));
app.use(flash());
app.use( routes);



app.use(express.static(__dirname + "/public"));
app.listen(3000, function(){console.log("server is running on port " + app.get("port"))});


