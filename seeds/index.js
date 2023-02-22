const mongoose = require('mongoose');
const cities = require('./cities');
const { descriptors, places } = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.set("strictQuery", true);
mongoose.connect(
  "mongodb://localhost:27017/yelp-camp",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  },
  (err) => {
    if (!err) {
      console.log("MongoDB Connection Succeeded.");
    } else {
      console.log("Error in DB connection: " + err);
    }
  }
);

const sample = (array) => array[Math.floor(Math.random() * array.length)]

const seedDB = async() => {
  await Campground.deleteMany({});
  for(let i = 0; i < 50; i++) {
    const randomCityIndex = Math.floor(Math.random() * cities.length);
    const price = Math.floor(Math.random() * 2000) + 1000;
    const camp = new Campground({
      author: '63f4d187e6585e7148779039',
      location: `${cities[randomCityIndex].prefecture} ${cities[randomCityIndex].city}`,
      title: `${sample(descriptors)}・${sample(places)}`,
      description: '木曾路はすべて山の中である。あるところは岨づたいに行く崖の道であり、あるところは数十間の深さに臨む木曾川の岸であり、あるところは山の尾をめぐる谷の入り口である。一筋の街道はこの深い森林地帯を貫いていた。東ざかいの桜沢から、西の十曲峠まで、木曾十一宿はこの街道に添うて、二十二里余にわたる長い谿谷の間に散在していた。道路の位置も幾たびか改まったもので、古道はいつのまにか深い山間に埋もれた。',
      price,
      images: [
        {
          url: 'https://res.cloudinary.com/dn7pelph3/image/upload/v1677054023/YelpCamp/d9czm8pzeckblcx0hgwq.jpg',
          filename: 'YelpCamp/d9czm8pzeckblcx0hgwq'
        },
        {
          url: 'https://res.cloudinary.com/dn7pelph3/image/upload/v1677054023/YelpCamp/uzwkajrozpwslxikenfj.jpg',
          filename: 'YelpCamp/uzwkajrozpwslxikenfj'
        }
      ]
    });
    await camp.save();
  }
}

seedDB().then(()=> {
  mongoose.connection.close();
});