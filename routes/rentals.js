const express = require('express')
const asyncMiddleWare = require('../middleware/async')
const route = express.Router()
const { Rental, validateRental } = require('../models/rental')
const { Movie } = require('../models/movie')
const { Customer } = require('../models/customer')

route.get('/', asyncMiddleWare(async (req, res) => {
	const rentals = await Rental.find()
	res.send(rentals)
}))

route.get('/:id', asyncMiddleWare(async (req, res) => {
	const rental = await Genre.findById(req.params.id)
	if (!rental) return res.status(404).send('Id not found')
	res.send(rental)
}))

route.post('/', asyncMiddleWare(async (req, res) => {
	const { error } = validateRental(req.body)
	if (error) return res.status(400).send(error.details[0].message)

	const movie = await Movie.findById(req.body.movieId)
	if (!movie) res.status(404).send('Movie with such id is not found')
	const customer = await Customer.findById(req.body.customerId)
	if (!customer) res.status(404).send('Customer with such id is not found')

	const rental = new Rental({
		customer: {
			name: customer.name,
			phone: customer.phone,
			isGold: customer.isGold,
			_id: customer._id,
		},
		movie: {
			title: movie.title,
			dailyRentalRate: movie.dailyRentalRate,
		},
	})


	await rental.save()
	res.send(rental)

}))

module.exports = route
