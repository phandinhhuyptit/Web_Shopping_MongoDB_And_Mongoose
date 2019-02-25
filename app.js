const express = require('express');
const app = express();
const port = 3000;
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const bodyParser = require('body-parser');
const path = require('path');
const User = require('./models/user');
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

app.use( 
    session(
        {
            secret: ' my secret',
            resave: false,
            saveUninitialized: false,
            store : store
        }));

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