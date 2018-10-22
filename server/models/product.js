const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let productSchema = new Schema({
    name: {
        type: String,
        required: [true, 'The name is necessary']
    },
    code: {
        type: String,
        unique: true,
        required: [true, 'The code is necessary'],
    },
    description: {
        type: String,
        required: false
    },
    img: {
        type: String,
        required: false
    },
    price: {
        type: Number,
        required: [true, 'The price is necessary'],
    },
    cost: {
        type: Number,
        required: [true, 'The cost price is necessary'],
    },
    tax: {
        type: Boolean,
        default: false
    },
    state: {
        type: Boolean,
        default: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    client: {
        type: Schema.Types.ObjectId,
        ref: 'client',
        required: true
    }
});

productSchema.plugin(uniqueValidator, { message: '{PATH} must be unique' });

module.exports = mongoose.model('Products', productSchema);