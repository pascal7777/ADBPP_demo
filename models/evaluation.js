const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const evaluationSchema = new Schema({
        company: String,
        country: String,
        body: String,
        expression: 
        {
            type: Schema.Types.ObjectId,
            ref: 'Expression'
        },
        author: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Evaluation', evaluationSchema);