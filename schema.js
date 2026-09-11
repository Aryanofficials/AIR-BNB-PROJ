const Joi = require("joi");
// const review = require("./models/review.js");

// For listing
module.exports.listingSchema = Joi.object({//Means inside Joi we have to be an object listing.
    listing : Joi.object({ // here a listing object and this listing obj is always required. Means for every req that we will geting listing obj is must require.
       title : Joi.string().required(),
       description : Joi.string().required(),
       price : Joi.number().required().min(0), // These all are key : value pairs inside listings object.
       location : Joi.string().required(),
       country : Joi.string().required(),
       image: Joi.object({
    url: Joi.string().allow("", null)
}).optional(),
 category: Joi.string()
      .valid(
        "Trending",
        "Room",
        "Iconic cities",
        "Mountains",
        "Castles",
        "Amazing Pools",
        "Camping",
        "Farms",
        "Arctic",
        "Boats"
      )
      .required(),
    }).required() //this listing obj is always require
});


// For review:
module.exports.reviewSchema = Joi.object({
    review : Joi.object({
    rating : Joi.number().required().min(1).max(5),
    comment : Joi.string().required()
    }).required(),
});
