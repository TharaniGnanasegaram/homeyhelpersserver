const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const timeSlotsSchema = new Schema({

    id: Number,

    start_time: { 
        type: String
    },

    end_time: { 
        type: String
    },

    duration: { 
        type: String
    }

});


const TimeSlots = mongoose.model('TimeSlots', timeSlotsSchema, "time_slots");
module.exports = TimeSlots;