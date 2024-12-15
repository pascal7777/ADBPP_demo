const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { checkSchema } = require('../schemas.js');
const { commentSchema } = require('../schemas.js');
const { expressionSchema } = require('../schemas.js');
const { evaluationSchema } = require('../schemas.js');
const { isLoggedIn } = require('../middleware');
const ExpressError = require('../utils/ExpressError');
const Product = require('../models/product');
const { cloudinary } = require("../cloudinary");
const multer = require('multer');

const { storage } = require('../cloudinary');
const upload = multer({ storage});

const Expression = require('../models/expression');
const Check = require('../models/check');
const Comment = require('../models/comment');
const Evaluation = require('../models/evaluation');
const Assessment = require('../models/assessment');
const Reject = require('../models/reject');


const validateExpression = (req, res, next) => {
    const { error } = expressionSchema.validate(req.body.expression);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

const validateComment = (req, res, next) => {
    const { error } = commentSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

// const validateEvaluation = (req, res, next) => {
//     const { error } = evaluationSchema.validate(req.body);
//     if (error) {
//         const msg = error.details.map(el => el.message).join(',')
//         throw new ExpressError(msg, 400)
//     } else {
//         next();
//     }
// }

router.get('/', catchAsync(async (req, res) => {
    const expressions = await Expression.find({}).populate('product').populate('evaluations');
    res.render('expressions/index', { expressions })
}));

router.get('/:id', isLoggedIn, catchAsync(async (req, res,) => {
    const {id} =req.params;    
    const expression = await Expression.findById(id).populate('product').populate('evaluations').populate({
        path: 'checks',
        populate: {
            path: 'author'
        }
    }).populate ({
        path: 'comments',
        populate: {
            path: 'author'
        }
    }).populate ({
        path: 'assessments',
        populate: {
            path: 'author'
        }
    }).populate ({
        path: 'rejects',
        populate: {
            path: 'author'
        }
    }).populate ({
        path: 'evaluations',
        populate: {
            path: 'author'
        }
    }).populate ('author').populate ('editor');
    if (!expression) {
        req.flash('error', 'This Package was deleted');
        return res.redirect('/expressions');
    }
    res.render('expressions/show', { expression });
}));

router.get('/:id/evaluations/new', isLoggedIn, catchAsync(async (req,res) => {
    const {id} = req.params;
    const expression = await Expression.findById(id);
    res.render('evaluations/new',{expression})
}));


router.get('/:id/status', catchAsync(async (req, res) => {
    const expression= await Expression.findById(req.params.id).populate('product');
    if (!expression) {
        req.flash('error', 'This Package was deleted');
        return res.redirect('/expressions');
    }
    res.render('expressions/status', { expression});
}))

router.get('/:id/subLots', catchAsync(async (req, res) => {
    const expression= await Expression.findById(req.params.id).populate('product');
    if (!expression) {
        req.flash('error', 'This Package was deleted');
        return res.redirect('/expressions');
    }
    res.render('expressions/subLots', { expression});
}))

router.get('/:id/bidOpening', catchAsync(async (req, res) => {
    const expression= await Expression.findById(req.params.id).populate('product');
    if (!expression) {
        req.flash('error', 'This Package was deleted');
        return res.redirect('/expressions');
    }
    res.render('expressions/bidOpening', { expression});
}))

router.get('/:id/contractSum', catchAsync(async (req, res) => {
    const expression= await Expression.findById(req.params.id).populate('product');
    if (!expression) {
        req.flash('error', 'This Package was deleted');
        return res.redirect('/expressions');
    }
    res.render('expressions/contractSum', { expression});
}))

router.get('/:id/advertising', catchAsync(async (req, res) => {
    const expression= await Expression.findById(req.params.id).populate('product');
    if (!expression) {
        req.flash('error', 'This Package was deleted');
        return res.redirect('/expressions');
    }
    res.render('expressions/advertising', { expression});
}))

router.get('/:id/ce', catchAsync(async (req, res) => {
    const expression= await Expression.findById(req.params.id).populate('product');
    if (!expression) {
        req.flash('error', 'This Package was deleted');
        return res.redirect('/expressions');
    }
    res.render('expressions/ce', { expression});
}))


router.get('/:id/edit', catchAsync(async (req, res) => {
    const expression = await Expression.findById(req.params.id).populate('product');
    if (!expression) {
        req.flash('error', 'This Package was deleted');
        return res.redirect('/expressions');
    }
    res.render('expressions/edit', { expression});
}));

router.put('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const expression = await Expression.findByIdAndUpdate(id, { ...req.body.expression});
    await expression.save()
    req.flash('success', 'Successfully updated this Package');
    res.redirect(`/expressions/${expression._id}`)
}));

router.delete('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Expression.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted this Package');
    res.redirect('/expressions');
}));



router.post('/:id/checks', isLoggedIn, catchAsync(async (req, res) => {
    const expression = await Expression.findById(req.params.id);
    const check= new Check(req.body.check );
    expression.checks.push(check );
    check.author = req.user._id;
    await check.save();
    await expression.save();
    res.redirect(`/expressions/${expression._id}`);
}))

router.delete('/:id/checks/:checkId', catchAsync(async (req, res) => {
    const { id, checkId } = req.params;
    await Expression.findByIdAndUpdate(id, { $pull: { checks: checkId } });
    await Check.findByIdAndDelete(checkId);
    req.flash('success', 'Successfully deleted this check');
    res.redirect(`/expressions/${id}`);
}))

router.post('/:id/comments', isLoggedIn, validateComment, catchAsync(async (req, res) => {
    const expression = await Expression.findById(req.params.id);
    const comment = new Comment(req.body.comment );
    expression.comments.push(comment );
    comment.author = req.user._id;
    await comment.save();
    await expression.save();
    res.redirect(`/expressions/${expression._id}`);
}))

router.delete('/:id/comments/:commentId', catchAsync(async (req, res) => {
    const { id, commentId } = req.params;
    await Expression.findByIdAndUpdate(id, { $pull: { comments: commentId } });
    await Comment.findByIdAndDelete(commentId);
    req.flash('success', 'Successfully deleted this comment');
    res.redirect(`/expressions/${id}`);
}))


// router.post('/:id/evaluations', isLoggedIn, catchAsync(async (req, res) => {
//     const expression = await Expression.findById(req.params.id);
//     const evaluation = new Evaluation(req.body.evaluation );
//     expression.evaluations.push(evaluation );
//     evaluation.author = req.user._id;
//     await evaluation.save();
//     await expression.save();
//     console.log (evaluation)
//     res.redirect(`/expressions/${expression._id}`);
// }))


router.post('/:id/evaluations/', isLoggedIn, catchAsync(async(req,res) => {
    const { id } = req.params;
    const expression = await Expression.findById(id);
    const {company, country, body} = req.body;
    const evaluation = new Evaluation ({company, country, body});
    expression.evaluations.push(evaluation);
    evaluation.expression = expression;
    evaluation.author = req.user._id;
    evaluation.editor = req.user._id;
    await expression.save();
    await evaluation.save();
    console.log (evaluation)
    res.redirect(`/expressions/${id}`)
}))

router.delete('/:id/evaluations/:evaluationId', catchAsync(async (req, res) => {
    const { id, evaluationId } = req.params;
    await Expression.findByIdAndUpdate(id, { $pull: { evaluations: evaluationId } });
    await Evaluation.findByIdAndDelete(evaluationId);
    req.flash('success', 'Successfully deleted this evaluation');
    res.redirect(`/expressions/${id}`);
}))


router.post('/:id/assessments',  isLoggedIn, catchAsync(async (req, res) => {
    const expression = await Expression.findById(req.params.id);
    const assessment = new Assessment(req.body.assessment );
    expression.assessments.push(assessment );
    assessment.author = req.user._id;
    await assessment.save();
    await expression.save();
    res.redirect(`/expressions/${expression._id}`);
}))

router.delete('/:id/assessments/:assessmentId', catchAsync(async (req, res) => {
    const { id, assessmentId } = req.params;
    await Expression.findByIdAndUpdate(id, { $pull: { assessments: assessmentId } });
    await Assessment.findByIdAndDelete(assessmentId);
    req.flash('success', 'Successfully deleted this assessment');
    res.redirect(`/expressions/${id}`);
}))


router.post('/:id/rejects',  isLoggedIn, catchAsync(async (req, res) => {
    const expression = await Expression.findById(req.params.id);
    const reject = new Reject(req.body.reject );
    expression.rejects.push(reject );
    reject.author = req.user._id;
    await reject.save();
    await expression.save();
    res.redirect(`/expressions/${expression._id}`);
}))

router.delete('/:id/rejects/:rejectId', catchAsync(async (req, res) => {
    const { id, rejectId } = req.params;
    await Expression.findByIdAndUpdate(id, { $pull: { rejects: rejectId } });
    await Reject.findByIdAndDelete(rejectId);
    req.flash('success', 'Successfully deleted this reject argument');
    res.redirect(`/expressions/${id}`);
}))

module.exports = router;