const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { workSchema } = require('../schemas.js');
const { evaluationworkSchema } = require('../schemas.js');


const ExpressError = require('../utils/ExpressError');
const Product = require('../models/product');
const Work = require('../models/work');
const Evaluationwork = require('../models/evaluationwork');


const validateEvaluationwork = (req, res, next) => {
    const { error } = evaluationworkSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

router.get('/', catchAsync(async (req, res) => {
    const evaluationworks = await Evaluationwork.find({}).populate('work').populate ('author');
    res.render('evaluationworks/index', { evaluationworks })
    console.log(evaluationworks);
}));






router.delete('/:evaluationworkId', catchAsync(async (req, res) => {
    const { id, evaluationworkId } = req.params;
    await Work.findByIdAndUpdate(id, { $pull: { evaluationworks: evaluationworkId } });
    await Evaluationwork.findByIdAndDelete(evaluationworkId);
    res.redirect(`/works/${id}`);
}))

module.exports = router;