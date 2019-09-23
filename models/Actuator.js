const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Schema
const ActuatorSchema = new Schema({
    connection: {
        ip: {
            type: String,
            required: true
        },
        port: {
            type: String,
            required: true
        }
    },
    kind: {
        type: String,
        required: true
    },
    status: { type: Number },
    info: {
        name: { type: String },
        description: { type: String }
    },
    pinout:{
        pin: {type: Number},
        kind : {type: String}
    },
    date: {
        type: Date,
        default: Date.now()
    },
    active: {
        type: Boolean,
        default: true
    }
});

// Create model
mongoose.model('actuators', ActuatorSchema);