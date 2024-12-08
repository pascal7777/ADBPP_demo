const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { expressionSchema } = require('../schemas.js');
const { evaluationSchema } = require('../schemas.js');


const ExpressError = require('../utils/ExpressError');
const Product = require('../models/product');
const Expression = require('../models/expression');
const Evaluation = require('../models/evaluation');


const validateEvaluation = (req, res, next) => {
    const { error } = evaluationSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

router.get('/', catchAsync(async (req, res) => {
    const evaluations = await Evaluation.find({}).populate('expression').populate ('author');
    res.render('evaluations/index', { evaluations })
    console.log(evaluations);
}));






router.delete('/:evaluationId', catchAsync(async (req, res) => {
    const { id, evaluationId } = req.params;
    await Expression.findByIdAndUpdate(id, { $pull: { evaluations: evaluationId } });
    await Evaluation.findByIdAndDelete(evaluationId);
    res.redirect(`/expressions/${id}`);
}))

module.exports = router;