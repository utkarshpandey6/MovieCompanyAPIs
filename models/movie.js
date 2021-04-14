const Joi = require('joi')
const mongoose = require('mongoose')
Joi.objectId = require('joi-objectid')(Joi)
const {genreSchema} = require('./genre')

const movieSchema = new mongoose.Schema({
	title: {
		type: String,
		maxlength: 25,
		minlength: 1,
		trim: true,
		required: true,
	},
	genre: {
		type: genreSchema,
		required: true,
	},
	numberInStocks: {
		type: Number,
		min: 0,
		required: true,
		max: 255,
	},
	dailyRentalRate: {
		type: Number,
		min: 0,
		required: true,
		max: 255,
	},
})

const Movie = mongoose.model('movies', movieSchema)

function validateMovies(body) {
	const schema = {
		title: Joi.string().min(3).max(25).required(),
		dailyRentalRate: Joi.number().max(255).min(0).required(),
		numberInStocks: Joi.number().max(255).min(0).required(),
		genreId: Joi.objectId().required(),
	}
	return Joi.validate(body, schema)
}

exports.Movie = Movie
exports.validateMovies = validateMovies
