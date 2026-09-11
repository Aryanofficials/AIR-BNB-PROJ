const Listing = require("../models/listing");

// Index route;
// Index route
module.exports.index = async (req, res) => {
    let { search, category } = req.query;

    let allListings;

    if (category) {
        allListings = await Listing.find({
            category: category
        });
    } 
    else if (search) {
        allListings = await Listing.find({
            location: {
                $regex: search,
                $options: "i"
            }
        });
    } 
    else {
        allListings = await Listing.find({});
    }

    res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm =  (req,res)=>{
    res.render("listings/new.ejs");
};

module.exports.showListings =  async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id)
    .populate({path: "reviews", //Here to populate author we pass an object in which our first paremeter is path parameter (path: "reviews") it means we want to populate reviews with our listing
        populate:{ //And for every individual review we want author in path. So, that was why we use nested populate here.
            path:"author",
        },
    })
    .populate("owner");
    if(!listing){
    req.flash("error", "The listing you requested was deleted!");
    return res.redirect("/listings");
    }
    
  res.render("listings/show.ejs", {
    listing,
    mapToken: process.env.MAP_TOKEN,
  });
};

module.exports.createListings = async (req,res)=>{
// let url = req.file.path; //here we extract url from req.file.path;
// let filename = req.file.filename; //here we extract url from req.file.filename;
//   let {title, description, price, location, country} = body.params; // We can also write an alternative of this which more compact to write in which we accessing the Listing obj which we created inside name field inside new.ejs;
let url;
let filename;

if(req.file){
    url = req.file.path;
    filename = req.file.filename;
} else {
    url = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrNvUtoax4idRkGcNKJdgRUO2SyO8bBD6FcJo_WQ-ZqUiYhmzVr5b8ZFc&s=10";
    filename = "default-image";
}
const location = req.body.listing.location;
const response = await axios.get(
  `https://api.maptiler.com/geocoding/${location}.json?key=${process.env.MAP_TOKEN}`
);
if(response.data.features.length === 0){
   req.flash("error", "Invalid location");
   return res.redirect("/listings/new");
}
const coordinates = response.data.features[0].center;

const newListing = new Listing(req.body.listing);

newListing.geometry = {
    type: "Point",
    coordinates: coordinates,
  };

newListing.owner = req.user._id;// Because we know that passpost stores the user related information inside the req.user and inside that we have an _id value where we have the information about our current user:
newListing.image = {url, filename};

await newListing.save();
req.flash("success", "New Listing Created!");
res.redirect("/listings");
};

module.exports.renderEditForm = async (req,res)=>{
    let {id} = req.params;  // Here we write these two lines because we also want to print the current data on form when we rendered to :id/edit
    const listing = await Listing.findById(id);
    if(!listing){
    req.flash("error", "The listing you requested was deleted!");
    return res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_100,w_150");  
    res.render("listings/edit.ejs", {listing, originalImageUrl});
};

module.exports.updateListing = async(req, res)=>{
    let {id} = req.params;
   let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});
// { new: true, runValidators: true }); // {...req.body.listing} uses the spread operator to copy all properties of the listing object into a new object.

if(typeof req.file !== "undefined"){ //typeof is use to check the value of any variable, is that variable is undefined or not.
let url = req.file.path;
let filename = req.file.filename;
listing.image = {url, filename};
await listing.save();
}
req.flash("success", "Listing Updated!"); 
res.redirect(`/listings/${id}`);
};

module.exports.destroyListing =  async(req,res)=>{
   let {id} = req.params;
   let deletedListing = await Listing.findByIdAndDelete(id); // await works ONLY with: Functions that return a Promise
   console.log(deletedListing);
   req.flash("success", "Listing Deleted!");
   res.redirect("/listings");
};


const axios = require("axios"); 

module.exports.createListing = async (req, res) => {
  const { location, country } = req.body.listing;

  // Geocode the location using MapTiler API
  const geoRes = await axios.get(
    `https://api.maptiler.com/geocoding/${encodeURIComponent(location + ", " + country)}.json?key=${process.env.MAP_TOKEN}`
  );

  const coords = geoRes.data.features[0]?.geometry?.coordinates || [0, 0];

  const newListing = new Listing({
    ...req.body.listing,
    owner: req.user._id,
    geometry: {
      type: "Point",
      coordinates: coords,  // [lng, lat] from MapTiler
    },
  });

  await newListing.save();
  req.flash("success", "New listing created!");
  res.redirect("/listings");
};