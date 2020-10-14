const express = require('express')
const router = express.Router()
const dbManager = require('./controllers/usersController')

// -------------------- Routes ---------------------------------------

// get
router.get('/register', dbManager.register)
router.get('/login', dbManager.login)

// post
router.post('/register', dbManager.registerNewUser)
router.post('/login', dbManager.loginUser)

module.exports = router;