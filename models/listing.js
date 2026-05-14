const mongoose = require("mongoose");
const Schema = mongoose.Schema; // So that we do not need to write it again and agian;
const Review = require("./review.js");


const listingschema = Schema({
    title : {
        type : String,
        required : true
    },

    description : String,

    image: {  
        url: String,
        filename: String,
    },

    price :{ 
    type : Number,
    required: true,
    min: 0
    },
    location : String,
    country : String,
    reviews : [
        {
            type : Schema.Types.ObjectId,
            ref : "Review",
        },
    ],
    owner:{
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    geometry: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      default: [0, 0],
    },
  },
});

listingschema.post("findOneAndDelete", async(listing)=>{
    if(listing){
     await Review.deleteMany({_id : {$in: listing.reviews}});
    };
});




const Listing = new mongoose.model("Listing", listingschema);
module.exports = Listing;