const express = require('express');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const path = require('path');
const methodOverride = require('method-override');
const ExpressError = require('./utils/expressError');

const campgroundRoute = require('./routes/campgrounds');
const reviewRoute = require('./routes/reviews');

// MongoDB接続
mongoose.set("strictQuery", true);
mongoose.connect(
  "mongodb://localhost:27017/yelp-camp",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: true
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


// エラーの場合、カスタムエラーハンドラーに飛ぶ

app.use('/campgrounds', campgroundRoute);
app.use('/campgrounds/:id/reviews', reviewRoute);

// ホーム
app.get('/', (req, res) => {
    res.render('home');
});

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