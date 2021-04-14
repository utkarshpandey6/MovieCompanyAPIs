const asyncMiddleWare = require('../middleware/async')
const express = require('express')
const route = express.Router()
const auth = require('../middleware/auth')
const { Genre, validateGenres } = require('../models/genre')

route.get('/', asyncMiddleWare(async (req, res) => {

	const genres = await Genre.find()
	res.send(genres)
}))

route.get('/:id', asyncMiddleWare(async (req, res) => {
	const genre = await Genre.findById(req.params.id)
	if (!genre) return res.status(404).send('Id not found')
	res.send(genre)
}))

route.post('/', asyncMiddleWare(async (req, res) => {
	const { error } = validateGenres(req.body)
	if (error) return res.status(400).send(error.details[0].message)
	let genre = new Genre({
		name: req.body.name,
	})
	genre = await genre.save()
	res.send(genre)
}))

route.put('/:id', asyncMiddleWare(async (req, res) => {
	const { error } = validateGenres(req.body)
	if (error) return res.status(400).send(error.details[0].message)
	const genre = await Genre.findByIdAndUpdate(
		req.params.id,
		{ name: req.body.name },
		{ new: true }
	)

}))
route.delete('/:id', asyncMiddleWare(async (req, res) => {
	const result = await Genre.findByIdAndRemove(req.params.id)
	res.send(result)

}))

module.exports = route
