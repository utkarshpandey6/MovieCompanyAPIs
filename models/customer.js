const mongoose = require('mongoose')
const Joi = require('joi')

const customerSchema = new mongoose.Schema({
	name: {
		type: String,
		maxlength: 25,
		minlength: 3,
		required: true,
	},
	isGold: {
		type: Boolean,
		default: false,
	},
	phone: {
		type: String,
		required: true,
		minlength: 10,
		maxlength: 10,
		required: true,
	},
})

const Customer = mongoose.model('customer', customerSchema)
function validateCustomer(body) {
	const schema = {
		name: Joi.string().min(3).max(25).required(),
		phone: Joi.string().min(10).max(10).required(),
		isGold: Joi.boolean(),
	}
	return Joi.validate(body, schema)
}

exports.Customer = Customer
exports.validateCustomer = validateCustomer
