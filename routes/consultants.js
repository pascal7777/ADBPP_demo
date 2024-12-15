const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { checkSchema } = require('../schemas.js');
const { commentSchema } = require('../schemas.js');
const { consultantSchema } = require('../schemas.js');
const { evaluationconSchema } = require('../schemas.js');
const { isLoggedIn } = require('../middleware');
const ExpressError = require('../utils/ExpressError');
const Product = require('../models/product');
const { cloudinary } = require("../cloudinary");
const multer = require('multer');

const { storage } = require('../cloudinary');
const upload = multer({ storage});

const Consultant = require('../models/consultant');
const Check = require('../models/check');
const Comment = require('../models/comment');
const Evaluationcon = require('../models/evaluationcon');
const Assessment = require('../models/assessment');
const Reject = require('../models/reject');

const validateConsultant = (req, res, next) => {
    const { error } = consultantSchema.validate(req.body.consultant);
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

// const validateEvaluationcon = (req, res, next) => {
//     const { error } = evaluationconSchema.validate(req.body);
//     if (error) {
//         const msg = error.details.map(el => el.message).join(',')
//         throw new ExpressError(msg, 400)
//     } else {
//         next();
//     }
// }

router.get('/', catchAsync(async (req, res) => {
    const consultants = await Consultant.find({}).populate('product').populate('evaluationcons');
    res.render('consultants/index', { consultants })
}));

router.get('/:id', isLoggedIn, catchAsync(async (req, res,) => {
    const {id} =req.params;    
    const consultant = await Consultant.findById(id).populate('product').populate('evaluationcons').populate ({
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
        path: 'evaluationcons',
        populate: {
            path: 'author'
        }
    }).populate ('author').populate ('editor');
    if (!consultant) {
        req.flash('error', 'This Package was deleted');
        return res.redirect('/consultants');
    }
    res.render('consultants/show', { consultant });
}));

router.get('/:id/evaluationcons/new', isLoggedIn, catchAsync(async (req,res) => {
    const {id} = req.params;
    const consultant = await Consultant.findById(id);
    res.render('evaluationcons/new',{consultant})
}));

router.get('/:id/status', catchAsync(async (req, res) => {
    const consultant= await Consultant.findById(req.params.id).populate('product');
    if (!consultant) {
        req.flash('error', 'This Package was deleted');
        return res.redirect('/consultants');
    }
    res.render('consultants/status', { consultant});
}))

router.get('/:id/bidOpening', catchAsync(async (req, res) => {
    const consultant= await Consultant.findById(req.params.id).populate('product');
    if (!consultant) {
        req.flash('error', 'This Package was deleted');
        return res.redirect('/consultants');
    }
    res.render('consultants/bidOpening', { consultant});
}))


router.get('/:id/contractSum', catchAsync(async (req, res) => {
    const consultant= await Consultant.findById(req.params.id).populate('product');
    if (!consultant) {
        req.flash('error', 'This Package was deleted');
        return res.redirect('/consultants');
    }
    res.render('consultants/contractSum', { consultant});
}))

router.get('/:id/advertising', catchAsync(async (req, res) => {
    const consultant= await Consultant.findById(req.params.id).populate('product');
    if (!consultant) {
        req.flash('error', 'This Package was deleted');
        return res.redirect('/consultants');
    }
    res.render('consultants/advertising', { consultant});
}))

router.get('/:id/iso9001', catchAsync(async (req, res) => {
    const consultant= await Consultant.findById(req.params.id).populate('product');
    if (!consultant) {
        req.flash('error', 'This Package was deleted');
        return res.redirect('/consultants');
    }
    res.render('consultants/iso9001', { consultant});
}))

router.get('/:id/iso13485', catchAsync(async (req, res) => {
    const consultant= await Consultant.findById(req.params.id).populate('product');
    if (!consultant) {
        req.flash('error', 'This Package was deleted');
        return res.redirect('/consultants');
    }
    res.render('consultants/iso13485', { consultant});
}))

router.get('/:id/ce', catchAsync(async (req, res) => {
    const consultant= await Consultant.findById(req.params.id).populate('product');
    if (!consultant) {
        req.flash('error', 'This Package was deleted');
        return res.redirect('/consultants');
    }
    res.render('consultants/ce', { consultant});
}))

router.get('/:id/edit', catchAsync(async (req, res) => {
    const consultant = await Consultant.findById(req.params.id).populate('product');
    if (!consultant) {
        req.flash('error', 'This Package was deleted');
        return res.redirect('/consultants');
    }
    res.render('consultants/edit', { consultant});
}));

router.put('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const consultant = await Consultant.findByIdAndUpdate(id, { ...req.body.consultant});
    await consultant.save()
    req.flash('success', 'Successfully updated this Package');
    res.redirect(`/consultants/${consultant._id}`)
}));

router.delete('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Consultant.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted this Package');
    res.redirect('/consultants');
}));

router.post('/:id/checks', isLoggedIn, catchAsync(async (req, res) => {
    const consultant = await Consultant.findById(req.params.id);
    const check= new Check(req.body.check );
    consultant.checks.push(check );
    check.author = req.user._id;
    await check.save();
    await consultant.save();
    res.redirect(`/consultants/${consultant._id}`);
}))

router.delete('/:id/checks/:checkId', catchAsync(async (req, res) => {
    const { id, checkId } = req.params;
    await Consultant.findByIdAndUpdate(id, { $pull: { checks: checkId } });
    await Check.findByIdAndDelete(checkId);
    req.flash('success', 'Successfully deleted this check');
    res.redirect(`/consultants/${id}`);
}))

router.post('/:id/comments', isLoggedIn, validateComment, catchAsync(async (req, res) => {
    const consultant = await Consultant.findById(req.params.id);
    const comment = new Comment(req.body.comment );
    consultant.comments.push(comment );
    comment.author = req.user._id;
    await comment.save();
    await consultant.save();
    res.redirect(`/consultants/${consultant._id}`);
}))

router.delete('/:id/comments/:commentId', catchAsync(async (req, res) => {
    const { id, commentId } = req.params;
    await Consultant.findByIdAndUpdate(id, { $pull: { comments: commentId } });
    await Comment.findByIdAndDelete(commentId);
    req.flash('success', 'Successfully deleted this comment');
    res.redirect(`/consultants/${id}`);
}))

router.post('/:id/evaluationcons/', isLoggedIn, catchAsync(async(req,res) => {
    const { id } = req.params;
    const consultant = await Consultant.findById(id);
    const {company, country, body} = req.body;
    const evaluationcon = new Evaluationcon ({company, country, body});
    consultant.evaluationcons.push(evaluationcon);
    evaluationcon.consultant = consultant;
    evaluationcon.author = req.user._id;
    evaluationcon.editor = req.user._id;
    await consultant.save();
    await evaluationcon.save();
    console.log (evaluationcon)
    res.redirect(`/consultants/${id}`)
}))

router.delete('/:id/evaluationcons/:evaluationconId', catchAsync(async (req, res) => {
    const { id, evaluationconId } = req.params;
    await Consultant.findByIdAndUpdate(id, { $pull: { evaluationscon: evaluationconId } });
    await Evaluationcon.findByIdAndDelete(evaluationconId);
    req.flash('success', 'Successfully deleted this evaluationcon');
    res.redirect(`/consultants/${id}`);
}))


router.post('/:id/assessments',  isLoggedIn, catchAsync(async (req, res) => {
    const consultant = await Consultant.findById(req.params.id);
    const assessment = new Assessment(req.body.assessment );
    consultant.assessments.push(assessment );
    assessment.author = req.user._id;
    await assessment.save();
    await consultant.save();
    res.redirect(`/consultants/${consultant._id}`);
}))

router.delete('/:id/assessments/:assessmentId', catchAsync(async (req, res) => {
    const { id, assessmentId } = req.params;
    await Consultant.findByIdAndUpdate(id, { $pull: { assessments: assessmentId } });
    await Assessment.findByIdAndDelete(assessmentId);
    req.flash('success', 'Successfully deleted this assessment');
    res.redirect(`/consultants/${id}`);
}))


router.post('/:id/rejects',  isLoggedIn, catchAsync(async (req, res) => {
    const consultant = await Consultant.findById(req.params.id);
    const reject = new Reject(req.body.reject );
    consultant.rejects.push(reject );
    reject.author = req.user._id;
    await reject.save();
    await consultant.save();
    res.redirect(`/consultants/${consultant._id}`);
}))

router.delete('/:id/rejects/:rejectId', catchAsync(async (req, res) => {
    const { id, rejectId } = req.params;
    await Consultant.findByIdAndUpdate(id, { $pull: { rejects: rejectId } });
    await Reject.findByIdAndDelete(rejectId);
    req.flash('success', 'Successfully deleted this reject argument');
    res.redirect(`/consultants/${id}`);
}))

module.exports = router;