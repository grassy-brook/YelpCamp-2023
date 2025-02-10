import express from 'express';
import passport from 'passport';

import users from '../controllers/users.controller.js';

const router = express.Router();

router
    .route('/register')
    // Create Form
    .get(users.renderRegister)
    // Create
    .post(users.register);

router
    .route('/login')
    // Login Form
    .get(users.renderLogin)
    // Login
    .post(
        passport.authenticate('local', {
            failureFlash: true,
            failureRedirect: '/login',
            keepSessionInfo: true,
        }),
        users.login
    );

// Logout
router.get('/logout', users.logout);

module.exports = router;
