const express = require("express");
const router = express.Router();
const passport = require("passport");
const users = require("../controllers/users");

// Create Form
router.get("/register", users.renderRegister);

// Create
router.post("/register", users.register);

// Login Form
router.get("/login", users.renderLogin);

// ログイン処理
router.post(
  '/login',
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
    keepSessionInfo: true,
  }),
  users.login
);

// ログアウト処理
router.get("/logout", users.logout);

module.exports = router;
