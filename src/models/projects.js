const { Schema, model } = require("mongoose");

const ProjectSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    twitterFollowers: {
        type: String,
    },
    discrodFollowers: {
        type: String,
    },
    img: {
        type: String,
        default: "nothing"
    },
    _id: {
        type: String,
        required: true
    },
    hype:{
        type: Number
    },
    url:{
        type: String,
    },
}, {
    _id: false
})
 const Project = model('Project', ProjectSchema)
module.exports = {
Project
}