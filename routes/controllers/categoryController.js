const mongoose = require('mongoose')
require('../../models/Category')
require('../../models/Posts')
const Category = mongoose.model('Categories')


// ----------------------- functions ------------------------------------

const Categories = {

    createCategory: async (req, res) => {
        let error = []

        const verifyName = !req.body.name || typeof req.body.name == undefined || req.body.name == null
        const verifySlug = !req.body.slug || typeof req.body.slug == undefined || req.body.slug == null
        const verifyIqual = await Categories.findIqual(req, res)

        if (verifyName) {
            error.push({text: "Nome inválido!"})
        }

        if (verifySlug) {
            error.push({text: "Slug inválido!"})
        }

        if (req.body.name.length < 3) {
            error.push({text: "O nome é muito pequeno!"})
        }
        
        if (req.body.name === verifyIqual) {
            error.push({text: `A categoria ${req.body.name} já existe!`})
        }
        
        if (error.length > 0) {
            res.render("admin/addcategories", {error: error})
        }
        else {
            
            const newCategory = {
                name: req.body.name,
                slug: req.body.slug
            }
            
            try {
            const createcategorie = await new Category(newCategory).save()
            req.flash('success_msg', "Categoria criada com sucesso")
            res.redirect('/admin/categories')

            } catch(err) {
                req.flash('error_msg', 'Erro ao criar a categoria, tente novamente!')
                res.redirect('/admin/categories')
            }
        }
    },

    listCategories: async (req, res) => {
        
        try {

            const categories = await Category.find().sort({date: 'desc'}).lean()
            categories.forEach((item) => item.date = Categories.formatDate(item.date))
            res.render('admin/categories', {categories: categories})

        } catch (err) {
            req.flash('error_msg', 'Erro ao listar as categorias')
            console.log('Erro: ' + err)
            res.redirect('/admin')
        }
    },

    findIqual: async (req, res) => {
        try {
            const categories = await Category.find({name: req.body.name})
            const lista = categories.map(category => category.toJSON())
            return lista[0].name
        } catch (err) {
            
        }
    },

    edit: async (req, res) => {
        try {

        const category = await Category.findOne({_id: req.params.id})
        
        res.render("admin/editcategory", {category: category.toJSON()})

        } catch (err) {
            req.flash('error_msg', 'Categoria não existe!')
            res.redirect('/admin/categories')
        }
    },

    editCategory: async (req, res) => {

        let error = []

        const verifyName = !req.body.name || typeof req.body.name == undefined || req.body.name == null
        const verifySlug = !req.body.slug || typeof req.body.slug == undefined || req.body.slug == null

        if (verifyName || verifySlug) {
            error.push({text: "Nome inválido!"})
        }

        if (req.body.name.length < 3) {
            error.push({text: "O nome é muito pequeno!"})
        }

        if (error.length > 0) {
            req.flash('error_msg', 'Erro ao tentar atualizar a categoria preencha os campos corretamente!')
            res.redirect('/admin/categories/edit/' + req.body.id)
        } 
        else {

            try {
                const category = await Category.findOne({_id: req.body.id})

                category.name = req.body.name
                category.slug = req.body.slug

                await category.save()
                req.flash('success_msg', 'Categoria editada com sucesso')
                res.redirect('/admin/categories')

            } catch (err) {
                req.flash('error_msg', 'Erro ao editar a catehoria!')
                res.redirect('/admin/categories')
            }
        }
    },

    destroy: async (req, res) => {

        try {
            const category = await Category.findOne({_id: req.params.id})
            res.render('admin/delete', {category: category.toJSON()})

        } catch (err) {
            req.flash('error_msg', 'Erro ao editar a catehoria!')
            res.redirect('/admin/categories')
        }
    },

    destroyCategory: async (req, res) => {
        try {
            await Category.deleteOne({_id: req.body.id})
            req.flash('success_msg', 'Categoria deletada!')
            res.redirect('/admin/categories')

        } catch (err) {
            req.flash('error_msg', 'Erro ao editar a catehoria!')
            res.redirect('/admin/categories')
        }
    },

    listAllCategories: async (req, res) => {
        try { 
            const categories = await Category.find().lean()

            res.render('admin/addposts', {categories: categories})
        } catch (err) {
            req.flash('error_msg', 'Erro ao carregar os posts')
            res.redirect('admin/posts')
        }
        
    },

    formatDate: (date) => {
            const year = date.getFullYear()
            const month = `0${date.getMonth() + 1}`.slice(-2)
            const day = `0${date.getDate()}`.slice(-2)

            return `${day}/${month}/${year}`
    },


}

module.exports = Categories