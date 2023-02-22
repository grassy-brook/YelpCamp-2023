const User = require("../models/user");

// register form
module.exports.renderRegister = (req, res) => {
  res.render("users/register");
};

// register
module.exports.register = async (req, res, next) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Yelp Campへようこそ!");
      res.redirect("/campgrounds");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/register");
  }
};

// login form
module.exports.renderLogin = (req, res) => {
  res.render("users/login");
};

// login
module.exports.login = (req, res) => {
  req.flash("success", "おかえりなさい");
  const redirectUrl = req.session.returnTo || "/campgrounds";
  delete req.session.returnTo;
  res.redirect(redirectUrl);
};

// logout
module.exports.logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      req.flash("error", "ログアウトに失敗しました");
      return res.redirect("/campgrounds");
    }
    req.flash("success", "ログアウトしました");
    res.redirect("/campgrounds");
  });
};
