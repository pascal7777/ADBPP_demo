const mongoose = require('mongoose');

const Product = require('./product');
const Comment = require('./comment');
const Evaluationwork= require('./evaluationwork');
const { Schema } = mongoose;


const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});

const workSchema = new Schema({
    number:{
        type: String
    },
    description:{
        type: String
    },
    value:{
        type: Number
    },
    method: {
        type: String
    },
    prequal: {
        type: String
    },
    sbd:{
        type: String
    },
    review:{
        type: String
    },
    procedure:{
        type: String
    },
    advertisingQ:{
        type: String
    },
    advertisingY:{
        type: String
    },
    approach:{
        type: String, default: 'National',
        enum: ['National','International']
    },
    domesticPreference:{
        type: String
    },
    lots:{
        type: Number, default: 0,
    },
    subLots:{
        type: String
    },
    advertised:{
        type: Date
    },
    deadline:{
        type: Date
    },
    lot1q:{
        type: String
    },
    lot1v:{
        type: Number
    },
    lot2q:{
        type: String
    },
    lot2v:{
        type: Number
    },
    lot3q:{
        type: String
    },
    lot3v:{
        type: Number
    },
    contracts:{
        type: Number
    },
    contractName:{
        type: String
    },
    contractSum:{
        type: Number
    },
    contractType:{
        type: String
    },
    contractDate:{
        type: Date
    },
    contractName2:{
        type: String
    },
    contractSum2:{
        type: Number
    },
    contractType2:{
        type: String
    },
    contractDate2:{
        type: Date
    },
    contractName3:{
        type: String
    },
    contractSum3:{
        type: Number
    },
    contractType3:{
        type: String
    },
    contractDate3:{
        type: Date
    },
    status:{
        type: String, default: 'Scheduled',
        enum: ['Scheduled','Advertised', 'Evaluation', 'Awarded','Cancelled']
    },
    author:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    editor:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    product: 
        {
            type: Schema.Types.ObjectId,
            ref: 'Product'
        },
    checks: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Check'
            }
        ],
    comments: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Comment'
            }
        ],
    evaluationworks: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Evaluationwork'
            }
        ],
    assessments: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Assessment'
            }
        ],
    rejects: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Reject'
            }
        ],
},
    { timestamps: true }
);


workSchema.post('findOneAndDelete', async function (worj) {
    if (work.comments.length) {
        await Comment.deleteMany({ _id: { $in: work.comments } })
    }
})

workSchema.post('findOneAndDelete', async function (work) {
    if (work.evaluationworks.length) {
        await Evaluationwork.deleteMany({ _id: { $in: work.evaluationworks} })
    }
})




const Work = mongoose.model('Work', workSchema);



module.exports = Work; 