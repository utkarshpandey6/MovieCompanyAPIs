const _ = require('lodash')
const asyncMiddleWare = require('../middleware/async')
const bcrypt = require('bcrypt')
const { User, validateNewUser } = require('../models/user')
const express = require('express')
const auth = require('../middleware/auth')
const route = express.Router()

route.get('/me', auth, asyncMiddleWare(async (req, res) => {
	const user = await User.findById(req.user._id)
	if (!user) res.statu(404).send('No user found')
	res.send(_.pick(user, ['name', 'email', '_id']))
}))

route.post('/', asyncMiddleWare(async (req, res) => {
	const { error } = validateNewUser(req.body)
	if (error) return res.status(400).send(error.details[0].message)
	let user = await User.findOne({ email: req.body.email })
	if (user) return res.status(400).send('User already exists')

	user = new User(_.pick(req.body, ['name', 'email', 'password']))
	const salt = await bcrypt.genSalt(10)
	user.password = await bcrypt.hash(user.password, salt)
	await user.save()
	const token = user.generateAuthenticationToken()
	res.header('x-auth-token', token).send(_.pick(user, ['name', 'email', '_id']))
}))

module.exports = route
