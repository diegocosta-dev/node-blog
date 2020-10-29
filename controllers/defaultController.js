const mongoose = require('mongoose')
require('../models/Category')
require('../models/Posts')
const Category = mongoose.model('Categories')
const Post = mongoose.model('Posts')
const Image = mongoose.model('Images')

// ----------------------- functions ------------------------------------

const Default = {
    renderIndex: async  (req, res) => {
        try {

            const posts = await Post.find().populate('category').sort({date: 'desc'}).lean()
            const categories = await Category.find().sort({name: 'asc'}).lean()
            posts.forEach( async (item) => {
                item.date = Default.formatDate(item.date)
                const image = await Image.findOne({post: item._id})
                if (image) {
                    item.image = `${image.name}`
                }
                
            })

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
            const date = Default.formatDate(post.date)
            const image = await Image.findOne({post: post._id}).lean()
            res.render('post', {post: post.toJSON(), date: date, image: image})
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
                post.map(async (item) => {
                    item.date = Default.formatDate(item.date)
                    item.image = await Image.findOne({post: item._id}).lean()
                    return item
                })
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

module.exports = Default