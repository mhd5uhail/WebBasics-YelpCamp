const Constants = require('../constants');
const cities = require('./cities')
const {descriptors,places} = require('./seedHelpers');
const mongoose = require('mongoose');
const Campground = require('../models/campground');

mongoose.connect(Constants.dbUrl,{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error',console.error.bind(console,"connection error"));
db.once('open',()=>{
    console.log("Database connected")
});

const sample = array=> array[Math.floor(Math.random()*array.length)];

const seedDb = async () =>{
    await Campground.deleteMany({});
    for(let i =0;i<50;++i){
        const random1000 = Math.floor(Math.random()*1000);
        const priceRandom = Math.floor(Math.random()*20) + 50;
        const camp = new Campground(
            {
                title: `${sample(descriptors)} ${sample(places)}`,
                location: `${cities[random1000].city}, ${cities[random1000].state}`,
                image: 'https://picsum.photos/800/640',
                description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras ullamcorper sagittis ligula vitae congue. Donec viverra blandit turpis, et varius ante volutpat at. Curabitur tristique pretium dictum. Phasellus finibus malesuada purus. Vivamus ut tortor vel sem ullamcorper faucibus scelerisque id turpis. Aliquam at egestas dolor. Maecenas sit amet dui dapibus risus lacinia interdum. Fusce ac urna varius tellus iaculis dapibus a ac magna. Proin congue massa sed mattis lobortis. Nulla ornare id magna vel condimentum. Praesent ac quam imperdiet leo porttitor bibendum. Praesent est sapien, feugiat euismod augue ac, mattis pulvinar enim. Pellentesque ut tortor condimentum, tincidunt nulla non, pretium turpis.',
                price: priceRandom
            }
        );
        await camp.save();
    }
}

seedDb().then(()=>{
    mongoose.connection.close()
});