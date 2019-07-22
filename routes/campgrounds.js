var express = require("express");
var router = express.Router();

var Campground = require('../models/campgrounds'),
    Comment    = require('../models/comment'),
    middleware = require('../middleware');

//INDEX ROUTE
router.get("/campgrounds", function(req, res){
  Campground.find({}, function(err, allCampgrounds){
    if(err){
      console.log(err);
    } else{
        res.render("campgrounds/index", {campgrounds : allCampgrounds});
    }
  });
});

//CREATE ROUTE
router.get("/campgrounds/new", middleware.isLoggedIn, function(req, res){
  res.render("campgrounds/new");
});
router.post("/campgrounds", middleware.isLoggedIn, function(req, res){
  var name = req.body.name;
  var price = req.body.price;
  var image = req.body.image;
  var desc = req.body.description;
  var author = {
    id : req.user._id,
    username : req.user.username
  };
  var newCampground = {name:name, price:price, image:image, description:desc, author : author};
  Campground.create(newCampground, function(err, newlyCreated){
    if(err){
      req.flash("error", "Something went wrong.");
      console.log(err);
    } else{
        req.flash("success", "Successfully added campground.");
        res.redirect("/campgrounds");
    }
  });
});

//SHOW ROUTE
router.get("/campgrounds/:id", function(req, res){
  Campground.findById(req.params.id).populate("comments").exec(function(err, foundGround){
    if(err){
      req.flash("error", "Campground not found.");
      console.log(err);
    }
    else {
      res.render("campgrounds/show", {campground : foundGround});
    }
  });
});

//EDIT ROUTE
router.get("/campgrounds/:id/edit", middleware.checkCampgroudOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundGround){
          res.render("campgrounds/edit", {campground : foundGround});
    });
});

//UPDATE ROUTE
router.put("/campgrounds/:id", middleware.checkCampgroudOwnership, function(req, res){
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
    if(err){
      req.flash("error", "Campground not found.");
      console.log(err);
    }else{
      req.flash("success", "Successfully updated campground.");
      res.redirect("/campgrounds/"+req.params.id);
    }
  });
});

//DESTROY ROUTE
router.delete("/campgrounds/:id", middleware.checkCampgroudOwnership, function(req, res){
  Campground.findByIdAndRemove(req.params.id, function(err){
    if(err){
      req.flash("error", "Campground not found.");
      console.log(err);
    } else{
      req.flash("success", "Successfully deleted campground.");
      res.redirect("/campgrounds");
    }
  });
});

module.exports = router;
