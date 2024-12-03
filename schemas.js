const Joi = require('joi');

module.exports.productSchema = Joi.object({
    product: Joi.object({
        name: Joi.string().allow('', null),
        number: Joi.string().allow('', null),
        approvalNumber: Joi.string().allow('', null),
        country: Joi.string().allow('', null),
        agency: Joi.string().allow('', null),
        risk: Joi.string().allow('', null),
        financing:  Joi.number().allow('', null),
        methods: Joi.string().allow('', null),
        methodsCS: Joi.string().allow('', null),
        closing: Joi.date().allow('', null),
        effective: Joi.date().allow('', null),
        planValue:Joi.number().allow('', null),
        status:Joi.string().allow('', null),
        comments:Joi.string().allow('', null),
    }).required()
});

module.exports.expressionSchema = Joi.object({
    expression: Joi.object({
        number: Joi.string().required(),
        description: Joi.string().required(),
        value: Joi.number().required(),
        method: Joi.string().required(),
        sbd: Joi.string().required(),
        review: Joi.string().required(),
        procedure: Joi.string().required(),
        advertisingQ: Joi.string().allow('', null),
        advertisingY: Joi.string().allow('', null),
        approach: Joi.string().allow('', null),
        domesticPreference: Joi.string().allow('', null),
        lots: Joi.number().allow('', null),
        contracts: Joi.number().allow('', null),
        contractValue: Joi.number().allow('', null),
        status: Joi.string().allow('', null),
    }).required(),
    deleteImages:Joi.array()
});

module.exports.consultantSchema = Joi.object({
    consultant: Joi.object({
        number: Joi.string().required(),
        description: Joi.string().required(),
        value: Joi.string().required(),
        method: Joi.string().required(),
        sbd: Joi.string().required(),
        review: Joi.string().required(),
        procedure: Joi.string().required(),
        advertising: Joi.string().allow('', null),
        approach: Joi.string().allow('', null),
        domesticPreference: Joi.string().allow('', null),
        contracts: Joi.number().allow('', null),
        contractValue: Joi.number().allow('', null),
        status: Joi.string().allow('', null),
    }).required(),
    deleteImages:Joi.array()
});

module.exports.checkSchema = Joi.object({
    check: Joi.object({
        rating: Joi.number().required().min(1).max(10),
        body: Joi.string().required()
    }).required()
});


module.exports.commentSchema = Joi.object({
    comment: Joi.object({
        body: Joi.string().required()
    }).required()
});

module.exports.evaluationSchema = Joi.object({
    evaluation: Joi.object({
        rating: Joi.number().required().min(1).max(10),
        body: Joi.string().required()
    }).required()
});

module.exports.assessmentSchema = Joi.object({
    assessment: Joi.object({
        rating: Joi.number().required().min(1).max(10),
        body: Joi.string().required()
    }).required()
});

module.exports.rejectSchema = Joi.object({
    reject: Joi.object({
        body: Joi.string().required()
    }).required()
});