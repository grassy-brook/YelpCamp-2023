const express = require('express');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const port = 3000;
const path = require('path');
const Campground = require('./models/campground');
const methoadOverride = require('method-override');

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

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//MidleWare
app.use(express.urlencoded({extended: true}));
app.use(methoadOverride('_method'));

// Home
app.get('/', (req, res) => {
    res.render('home');
});

// Index
app.get('/campgrounds', async(req, res) => {
  const campgrounds = await Campground.find({});
  res.render('campgrounds/index', { campgrounds });
});

// Create
app.get('/campgrounds/new', (req, res) => {
  res.render('campgrounds/new')
});

// Detail
app.get('/campgrounds/:id', async(req, res) => {
  const campground = await Campground.findById(req.params.id);
  res.render('campgrounds/show', { campground });
});

// POST
app.post('/campgrounds', async(req, res) => {
  const campground = await Campground(req.body.campground);
  await campground.save();
  res.redirect(`/campgrounds/${campground._id}`);
});

// Edit
app.get('/campgrounds/:id/edit', async(req, res) => {
  const campground = await Campground.findById(req.params.id);
  res.render('campgrounds/edit', { campground });
});

// PUT
app.put('/campgrounds/:id', async(req, res) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
  res.redirect(`/campgrounds/${campground._id}`)
});

// Delete
app.delete('/campgrounds/:id', async(req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  res.redirect('/campgrounds');
});


app.listen(port, (req, res) => {
  console.log(`Listen: ${port}`);
});