var mongoose = require("mongoose");
var campgroundSchema = new mongoose.Schema({
   name: String,
   image: String,
   price : String,
   description: String,
   author : {
     id : {
       type : mongoose.Schema.Types.ObjectId,
       ref : "User"
     },
     username : String
   },
   comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
   ]
});

module.exports = mongoose.model("Campground", campgroundSchema);

// Campground.create({
//   name:"Dewey point",
//   image:"https://www.reserveamerica.com/webphotos/racms/articles/images/bca19684-d902-422d-8de2-f083e77b50ff_image2_GettyImages-677064730.jpg",
//   description : "Early morning fresh beauty, crisp nature view."
// }, function(err, campground){
//   if(err){
//     console.log(err);
//   } else{
//     console.log("CREATEd Campground");
//     console.log(campground);
//   }
// });
