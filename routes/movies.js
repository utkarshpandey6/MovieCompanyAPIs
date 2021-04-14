const express = require('express')
const asyncMiddleWare = require('../middleware/async')
const route = express.Router()
const { Movie, validateMovies } = require('../models/movie')
const { Genre } = require('../models/genre')

route.get('/', asyncMiddleWare(async (req, res) => {
	const movies = await Movie.find()
	res.send(movies)
}))

route.get('/:id', asyncMiddleWare(async (req, res) => {
	const movie = await Movie.findById(req.params.id)
	if (!movie) return res.status(404).send('Id not found')
	res.send(movie)
}))

route.post('/', asyncMiddleWare(async (req, res) => {
	const { error } = validateMovies(req.body)
	if (error) return res.status(400).send(error.details[0].message)
	console.log('passed')
	let genre

	genre = await Genre.findById(req.body.genreId)

	if (!genre) res.status(404).send('genre Id not found')



	let movie = new Movie({
		title: req.body.title,
		numberInStocks: req.body.numberInStocks,
		genre: {
			name: genre.name,
			_id: genre._id,
		},
		dailyRentalRate: req.body.dailyRentalRate,
	})

	movie = await movie.save()
	res.send(movie)

}))

module.exports = route
