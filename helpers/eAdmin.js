module.exports = {
    eAdmin: (req, res, next) => {

        if(req.isAuthenticated() && req.user.isAdmin == 1) {
            return next()
        }

        req.flash('error_msg', 'Você não é um adiministrador!')
        res.redirect('/')
    },
    eUser: (req, res, next) => {
        if(req.isAuthenticated() && req.user.isAdmin == 0) {
            return next()
        }

        req.flash('error_msg', 'Você não esta logado')
        res.redirect('/')
    }
}