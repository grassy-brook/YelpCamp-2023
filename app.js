if(process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const path = require('path');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');

const ExpressError = require('./utils/expressError');

const campgroundRoute = require('./routes/campgrounds');
const reviewRoute = require('./routes/reviews');
const userRoute = require('./routes/users');

const User = require('./models/user');

// MongoDB接続
mongoose.set("strictQuery", true);
mongoose.connect(
  "mongodb://localhost:27017/yelp-camp",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  },
  (err) => {
    if (!err) {
      console.log("MongoDB Connection Succeeded.");
    } else {
      console.log("Error in DB connection: " + err);
    }
  }
);

const app = express();

// ミドルウェア
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

const sessionConfig = {
  secret: 'mysecret',
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
};
app.use(session(sessionConfig));

//認証認可
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(flash());

app.use((req, res, next) => {
  // console.log(req.session);
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

app.use('/', userRoute);
app.use('/campgrounds', campgroundRoute);
app.use('/campgrounds/:id/reviews', reviewRoute);

// ホーム
app.get('/', (req, res) => {
    res.render('home');
});

// app.get('/fakeUser', async (req, res) => {
//   const user = new User({email: 'hogehoge@www.com', username: 'hogehoge'});
//   const newUser = await User.register(user, 'mogemoge');
//   res.send(newUser);
// })
// カスタムエラーハンドラー
app.all('*', (req, res, next) => {
  next(new ExpressError('ページが見つかりませんでした', 404));
})

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if(!err.message){
    err.message = '問題が起きました'
  }
  res.status(statusCode).render('error', { err });
});

app.listen(3000, (req, res) => {
  console.log('Connecting...');
});