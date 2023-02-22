const express = require("express");
const router = express.Router();
const passport = require("passport");
const users = require("../controllers/users");

router.route('/register')
  // Create Form
  .get(users.renderRegister)
  // Create
  .post(users.register)

router.route('/login')
  // Login Form
  .get(users.renderLogin)
  // Login
  .post(
    passport.authenticate('local', { failureFlash: true, failureRedirect: '/login', keepSessionInfo: true}), users.login
  );

// Logout
router.get("/logout", users.logout);

module.exports = router;
