const express = require('express');
const Constants = require('./constants');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const CampGround = require('./models/campground');
const morgan = require('morgan');
const methodOverride = require('method-override');
const catchAsync = require('./utils/catchAsync')
const ExpressError = require('./utils/ExpressErrors');

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

app.use(morgan('tiny'));

app.use((req,res,next)=>{
    req.requestTime = Date.now();
    return next();
});

app.engine('ejs',ejsMate);
app.use(methodOverride('_method'));
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

app.get('/',(req,res)=>{
    console.log("Hello")
    res.render('home')
});

app.get('/campgrounds',catchAsync(async (req,res) => {
    const campgrounds =  await CampGround.find({})
    res.render ('campgrounds/index',{
        campgrounds: campgrounds
    })
}));

app.get('/campgrounds/new',(req,res)=>{
    res.render('campgrounds/new');
});

app.get('/campgrounds/:id/edit', catchAsync(async (req,res) =>{
    const camp = await CampGround.findById(req.params.id);
    res.render('campgrounds/edit',{
        campground: camp
    });
}));

app.get('/campgrounds/:id',catchAsync(async (req,res) => {
    const camp_id = req.params.id;
    const campground = await CampGround.findById(camp_id);
    res.render('campgrounds/show',{
        campground: campground
    });
}));


app.put('/campgrounds/:id', catchAsync(async (req,res)=>{
    const {id} = req.params;
    const foundCamp = await CampGround.findByIdAndUpdate(id,{...req.body.campground},{new:true});
    console.log(foundCamp);
    res.redirect(`/campgrounds/${id}`)
}));

app.delete('/campgrounds/:id',catchAsync(async (req,res)=>{
    const {id} = req.params;
    console.log(`Finding Campground to Delete! ${id}`);
    await CampGround.findByIdAndDelete(id);
    res.redirect('/campgrounds')
}));

app.post('/campgrounds', catchAsync(async (req,res,next)=>{
        const newCamp = new CampGround(req.body.campground)
        await newCamp.save();
        res.redirect(`/campgrounds/${newCamp._id}`);
}));


app.use((err,req,res,next)=>{
    const { status = 500 , message = "Oops...Something went wrong"} = err;
    console.log(err);
    res.status(status).send(message);
})

app.listen(Constants.port,()=>{
    console.log(`Listening on port ${Constants.port}`)
});