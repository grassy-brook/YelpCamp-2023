const express = require('express');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const { campgroundSchema } = require('./schemas');
const port = 3000;
const path = require('path');
const Campground = require('./models/campground');
const methoadOverride = require('method-override');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/expressError');

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
app.use(methoadOverride('_method'));

// エラーの場合、カスタムエラーハンドラーに飛ぶ
const validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if(error) {
    const msg = error.details.map(detail => detail.message).join(',');
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
}

// ホーム
app.get('/', (req, res) => {
    res.render('home');
});

// 一覧表示
app.get('/campgrounds', async(req, res) => {
  const campgrounds = await Campground.find({});
  res.render('campgrounds/index', { campgrounds });
});

// 新規作成画面
app.get('/campgrounds/new', (req, res) => {
  res.render('campgrounds/new')
});

// 詳細画面表示
app.get('/campgrounds/:id', catchAsync(async(req, res) => {
  const campground = await Campground.findById(req.params.id);
  res.render('campgrounds/show', { campground });
}));

// 新規登録
app.post('/campgrounds', validateCampground, catchAsync(async(req, res) => {
  // if(!req.body.campground) throw new ExpressError('不正なキャンプ場のデータです', 400);
    const campground = await Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}));

// 編集画面表示
app.get('/campgrounds/:id/edit', catchAsync(async(req, res) => {
  const campground = await Campground.findById(req.params.id);
  res.render('campgrounds/edit', { campground });
}));

// 更新
app.put('/campgrounds/:id', validateCampground, catchAsync(async(req, res) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
  res.redirect(`/campgrounds/${campground._id}`);
}));

// 削除
app.delete('/campgrounds/:id',  catchAsync(async(req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  res.redirect('/campgrounds');
}));

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

app.listen(port, (req, res) => {
  console.log(`Listen: ${port}`);
});