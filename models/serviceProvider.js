const mongoose = require('mongoose')
const Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');

const bcrypt = require('bcrypt');

const serviceProviderSchema = new Schema({

    id: Number,

    username: { 
        type: String, 
        required : [true, 'Please provide a username'],
        unique: {
            value: true,
            message: 'Username already exists. Please provide a new username'
          }
    },

    password: { 
        type: String, 
        required : [true, 'Please provide a password']
    },

    firstname: { 
        type: String, 
        required : [true, 'Please enter the firstname']
    },

    lastname: { 
        type: String, 
        required : [true, 'Please enter the lastname']
    },
    
    email: { 
        type: String, 
        required : [true, 'Please enter the email'],
        unique:  [true, 'Email already exists. Please provide a new email']
    },

    contactnumber: { 
        type: String, 
        required : [true, 'Please enter the contact number'],
        unique:  [true, 'Contact number already exists. Please provide a new contact number']
    },

});

serviceProviderSchema.plugin(uniqueValidator);

serviceProviderSchema.pre('save', function(next){
    const serviceprovider = this;

    bcrypt.hash(serviceprovider.password, 9 , (error, hashpassword) => {
        serviceprovider.password = hashpassword
        next()
    })
})

const ServiceProvider = mongoose.model('ServiceProvider', serviceProviderSchema, "service_providers");
module.exports = ServiceProvider;