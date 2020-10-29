const express = require('express')
const router = express.Router()
const Default = require('../controllers/defaultController')
require('../models/Posts')

// -------------------- Routes ---------------------------------------

router.get('/', Default.renderIndex)
router.get('/post/:slug', Default.renderPost)
router.get('/category/:slug', Default.goToCategory)
module.exports = router;