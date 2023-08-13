const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const serviceProviderAvailabilitySchema = new Schema({

    id: Number,

    serviceproviderservicesid : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'ServiceProviderService'
    },

    timeSlotid : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'TimeSlots'
    },

    servicedate: { 
        type: Date, 
        default: new Date() 
    },

    // starttime: { 
    //     type: String
    // },

    // endtime: { 
    //     type: String
    // },

    // duration: { 
    //     type: Number
    // },

    isavailable: {
        type: Boolean,
        default : true
    },

    isBooked: {
        type: Boolean,
        default : false
    }

});


const ServiceProviderAvailability = mongoose.model('ServiceProviderAvailability', serviceProviderAvailabilitySchema, "service_provider_availabilities");
module.exports = ServiceProviderAvailability;