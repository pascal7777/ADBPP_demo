const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const evaluationworkSchema = new Schema({
        company: String,
        country: String,
        body: String,
        work: 
        {
            type: Schema.Types.ObjectId,
            ref: 'Work'
        },
        author: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Evaluationwork', evaluationworkSchema);