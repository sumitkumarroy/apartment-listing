const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
    review: {
        type: String,
    },

    rating:{
        type: Number,
        required:true,
    },
    time: {
        type: Date,
        default: Date.now(),
    },
})
const Review = mongoose.model('Review',reviewSchema)
module.exports=Review


