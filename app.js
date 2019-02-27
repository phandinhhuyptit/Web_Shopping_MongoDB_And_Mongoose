const express = require('express');
const app = express();
const port = 3000;
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const bodyParser = require('body-parser');
const path = require('path');
const User = require('./models/user');
// csrf attack 
const csrf = require('csurf');
// error massage
const flash = require('connect-flash');



app.set('view engine', 'ejs');
app.set('views', 'views');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/Auth');
const errorController = require('./controller/error404');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

const MongoDB_URI = 'mongodb+srv://PhanDinhHuy_1996:professionalhuy331@severwebshop-xbrlk.mongodb.net/Shop?retryWrites=true';

const store = new MongoDBStore({

    uri: MongoDB_URI,
    collection: 'mySession'
})
const csrfProtection = csrf(); 


app.use( 
    session(
        {
            secret: ' my secret',
            resave: false,
            saveUninitialized: false,
            store : store
        }));

// Middleware run into your views        
app.use(csrfProtection)
// Middleware run into your project
app.use(flash());

app.use((req, res, next) => {
    if(!req.session.user){

        return next();

    }

    User.findById(req.session.user._id)
        .then(user => {
            
            req.user = user;
            return next();
        })
        .catch(err => {
            console.log(err);
        })
});
app.use((req, res, next) => {
    // Middleware global to any routes 
    res.locals.isAuthenticated = req.session.isLoggedIn;
    // public csrfToken  
    res.locals.csrfToken = req.csrfToken();
    next();
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.use(errorController.GetError404);

mongoose.connect(MongoDB_URI,{ useNewUrlParser: true })
    .then(result => {
        User.findOne().
            then(user => {
                if (!user) {

                    const user = new User({

                        Name: " Huy",
                        Email: "Sihaojunvn2012@gmail.com",
                        Cart: {
                            Items: []
                        }
                    });
                    user.save();
                }
            })

        app.listen(port)

    })
    .catch(err => {

        console.log(err);

    })