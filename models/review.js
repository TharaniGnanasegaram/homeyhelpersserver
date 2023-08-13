const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const ReviewSchema = new Schema({

    id: Number,

    serviceproviderservicesid : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'ServiceProviderService'
    },

    customerid : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Customer'
    },

    reviewdate: { 
        type: Date, 
        default: new Date() 
    },

    reviewcomments: { 
        type: String,
        required : [true, 'Please provide the review comments']
    },

});


const Review = mongoose.model('Review', ReviewSchema, "reviews");
module.exports = Review;