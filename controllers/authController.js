const User = require('../models/User');
const jwt = require('jsonwebtoken');
// handle the errors
const handleErrors = err => {
    console.log(err.message, err.code);
    let errors = {email:'' , password:''}
    // if email incorrect
    if(err.message === 'incorrect email') {
        errors.email = 'email not registered'
    }

    
    if(err.message === 'incorrect password') {
        errors.password = 'password incorrect'
    }

    // validation err code
    if(err.code === 11000) {
        errors.email = 'Email is already registered'
    }

    // validation error
    if(err.message.includes('jwt-auth validation failed')) {
         Object.values(err.errors).forEach( ({properties}) =>  {
           errors[properties.path] = properties.message
         })
    }
    return errors

}
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) =>  {
    return jwt.sign({id}, 'net ninja secret', {
        expiresIn:maxAge
    })
}


module.exports.signup_get =  (req, res) => {
    res.render('signup')
}
module.exports.login_get =  (req, res) => {
    res.render('login')
}
module.exports.signup_post =  async (req, res) => {
    const {email, password} = req.body
    
    try {
        const user  = await User.create({email, password});
        const token = createToken(user._id)
        res.cookie('jwt', token, {httpOnly:true, maxAge:maxAge * 1000})
        res.status(201).json({user:user._id});

    } catch (err) {
        const error = handleErrors(err)
        res.status(400).json({error})
    }

}
module.exports.login_post =  async (req, res) => {

    const {email, password} = req.body

    try {
        const user  = await User.login(email, password)
        const token = createToken(user._id)
        res.cookie('jwt', token, {httpOnly:true, maxAge:maxAge * 1000})
        res.status(200).json({user: user._id})
    } catch (err) {
        const error = handleErrors(err)
        res.status(400).json({ error })
    }



}

module.exports.logout_get = (req, res) => {
    res.cookie('jwt', '', {maxAge:1});
    res.redirect('/')
}