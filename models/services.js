const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const serviceSchema = new Schema({

    id: Number,

    servicename: { 
        type: String, 
        required : [true, 'Please provide a service name']
    }

});


const Services = mongoose.model('Services', serviceSchema, "services");
module.exports = Services;