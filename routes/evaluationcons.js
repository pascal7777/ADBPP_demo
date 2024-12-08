const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { consultantSchema } = require('../schemas.js');
const { evaluationconSchema } = require('../schemas.js');


const ExpressError = require('../utils/ExpressError');
const Product = require('../models/product');
const Consultant = require('../models/consultant');
const Evaluationcon = require('../models/evaluationcon');


const validateEvaluationcon = (req, res, next) => {
    const { error } = evaluationconSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

router.get('/', catchAsync(async (req, res) => {
    const evaluationcons = await Evaluationcon.find({}).populate('consultant').populate ('author');
    res.render('evaluationcons/index', { evaluationcons })
    console.log(evaluationcons);
}));


router.delete('/:evaluationconId', catchAsync(async (req, res) => {
    const { id, evaluationconId } = req.params;
    await Consultant.findByIdAndUpdate(id, { $pull: { evaluationcons: evaluationconId } });
    await Evaluationcon.findByIdAndDelete(evaluationconId);
    res.redirect(`/consultants/${id}`);
}))

module.exports = router;