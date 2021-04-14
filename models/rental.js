const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)
const mongoose = require('mongoose')
const rentalSchema = new mongoose.Schema({
	customer: {
		type: new mongoose.Schema({
			name: {
				type: String,
				required: true,
			},
			phone: {
				type: String,
				required: true,
			},
			isGold: {
				type: Boolean,
				required: true,
			},
		}),
		required: true,
	},
	movie: {
		type: new mongoose.Schema({
			title: {
				type: String,
				required: true,
			},
			dailyRentalRate: {
				type: Number,
				required: true,
			},
		}),
		required: true,
	},
	dateOut: {
		type: Date,
		default: Date.now(),
		required: true,
	},
	dateReturned: {
		type: Date,
	},
	rentalFee: {
		type: Number,
		min: 0,
	},
})

const Rental = mongoose.model('rentals', rentalSchema)

function validateRental(body) {
	const schema = {
		customerId: Joi.objectId().required(),
		movieId: Joi.objectId().required(),
	}
	return Joi.validate(body, schema)
}

exports.Rental = Rental
exports.validateRental = validateRental
