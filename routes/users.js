const express = require("express");
const router = express.Router();
const passport = require("passport");

const User = require("../models/user");
const { route } = require("./campgrounds");

//ユーザー登録画面
router.get("/register", (req, res) => {
  res.render("users/register");
});

// ユーザー登録処理
router.post("/register", async (req, res, next) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, err => {
        if(err) return next(err);
        req.flash("success", "Yelp Campへようこそ!");
        res.redirect("/campgrounds");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/register");
  }
});

// ログイン画面
router.get("/login", (req, res) => {
  res.render("users/login");
});

// ログイン処理
router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
    keepSessionInfo: true
  }),
  (req, res) => {
    req.flash("success", "おかえりなさい");
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
  }
);

// ログアウト処理
router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      req.flash("error", "ログアウトに失敗しました");
      return res.redirect("/campgrounds");
    }
    req.flash("success", "ログアウトしました");
    res.redirect("/campgrounds");
  });
});

module.exports = router;
