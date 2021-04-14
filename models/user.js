const Joi = require('joi')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const config = require('config')
const userSchema = new mongoose.Schema({
	name: {
		type: String,
		maxlength: 15,
		minlength: 3,
		required: true,
	},
	email: {
		type: String,
		minlength: 5,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		minlength: 6,
		maxlength: 1024,
		required: true,
	},
})
userSchema.methods.generateAuthenticationToken = function () {
	const token = jwt.sign(
		{
			_id: this._id,
		},
		config.get('jwtPrivateKey')
	)
	return token
}
const User = mongoose.model('user', userSchema)

function validateNewUser(body) {
	const schema = {
		name: Joi.string().min(3).max(15).required(),
		email: Joi.string().min(5).email().required(),
		password: Joi.string().min(6).required(),
	}
	return Joi.validate(body, schema)
}

function validateLoginUser(body) {
	const schema = {
		email: Joi.string().min(5).email().required(),
		password: Joi.string().min(6).required(),
	}
	return Joi.validate(body, schema)
}

exports.User = User
exports.userSchema = userSchema
exports.validateNewUser = validateNewUser
exports.validateLoginUser = validateLoginUser
