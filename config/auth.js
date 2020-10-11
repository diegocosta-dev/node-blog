const localStrategy = require('passport-local').Strategy
const mongoose = require('mongoose')
const bcryptjs = require('bcryptjs')

// model of users
require('../models/Users')
const users = mongoose.model('users')

module.exports = function (passport) {

    passport.use(new localStrategy({usernameField: 'email', passwordField: 'password'}, async (email, password, done) => {
        
        try {

            const user = await users.findOne({email: email})

            if (!user) {
                return done(null, false, {message: "Conta não existe!"})
            }

            bcryptjs.compare(password, user.password, (erro, itsOk) => {
                if (itsOk) {
                    return done(null, user, {message: 'Logado com sucesso!'})
                }
                else {
                    return done(null, false, {message: 'Senha incorreta!'})
                }
            })


             
        }
        catch (err) {
            return done(null, false, {message: "Erro ao verificar a conta!"})
        }
    }))


    passport.serializeUser((user, done) => done(null, user.id))

    passport.deserializeUser(async (id, done) => {
        await users.findById(id, (err, user) => {
            done(err, user.toJSON())
        })
    })
}