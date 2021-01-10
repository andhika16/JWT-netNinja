const mongoose =  require('mongoose');
const {isEmail} = require('validator')
const bcrpyt =  require('bcrypt');

const UserSchema = new mongoose.Schema({
    email : {
        type:String,
        required:[true, 'Please entered an email'], 
        unique:true,
        lowercase:true,
        validate: [isEmail , 'please entered an valid email']
    }, 
    password: {
        type:String,
        required:[true, 'please entered an password'],
        minlength:[6, 'password minimum length must 6 characters']
    }
})

UserSchema.pre('save', async function(next) {
    const salt = await bcrpyt.genSalt();
    this.password = await bcrpyt.hash(this.password, salt);
    next()
})


UserSchema.statics.login = async function(email, password) {
    const user = await this.findOne({email})
    if(user){
        const auth = await bcrpyt.compare(password, user.password);
        if(auth){
            return user;
        } throw Error('incorrect password')
    } throw Error('incorrect email')
}


const User = mongoose.model('jwt-auth', UserSchema);
module.exports = User