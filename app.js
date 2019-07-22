var http                  = require('http'),
    User                  = require('./models/user'),
    flash                 = require('connect-flash'),
    seedDB                = require("./seeds"),
    express               = require('express'),
    Comment               = require("./models/comment"),
    bodyParser            = require('body-parser'),
    Campground            = require("./models/campgrounds"),
    mongoose              = require('mongoose'),
    passport              = require('passport'),
    LocalStrategy         = require('passport-local'),
    methodOverride        = require('method-override'),
    passportLocalMongoose = require('passport-local-mongoose');

var indexRoutes      = require('./routes/index'),
    commentRoutes    = require('./routes/comments'),
    campgroundRoutes = require('./routes/campgrounds');

var server = http.createServer(function(req, res){
  res.statusCode = 200;
});

var app= express();

app.use(bodyParser.urlencoded({extended : true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname+"/public"));
app.use(flash());

mongoose.connect("mongodb://localhost:27017/yelpcamp", {useNewUrlParser : true});
// seedDB();

app.use(require('express-session')({
  secret            : "Hey there lovely",
  resave            : false,
  saveUninitialized : false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});
app.use(methodOverride("_method"));

app.use(indexRoutes);
app.use(campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(3000, function(){
  console.log("YelpCamp serving now...");
});
