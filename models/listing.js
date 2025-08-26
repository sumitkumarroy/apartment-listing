const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required:true,
    },
    description:{
        type:String,
    },
    image : {
        filename: {
            type: String,
        },
        url :{
            type: String,
            default:
                "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdvYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
            set: (v)=>v===""?
                            "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdvYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"
                            :v,
        },
    },
    price:{
        type: Number,
        default:0,
        set: (p)=>p===""?0:p,
    },
    location:{
        type:String,
    },
    country:{
        type: String,
    },
})

const listing = mongoose.model("listing",listingSchema);
module.exports = listing;