const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const serviceProviderServiceSchema = new Schema({

    id: Number,

    serviceproviderid : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'ServiceProvider'
    },

    serviceid : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Services'
    },

    hourlyrate: { 
        type: Number, 
        required : [true, 'Please enter the hourly rate']
    },

    experience: { 
        type: String, 
        required : [true, 'Please mention your experience']
    },
    
});


const ServiceProviderServices = mongoose.model('ServiceProviderService', serviceProviderServiceSchema, "service_provider_services");
module.exports = ServiceProviderServices;