const express = require('express');
const app = express();
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
// load config
dotenv.config({
    path: './config/config.env'
})
// middleware
app.use(express.static('public'));
// json middleware
app.use(express.json())
// view engine
app.set('view engine', 'ejs');
// database connection
connectDB()

// listen
app.listen(3000, ()=> {
    console.log('server connect');
})


// routes
app.get('/', (req, res) => {
    res.render('home')
})
app.get('/smoothies', (req, res) => {
    res.render('smoothies')
})
app.use(authRoutes)



