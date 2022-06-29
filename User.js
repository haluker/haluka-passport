const mongoose = require('mongoose')

// Schema
const UserSchema = new mongoose.Schema({
    username:{
		type: String,
		unique: true,
		required:true
	},
	email: {
		type: String,
		unique: true,
		required: true,
	},
	name : {
		type: String,
		required: true
	},
    hash: {
        type: String,
        required: true
    },
	activated : {
		type: Boolean,
		default: false
	},
},  {
	timestamps: true
})

exports.default = UserSchema