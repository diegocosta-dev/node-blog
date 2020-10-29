// loading modules
    const express = require('express');
    const handleBars = require('express-handlebars');
    const bodyParser = require('body-parser');
    const path = require('path')
    const mongoose = require('mongoose');
    const session = require('express-session')
    const flash = require('connect-flash')
    const passport = require('passport')
    const admin = require('./routes/admin')
    const defaultRoutes = require('./routes/defaultRoutes.js')
    const users = require('./routes/users')
    
    require('./config/auth')(passport)

    const app = express();
    

// configs

    // session
        app.use(session({
            secret: '!My@Blog**yM$',
            resave: true,
            saveUninitialized: true,
        }))

        app.use(passport.initialize())
        app.use(passport.session())

        app.use(flash())

    // midwares
        app.use((req, res, next) => {
            res.locals.success_msg = req.flash('success_msg')
            res.locals.error_msg = req.flash('error_msg')
            res.locals.error = req.flash('error')
            res.locals.user = req.user || null
            next()
        })

    //bodyParser
        app.use(bodyParser.urlencoded( {extended: true} ));
        app.use(bodyParser.json());

    // handleBars
        app.engine('handlebars', handleBars({defaultLayout: 'main'}));
        app.set('view engine', 'handlebars');

    // mongoose
        mongoose.connect("mongodb://localhost:27017/blog", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        })
        .then(() => console.log("Connected to database"))
        .catch((err) => console.log("Database Erro: " + err));

    // public
        app.use(express.static(path.join(__dirname, 'public')))

// routes
    app.use('/', defaultRoutes)
    app.use('/user', users)
    app.use('/admin', admin)

// others
    const PORT = 8081;
    app.listen(PORT, () => console.log('Server is ruinning...'));