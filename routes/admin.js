const express = require('express')
const router = express.Router()
const dbManager = require('./controllers/adminController')
const { eAdmin } = require('../helpers/eAdmin')

// -------------------- Routes ---------------------------------------

// get

router.get('/', eAdmin, (req, res) => res.render('admin/index'))

router.get('/categories/add', eAdmin, (req, res) => res.render('admin/addcategories'))

router.get('/categories', eAdmin, dbManager.seachCategories)

router.get('/categories/edit/:id', eAdmin, dbManager.update)

router.get('/categories/delete/:id', eAdmin, dbManager.delete)

router.get('/posts', eAdmin, dbManager.populateAll)

router.get('/posts/add', eAdmin, dbManager.findAllCategiries)

router.get('/posts/edit/:id', eAdmin, dbManager.updatePost)

router.get('/post/delete/:id', eAdmin, dbManager.deletePost)

// post

router.post('/categories/new', eAdmin, dbManager.createCategory)

router.post('/categories/edit', eAdmin, dbManager.updateCategory)

router.post('/categories/delete', eAdmin, dbManager.deleteCategory)

router.post('/posts/new', eAdmin, dbManager.createPost)

router.post('/posts/edit', eAdmin, dbManager.updatePostdb)

router.post('/post/delete', eAdmin, dbManager.DeletePostdb)



module.exports = router;