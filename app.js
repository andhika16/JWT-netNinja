const express = require('express');
const app = express();
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');
const {requireAuth,checkUser } = require('./middleware/authMiddleware');

// load config
dotenv.config({
    path: './config/config.env'
})
// middleware
app.use(express.static('public'));
app.use(express.json())
app.use(cookieParser())
// view engine
app.set('view engine', 'ejs');
// database connection
connectDB()

// listen
app.listen(3000, ()=> {
    console.log('server connect');
})


// check current user routes all
app.get('*', checkUser)
// routes
app.get('/',(req, res) => {
    res.render('home')
})
app.get('/smoothies',requireAuth , (req, res) => {
    res.render('smoothies')
})
app.use(authRoutes)



