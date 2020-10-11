const mongoose = require('mongoose')
const bcryptjs = require('bcryptjs')
require('../models/Users')
const Users = mongoose.model('users')
const passport = require('passport')


// ----------------------- functions ------------------------------------

const dbManager = {
    register: (req, res) => {
        res.render('user/register')
    },

    login: (req, res) => {
        res.render('user/login')
    },

    loginUser: async (req, res, next) => {
        req.flash('success_msg', 'Logado com sucesso')
        passport.authenticate('local', {
            successRedirect: '/',
            failureRedirect: '/user/login',
            failureFlash: true
        })(req, res, next)
    },

    registerNewUser: async (req, res) => {
        let error = []

        const verifyName = !req.body.name || typeof req.body.name == null || typeof req.body.name == undefined
        const verifyEmail = !req.body.email || typeof req.body.email == null || typeof req.body.email == undefined
        const verifyPassword = !req.body.password || typeof req.body.password == null || typeof req.body.password == undefined
        const verifyPassword2 = !req.body.password2 || typeof req.body.password2 == null || typeof req.body.password2 == undefined

        // validações do cadastro de usuários
        if (verifyName) {error.push({err: 'Nome inválido!'})}
        if (verifyEmail) {error.push({err: 'Email inválido!'})}
        if (verifyPassword || verifyPassword2) {error.push({err: 'Senha inválido!'})}
        if (req.body.password != req.body.password2) {error.push({err: 'Senhas diferentes!'})}
        if (req.body.password.length < 4) error.push({err: 'Senha muito Curta, tente usar uma senha com mais de 4 caracteres!'})
        
        if (error.length > 0) {
            const values = {
                name: req.body.name,
                email: req.body.email
            }
            res.render('user/register', {error: error, values: values})
        }
        else {
            const email = await Users.findOne({email: req.body.email}).lean()

            if (email) {
                req.flash("error_msg", "Email já registrado")
                res.redirect('/user/register')
            }
            else {

                const user = {
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password
                }
                const newUser = await new Users(user)

                bcryptjs.genSalt(10, (err, salt) => {
                    bcryptjs.hash(newUser.password, salt, (err, hash) =>{
                        if (err) {
                            req.flash('error_msg', 'Houve um erro durante o salvamento do usuário')
                            res.redirect('/')
                        }
                        newUser.password = hash
                        try {   
                            newUser.save()
                            req.flash("success_msg", "Usuario cadastrado com sucesso")
                            res.redirect('/')
                        } 
                        catch (err) {
                            req.flash('error_msg', 'Houve um erro ao criar o usuario tente novamente!')
                            res.redirect('/')
                        }
                    })
                })
            }
        }
    }
    
}

module.exports = dbManager