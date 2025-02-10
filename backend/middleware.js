import { ExpressError } from './utils/expressError.js';
import { campgroundSchema, reviewSchema } from './schemas.js';
import Campground from './models/campground.model.js';
import Review from './models/review.model.js';

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'ログインしてください');
        return res.redirect('/login');
    }
    next();
};
module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map((detail) => detail.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};
module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', 'アクションの権限がありません');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'アクションの権限がありません');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
};
module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map((detail) => detail.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};
