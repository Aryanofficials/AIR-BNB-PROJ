const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");


// mongoos connection code
const MONGOOSE_URL = "mongodb://127.0.0.1:27017/wanderLust";

main().then((res)=>{
    console.log("Connected to DB");
}).catch((err)=>{
    console.log(err);
})

async function main(){
   await mongoose.connect(MONGOOSE_URL);
}


const initDB = async ()=>{
   await Listing.deleteMany({});
   initData.data = initData.data.map((obj) => ({...obj, owner:"6a0360354bcc67148eb1c79f"})) //This map will add a new property for all the individual objects in my data. For that we are converting our obj into new obj(...obj) and also define an owner with an id;
   await Listing.insertMany(initData.data);
   console.log("Data was initalized");
}

initDB();