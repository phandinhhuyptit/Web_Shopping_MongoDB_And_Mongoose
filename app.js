
const express = require('express');
const app = express();
const port = 3000;
const mongoose = require('mongoose');
const multer = require('multer');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const bodyParser = require('body-parser');
const path = require('path');
const User = require('./models/user');
// csrf attack 
const csrf = require('csurf');
// error massage
const flash = require('connect-flash');

const filestorage = multer.diskStorage({

    destination : (res,file,cb) =>{


            cb(null , 'images');

    },
    filename : (req , file , cb ) =>{

        cb(null,file.fieldname+'_'+Date.now()+'_'+ file.originalname);
    }

})


const fileFilter = (req, file, cb) => {

    if (file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'

    ) {

        cb(null, true)

    }
    cb(null, false)
}


app.set('view engine', 'ejs');
app.set('views', 'views');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/Auth');
const errorController = require('./controller/error404');


//urlencoded  it just to get value input . urlencoded is basically text data  . if  you try type ="file" it not working 
//this format is called you are encoded 
app.use(bodyParser.urlencoded({ extended: false }));


// Upload File
app.use(    

    multer({storage : filestorage,fileFilter : fileFilter} ).single('image')

)


app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));

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
            if(!user){

                return next();

            }            
            req.user = user;
            return next();
        })
        .catch(err => {
            throw new Error(err);
        })
});
app.use((req, res, next) => {
    // Middleware global to any routes 
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.isPosition = req.session.user ? req.session.user.Position : null;
    // public csrfToken  
    res.locals.csrfToken = req.csrfToken();
    next();
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.get('/500',errorController.GetError500);
app.use(errorController.GetError404);



//middle will receive error from all file in project
app.use((error, req, res, next) => {
    // res.status(error.httpStatusCode).render(...);
    
    res.redirect('/500');
  });

mongoose.connect(MongoDB_URI,{ useNewUrlParser: true })
    .then(result => {
    

        app.listen(port)

    })
    .catch(err => {

        console.log(err);

    })