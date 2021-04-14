const express = require('express')
const asyncMiddleWare = require('../middleware/async')
const route = express.Router()
const { Customer, validateCustomer } = require('../models/customer')

route.get('/', asyncMiddleWare(async (req, res) => {
	try {
		const result = await Customer.find().sort({ name: 1 })
		res.send(result)
	} catch (ex) {
		res.status(500).send(ex.message)
	}
}))

route.post('/', asyncMiddleWare(async (req, res) => {
	const { error } = validateCustomer(req.body)
	if (error) res.status(400).send(error.message)

	let newCustomer = new Customer({
		name: req.body.name,
		phone: req.body.phone,
		isGold: req.body.isGold,
	})
	const result = await newCustomer.save()
	res.send(result)

}))

route.put('/:id', asyncMiddleWare(async (req, res) => {
	const { error } = validateCustomer(req.body)
	if (error) res.status(400).send(error.message)
	const customer = await Customer.findByIdAndUpdate(
		req.params.id,
		{
			name: req.body.name,
			isGold: req.body.isGold,
			phone: req.body.phone,
		},
		{ new: true }
	)
	if (!customer)
		return res
			.status(404)
			.send('The customer with the given ID was not found.')
	res.send(customer)

}))

route.delete('/:id', asyncMiddleWare(async (req, res) => {

	const customer = await Customer.findByIdAndRemove(req.params.id)
	if (!customer)
		return res
			.status(404)
			.send('The customer with the given ID was not found.')

	res.send(customer)

}))

route.get('/:id', asyncMiddleWare(async (req, res) => {

	const customer = await Customer.findById(req.params.id)

	if (!customer)
		return res
			.status(404)
			.send('The customer with the given ID was not found.')

	res.send(customer)

}))

module.exports = route
