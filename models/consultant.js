const mongoose = require('mongoose');

const Product = require('./product');
const Comment = require('./comment');
const Evaluationcon= require('./evaluationcon');
const { Schema } = mongoose;


const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});

const consultantSchema = new Schema({
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
    sbd: {
        type: String
    },
    prequal: {
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
        type: Number
    },
    bidders:{
        type: Number,
    },
    subLots:{
        type: String
    },
    advertised:{
        type: Date
    },
    bidOpeningN1:{
        type: String
    },
    bidOpeningV1:{
        type: Number
    },
    bidOpeningN2:{
        type: String
    },
    bidOpeningV2:{
        type: Number
    },
    bidOpeningN3:{
        type: String
    },
    bidOpeningV3:{
        type: Number
    },
    bidOpeningN4:{
        type: String
    },
    bidOpeningV4:{
        type: Number
    },
    bidOpeningL4:{
        type: Number
    },
    bidOpeningN5:{
        type: String
    },
    bidOpeningV5:{
        type: Number
    },
    bidOpeningL5:{
        type: Number
    },
    bidOpeningN6:{
        type: String
    },
    bidOpeningV6:{
        type: Number
    },
    bidOpeningL6:{
        type: Number
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
    evaluationcons: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Evaluationcon'
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


consultantSchema.post('findOneAndDelete', async function (consultant) {
    if (consultant.comments.length) {
        await Comment.deleteMany({ _id: { $in: consultant.comments } })
    }
})

consultantSchema.post('findOneAndDelete', async function (consultant) {
    if (consultant.evaluationcons.length) {
        await Evaluationcon.deleteMany({ _id: { $in: consultant.evaluationcons} })
    }
})




const Consultant = mongoose.model('Consultant', consultantSchema);



module.exports = Consultant; 



