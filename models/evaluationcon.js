const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const evaluationconSchema = new Schema({
        company: String,
        country: String,
        body: String,
       consultant: 
        {
            type: Schema.Types.ObjectId,
            ref: 'Consultant'
        },
        author: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Evaluationcon', evaluationconSchema);