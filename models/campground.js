const mongoose = require('mongoose');
const review = require('./review');
const { Schema } = mongoose;

//https://res.cloudinary.com/dn7pelph3/image/upload/w_300/v1677060537/YelpCamp/lxi2g2s8qg7irdldih7l.jpg

const imageSchema = new Schema({
    url: String,
    filename: String
});
imageSchema.virtual('thumbnail').get(function() {
  return this.url.replace('/upload', '/upload/w_200')
});

// キャンプ場のスキーマ
const campgroundSchema = new Schema({
  title: String,
  images: [imageSchema],
  price: Number,
  description: String,
  location: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Review'
    }
  ]
});

// キャンプ場に関連するレビューを削除
campgroundSchema.post('findOneAndDelete', async function(doc){
  if(doc) {
    await review.deleteMany({
      _id: {
        $in: doc.reviews
      }
    })
  }
});

module.exports = mongoose.model('Campground', campgroundSchema);