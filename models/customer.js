const mongoose = require('mongoose')
const Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');

const bcrypt = require('bcrypt');

const customerSchema = new Schema({

    id: Number,

    username: { 
        type: String, 
        required : [true, 'Please provide a username'],
        unique:  [true, 'Username already exists. Please provide a new username']
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
        type: Number, 
        required : [true, 'Please enter the contact number'],
        unique:  [true, 'Contact number already exists. Please provide a new contact number']
    },

    address: { 
        type: String, 
        required : [true, 'Please enter the address']
    }

});

customerSchema.plugin(uniqueValidator);

customerSchema.pre('save', function(next){
    const customer = this;

    bcrypt.hash(customer.password, 9 , (error, hashpassword) => {
        customer.password = hashpassword
        next()
    })
})

const Customer = mongoose.model('Customer', customerSchema, "customers");
module.exports = Customer;