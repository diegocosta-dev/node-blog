const express = require('express')
const router = express.Router()
const User = require('../controllers/usersController')

// -------------------- Routes ---------------------------------------

// get
router.get('/register', User.register)
router.get('/login', User.login)
router.get('/logout', User.logout)

// post
router.post('/register', User.registerNewUser)
router.post('/login', User.loginUser)

module.exports = router;