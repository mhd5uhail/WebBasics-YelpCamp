const express = require('express');
const Constants = require('./constants');
const path = require('path');
const mongoose = require('mongoose');
const CampGround = require('./models/campground');
const methodOverride = require('method-override');

mongoose.connect(Constants.dbUrl,{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error',console.error.bind(console,"connection error"));
db.once('open',()=>{
    console.log("Database connected")
});

const app = express();
app.use(express.urlencoded({
    extended:true
}));
app.use(methodOverride('_method'));
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

app.get('/',(req,res)=>{
    console.log("Hello")
    res.render('home')
});

app.get('/campgrounds',async (req,res) => {
    const campgrounds =  await CampGround.find({})
    res.render ('campgrounds/index',{
        campgrounds: campgrounds
    })
})

app.get('/campgrounds/new',(req,res)=>{
    res.render('campgrounds/new');
});

app.get('/campgrounds/:id/edit',async (req,res) =>{
    const camp = await CampGround.findById(req.params.id);
    res.render('campgrounds/edit',{
        campground: camp
    });
})

app.get('/campgrounds/:id',async (req,res) => {
    const camp_id = req.params.id;
    const campground = await CampGround.findById(camp_id);
    res.render('campgrounds/show',{
        campground: campground
    });
});


app.put('/campgrounds/:id', async (req,res)=>{
    const {id} = req.params;
    const foundCamp = await CampGround.findByIdAndUpdate(id,{...req.body.campground},{new:true});
    console.log(foundCamp);
    res.redirect(`/campgrounds/${id}`)
});

app.delete('/campgrounds/:id',async (req,res)=>{
    const {id} = req.params;
    console.log(`Finding Campground to Delete! ${id}`);
    await CampGround.findByIdAndDelete(id);
    res.redirect('/campgrounds')
})

app.post('/campgrounds', async (req,res)=>{
    const newCamp = new CampGround(req.body.campground)
    await newCamp.save();
    res.redirect(`/campgrounds/${newCamp._id}`);
});

app.listen(Constants.port,()=>{
    console.log(`Listening on port ${Constants.port}`)
});