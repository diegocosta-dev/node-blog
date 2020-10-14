const mongoose = require('mongoose')
require('../../models/Category')
require('../../models/Posts')
const Category = mongoose.model('Categories')
const Post = mongoose.model('Posts')


// ----------------------- functions ------------------------------------

const Posts = {

    createPost: async (req, res) => {
        let error = []
        
        // verifys 
        const vertfyTitle = !req.body.title || typeof req.body.title == undefined || req.body.title == null
        const verifySlug = !req.body.slug || typeof req.body.slug == undefined || req.body.slug == null
        const verifyContent = !req.body.content || typeof req.body.content == undefined || typeof req.body.content == null
        const verifyCategory = req.body.category == 0

        if (vertfyTitle) {error.push({text: 'Título inválido'})}

        if (verifySlug) {error.push({text: 'Slug inválido'})}

        if (verifyContent) {error.push({text: 'Conteúdo inválido'})}

        if (verifyCategory) {error.push({text: 'Erro: selecione uma categoria'})}

        if (error.length > 0) {res.render("admin/addposts", {error: error})}
        else {
            const newPost = {
                title: req.body.title,
                slug: req.body.slug,
                description: req.body.description,
                content: req.body.content,
                category: req.body.category
            }

            try{
                await new Post(newPost).save()
                req.flash('success_msg', 'Poste criado com sucesso')
                res.redirect('/admin/posts')
            }
            catch(err) {
                console.log(err)
                req.flash('error_msg', 'Erro ao criar o post tente novamente!')
                res.redirect('/admin/posts')
            }
            
        }

    },
    listAllPost : async (req, res) => {

        try {

            const posts = await Post.find().populate('category').sort({date: 'desc'}).lean()

            posts.forEach((item) => item.date = Posts.formatDate(item.date))

            res.render('admin/posts', {posts: posts})

        } catch (err) {
            console.log(err)
            req.flash('error_msg', "Erro ao listar os postes")
            res.redirect('/admin')
        }
    },

    edit: async (req, res) => {
        try {
            const id = req.params.id
            const post = await Post.findOne({_id: id})
            const categories = await Category.find().lean()
            res.render('admin/editpost', {post: post.toJSON(), categories: categories})
        } 
        catch (err) {
            req.flash('error_msg', "Erro ao carregar o post!")
            res.redirect('admin/posts')
        }
    },
    editPost: async (req, res) => {
        let error = []
        
        // verifys 
        const vertfyTitle = !req.body.title || typeof req.body.title == undefined || req.body.title == null
        const verifySlug = !req.body.slug || typeof req.body.slug == undefined || req.body.slug == null
        const verifyContent = !req.body.content || typeof req.body.content == undefined || typeof req.body.content == null
        const verifyCategory = req.body.category == 0

        if (vertfyTitle || verifySlug || verifyContent || verifyCategory) {error.push({text: 'Error'})}

        if (error.length > 0) {
            req.flash('error_msg', 'Erro ao tentar atualizar o post preencha os campos corretamente!')
            res.redirect('/admin/posts/edit/' + req.body.id)
        }
        else {
            try {
                const post = await Post.findOne({_id: req.body.id})

                post.title = req.body.title
                post.slug = req.body.slug
                post.description = req.body.description
                post.content = req.body.content
                post.category = req.body.category

                await post.save()

                res.redirect("/admin/posts")
            } catch (err) {
                req.flash("error_msg", 'Erro ao atualizar o post!')
                res.redirect("/admin/posts")
            }
        }
    },

    destroy: async (req, res) => {
        const post = await Post.findOne({_id: req.params.id})
        //console.log(post)
        res.render("admin/deletepost", {post: post.toJSON()})
    },

    destroyPost: async (req, res) => {
        try {

            await Post.deleteOne({_id: req.body.id})
            req.flash('success_msg', 'Poste deletado com sucesso')
            res.redirect('/admin/posts')

        } catch (err) {
            req.flash('error_msg', 'Erro ao deletar a postagem!')
            res.redirect('/admin/posts')
        }   
        
    },

    formatDate: (date) => {
            const year = date.getFullYear()
            const month = `0${date.getMonth() + 1}`.slice(-2)
            const day = `0${date.getDate()}`.slice(-2)

            return `${day}/${month}/${year}`
    }


}

module.exports = Posts