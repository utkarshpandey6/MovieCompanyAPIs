const Joi = require('joi')
const mongoose = require('mongoose')
const genreSchema = new mongoose.Schema({
	name: {
		type: String,
		maxlength: 15,
		minlength: 3,
		required: true,
	},
})

const Genre = mongoose.model('genre', genreSchema)

function validateGenres(body) {
	const schema = {
		name: Joi.string().min(3).required(),
	}
	return Joi.validate(body, schema)
}

exports.Genre = Genre
exports.genreSchema = genreSchema
exports.validateGenres = validateGenres
