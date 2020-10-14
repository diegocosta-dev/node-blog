const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const dbManager = require('./controllers/defaultController')
require('../models/Posts')
const Post = mongoose.model('Posts')

// -------------------- Routes ---------------------------------------

router.get('/', dbManager.renderIndex)
router.get('/post/:slug', dbManager.renderPost)
router.get('/category/:slug', dbManager.goToCategory)

module.exports = router;