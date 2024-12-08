const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { checkSchema } = require('../schemas.js');
const { commentSchema } = require('../schemas.js');
const { workSchema } = require('../schemas.js');
const { evaluationworkSchema } = require('../schemas.js');
const { isLoggedIn } = require('../middleware');
const ExpressError = require('../utils/ExpressError');
const Product = require('../models/product');
const { cloudinary } = require("../cloudinary");
const multer = require('multer');

const { storage } = require('../cloudinary');
const upload = multer({ storage});

const Work = require('../models/work');
const Check = require('../models/check');
const Comment = require('../models/comment');
const Evaluationwork = require('../models/evaluationwork');
const Assessment = require('../models/assessment');
const Reject = require('../models/reject');

const validateWork = (req, res, next) => {
    const { error } = workSchema.validate(req.body.work);
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
    const works = await Work.find({}).populate('product').populate('evaluationworks');
    res.render('works/index', { works })
}));

router.get('/:id', isLoggedIn, catchAsync(async (req, res,) => {
    const {id} =req.params;    
    const work = await Work.findById(id).populate('product').populate('evaluationworks').populate({
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
        path: 'evaluationworks',
        populate: {
            path: 'author'
        }
    }).populate ('author').populate ('editor');
    if (!work) {
        req.flash('error', 'This Package was deleted');
        return res.redirect('/works');
    }
    res.render('works/show', { work });
}));

router.get('/:id/evaluationworks/new', isLoggedIn, catchAsync(async (req,res) => {
    const {id} = req.params;
    const work = await Work.findById(id);
    res.render('evaluationworks/new',{work})
}));

router.get('/:id/status', catchAsync(async (req, res) => {
    const work= await Work.findById(req.params.id).populate('product');
    if (!work) {
        req.flash('error', 'This Package was deleted');
        return res.redirect('/works');
    }
    res.render('works/status', { work});
}))

router.get('/:id/subLots', catchAsync(async (req, res) => {
    const work= await Work.findById(req.params.id).populate('product');
    if (!work) {
        req.flash('error', 'This Package was deleted');
        return res.redirect('/works');
    }
    res.render('works/subLots', { work});
}))

router.get('/:id/contractSum', catchAsync(async (req, res) => {
    const work= await Work.findById(req.params.id).populate('product');
    if (!work) {
        req.flash('error', 'This Package was deleted');
        return res.redirect('/works');
    }
    res.render('works/contractSum', { work});
}))

router.get('/:id/advertising', catchAsync(async (req, res) => {
    const work= await Work.findById(req.params.id).populate('product');
    if (!work) {
        req.flash('error', 'This Package was deleted');
        return res.redirect('/works');
    }
    res.render('works/advertising', { work});
}))

router.get('/:id/ce', catchAsync(async (req, res) => {
    const work= await Work.findById(req.params.id).populate('product');
    if (!work) {
        req.flash('error', 'This Package was deleted');
        return res.redirect('/works');
    }
    res.render('works/ce', { work});
}))

router.get('/:id/edit', catchAsync(async (req, res) => {
    const work = await Work.findById(req.params.id).populate('product');
    if (!work) {
        req.flash('error', 'This Package was deleted');
        return res.redirect('/works');
    }
    res.render('works/edit', { work});
}));

router.put('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const work = await Work.findByIdAndUpdate(id, { ...req.body.work});
    await work.save()
    req.flash('success', 'Successfully updated this Package');
    res.redirect(`/works/${work._id}`)
}));

router.delete('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Work.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted this Package');
    res.redirect('/works');
}));

router.post('/:id/checks', isLoggedIn, catchAsync(async (req, res) => {
    const work = await Work.findById(req.params.id);
    const check= new Check(req.body.check );
    work.checks.push(check );
    check.author = req.user._id;
    await check.save();
    await work.save();
    res.redirect(`/works/${work._id}`);
}))

router.delete('/:id/checks/:checkId', catchAsync(async (req, res) => {
    const { id, checkId } = req.params;
    await Work.findByIdAndUpdate(id, { $pull: { checks: checkId } });
    await Check.findByIdAndDelete(checkId);
    req.flash('success', 'Successfully deleted this check');
    res.redirect(`/works/${id}`);
}))

router.post('/:id/comments', isLoggedIn, validateComment, catchAsync(async (req, res) => {
    const work = await Work.findById(req.params.id);
    const comment = new Comment(req.body.comment );
    work.comments.push(comment );
    comment.author = req.user._id;
    await comment.save();
    await ework.save();
    res.redirect(`/works/${work._id}`);
}))

router.delete('/:id/comments/:commentId', catchAsync(async (req, res) => {
    const { id, commentId } = req.params;
    await Work.findByIdAndUpdate(id, { $pull: { comments: commentId } });
    await Comment.findByIdAndDelete(commentId);
    req.flash('success', 'Successfully deleted this comment');
    res.redirect(`/works/${id}`);
}))

router.post('/:id/evaluationworks/', isLoggedIn, catchAsync(async(req,res) => {
    const { id } = req.params;
    const work = await Work.findById(id);
    const {company, country, body} = req.body;
    const evaluationwork = new Evaluationwork ({company, country, body});
    work.evaluationworks.push(evaluationwork);
    evaluationwork.work = work;
    evaluationwork.author = req.user._id;
    evaluationwork.editor = req.user._id;
    await work.save();
    await evaluationwork.save();
    console.log (evaluationwork)
    res.redirect(`/works/${id}`)
}))

router.delete('/:id/evaluationworks/:evaluationworkId', catchAsync(async (req, res) => {
    const { id, evaluationworkId } = req.params;
    await Work.findByIdAndUpdate(id, { $pull: { evaluationworks: evaluationworkId } });
    await Evaluationwork.findByIdAndDelete(evaluationworkId);
    req.flash('success', 'Successfully deleted this evaluationwork');
    res.redirect(`/works/${id}`);
}))

router.post('/:id/assessments',  isLoggedIn, catchAsync(async (req, res) => {
    const work = await Work.findById(req.params.id);
    const assessment = new Assessment(req.body.assessment );
    work.assessments.push(assessment );
    assessment.author = req.user._id;
    await assessment.save();
    await work.save();
    res.redirect(`/works/${work._id}`);
}))

router.delete('/:id/assessments/:assessmentId', catchAsync(async (req, res) => {
    const { id, assessmentId } = req.params;
    await Work.findByIdAndUpdate(id, { $pull: { assessments: assessmentId } });
    await Assessment.findByIdAndDelete(assessmentId);
    req.flash('success', 'Successfully deleted this assessment');
    res.redirect(`/works/${id}`);
}))

router.post('/:id/rejects',  isLoggedIn, catchAsync(async (req, res) => {
    const work = await Work.findById(req.params.id);
    const reject = new Reject(req.body.reject );
    work.rejects.push(reject );
    reject.author = req.user._id;
    await reject.save();
    await work.save();
    res.redirect(`/works/${work._id}`);
}))

router.delete('/:id/rejects/:rejectId', catchAsync(async (req, res) => {
    const { id, rejectId } = req.params;
    await Work.findByIdAndUpdate(id, { $pull: { rejects: rejectId } });
    await Reject.findByIdAndDelete(rejectId);
    req.flash('success', 'Successfully deleted this reject argument');
    res.redirect(`/works/${id}`);
}))

module.exports = router;