const mongoose = require('mongoose')
require('../../models/Category')
require('../../models/Posts')
const Category = mongoose.model('Categories')
const Post = mongoose.model('Posts')

// ----------------------- functions ------------------------------------

const dbManager = {
    renderIndex: async  (req, res) => {
        try {

            const posts = await Post.find().populate('category').sort({date: 'desc'}).lean()
            const categories = await Category.find().sort({name: 'asc'}).lean()
            posts.forEach(item => {item.date = dbManager.formatDate(item.date)})

            if (categories) {
                for (category in categories) {
                    const item = await Post.countDocuments({category: categories[category]._id}).lean()
                    categories[category].len = item
                }
            }
            res.render('index', {post: posts, categories: categories})

        } catch (err) {
            req.flash('error_msg', 'Erro ao carregar os posts')
            res.redirect('/')
        }
    },

    renderPost: async (req, res) => {
        try {
            const post = await Post.findOne({slug: req.params.slug}).populate('category')
            const date = dbManager.formatDate(post.date)
            res.render('post', {post: post.toJSON(), date: date})
        } catch (err) {
            req.flash('error_msg', 'Erro ao listar o post!')
            res.redirect('/')
        }
    },

    goToCategory: async (req, res) => {

        try {
            const category = await Category.findOne({slug: req.params.slug}).lean()

            if (category) {

                const post = await Post.find({category: category._id}).sort({date: 'desc'}).lean()
                post.forEach(item => {item.date = dbManager.formatDate(item.date)})
                res.render('posts', {post: post, categorie: category})

            }
            else{
                req.flash('error_msg', 'Erro: Catehoria não existe!')
                res.redirect('/')
            }

        } 
        catch (err) {
            req.flash('error_msg', 'Erro: Catehoria não existe!')
            res.redirect('/')
        }
    },

    formatDate: (date) => {
            const year = date.getFullYear()
            const month = `0${date.getMonth() + 1}`.slice(-2)
            const day = `0${date.getDate()}`.slice(-2)

            return `${day}/${month}/${year}`
    }


}

module.exports = dbManager