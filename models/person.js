const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let personSchema = new Schema({
    name: {
        type: String,
        required: [true, 'The name is necessary']
    },
    businessName: {
        type: String,
        required: [true, 'The business name is necessary'],
    },
    identification: {
        type: String,
        unique: true,
        required: true
    },
    typeIdentification: {
        type: String,
        required: true
    },
    province: {
        type: String,
        required: false
    },
    district: {
        type: String,
        required: false
    },
    neighborhood: {
        type: String,
        required: false
    },
    Address: {
        type: String,
        required: false
    },
    phone: {
        type: Number,
        required: false
    },
    credit: {
        type: Boolean,
        default: false
    },
    term: {
        type: Number,
        default: false
    },
    rode: {
        type: Number,
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
    }
});

personSchema.plugin(uniqueValidator, { message: '{PATH} must be unique' });

module.exports = mongoose.model('Clients', personSchema);