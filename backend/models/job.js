const mongoose = require('mongoose');

const JobSchema=mongoose.Schema({
    language: {
        type:String,
        required:true,
        enum:["cpp","py"]
    },
    filepath:{
        type:String,
        default:true,
    },
    submittedAt:{
        type:Date,
        default:Date.now(),
    },
    startedAt:{
        type:Date,
    },
    completedAt:{
        type:Date,
    },
    output:{
        type:String,
    },
    status:{
        type:String,
        default:"pending",
        enum:["pending","success","error"]
    }
});

const job = new mongoose.model('job',JobSchema);

module.exports = job;