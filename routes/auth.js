const { User, validateLoginUser } = require('../models/user')
const asyncMiddleWare = require('../middleware/async')
const express = require('express')
const _ = require('lodash')
const bcrypt = require('bcrypt')
const route = express.Router()

route.post('/', asyncMiddleWare(async (req, res) => {
	const { error } = validateLoginUser(req.body)
	if (error) return res.status(400).send(error.details[0].message)
	let user = await User.findOne({ email: req.body.email })
	if (!user) return res.status(400).send('No user or wrong password')
	const validPassword = await bcrypt.compare(req.body.password, user.password)
	if (!validPassword) return res.status(400).send('No user or wrong password')

	const token = user.generateAuthenticationToken()
	res.header('x-auth-token', token).send(_.pick(user, ['name', 'email', '_id']))
}))

module.exports = route
