const userControllers = require('../auth/auth.controller')

const express = require('express')

const router = express.Router()

router.post("/login", userControllers.login)

module.exports = router