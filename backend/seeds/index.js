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
      description: '木曾路はすべて山の中である。あるところは岨づたいに行く崖の道であり、あるところは数十間の深さに臨む木曾川の岸であり、あるところは山の尾をめぐる谷の入り口である。一筋の街道はこの深い森林地帯を貫いていた。',
      price,
      images: [
        {
          url: 'https://console.cloudinary.com/console/c-1e7b24110a258062989ddf6e0b4ee9/media_library/search/asset/6f2c34a0b87d9939bcdc497b7cf45bb9/manage?q=&context=manage',
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