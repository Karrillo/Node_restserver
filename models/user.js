const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

//Roles
let rolesValidator = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUES} no es un rol valido'
};

let Schema = mongoose.Schema;

//Schema
let userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'The name is necessary']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'The email is necessary']
    },
    password: {
        type: String,
        required: [true, 'The password is necessary']
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidator,
        trim: true
    },
    state: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});

//Return without Password
userSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
};

//Unique email
userSchema.plugin(uniqueValidator, { message: '{PATH} must be unique' });

module.exports = mongoose.model('Users', userSchema);