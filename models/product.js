const mongoose = require('mongoose');
const Expression = require('./expression');
const { Schema } = mongoose;

const productSchema = new Schema({
    name: {
        type: String,
        uppercase: true
    },
    number: {
        type: String
    },
    approvalNumber: {
        type: String
    },
    country: {
        type: String
    },
    agency: {
        type: String
    },
    risk: {
        type: String
    },
    financing: {
        type: Number
    },
    planValue: {
        type: Number
    },
    effective: {
        type: Date
    }, 
    closing: {
        type: Date
    }, 
    methods: {
        type: [String]
    },
    methodsCS: {
        type: [String]
    },
    comments: {
        type: String
    },
    status: {
        type: String, default: 'DRAFT',
        enum: ['DRAFT', 'SUBMITTED','RETURNED','APPROVED','REVISION']
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    editor: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    expressions: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Expression'
        }
    ],
    works: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Work'
        }
    ],
    consultants: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Consultant'
        }
    ],
},
    { timestamps: true }
);

productSchema.post('findOneAndDelete', async function (product) {
    if (product.expressions.length) {
        await Expression.deleteMany({ _id: { $in: product.expressions } })
    }
})

const Product = mongoose.model('Product', productSchema);



module.exports = Product; 