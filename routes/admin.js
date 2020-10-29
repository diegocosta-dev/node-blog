const express = require('express')
const { eAdmin } = require('../helpers/eAdmin')
const Categories = require('../controllers/categoryController')
const Posts = require('../controllers/postsController')
const upload = require('../helpers/imageUpload')

const router = express.Router()




// -------------------- Routes ---------------------------------------

// get

router.get('/', eAdmin, (req, res) => res.render('admin/index'))

router.get('/categories/add', eAdmin, (req, res) => res.render('admin/addcategories'))
router.get('/categories', eAdmin, Categories.listCategories)
router.get('/categories/edit/:id', eAdmin, Categories.edit)
router.get('/categories/delete/:id', eAdmin, Categories.destroy)
router.get('/posts/add', eAdmin, Categories.listAllCategories)
router.get('/posts', eAdmin, Posts.listAllPost)
router.get('/posts/edit/:id', eAdmin, Posts.edit)
router.get('/post/delete/:id', eAdmin, Posts.destroy)

// post

router.post('/categories/new', eAdmin, Categories.createCategory)
router.post('/categories/edit', eAdmin, Categories.editCategory)
router.post('/categories/delete', eAdmin, Categories.destroyCategory)
router.post('/posts/new', eAdmin, upload.single('image'), Posts.createPost)
router.post('/posts/edit', eAdmin, Posts.editPost)
router.post('/post/delete', eAdmin, Posts.destroyPost)



module.exports = router;