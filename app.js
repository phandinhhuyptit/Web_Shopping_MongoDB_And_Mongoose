const express = require('express');
const app = express();
const port = 3000;
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const User = require('./models/user');
app.set('view engine', 'ejs');
app.set('views', 'views');


const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorController = require('./controller/error404');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


app.use((req, res, next) => {

        next();
  
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(errorController.GetError404);

mongoose.connect('mongodb+srv://PhanDinhHuy_1996:professionalhuy331@severwebshop-xbrlk.mongodb.net/Shop?retryWrites=true',{useNewUrlParser: true})
.then( result =>{
    console.log( "Connect!")
    app.listen(port)

})
.catch ( err =>{

    console.log(err);
 n
})