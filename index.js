const express = require("express")
const mongoose = require("mongoose")
const Listing = require("./models/listing")
const ejsMate = require("ejs-mate")
const wrapAsync = require("./errors/wrapAsync.js")
const extendError = require("./errors/extendError")
const app = express();
const path = require('path')
const methodOverride = require('method-override');
const {listingSchema} = require('./models/listingSchema')


app.set('view engine','ejs')
app.set('views', path.join(__dirname,'views/listings'))
app.use(express.static(path.join(__dirname,'static')));
app.use(express.urlencoded({extended:true}))
app.use(methodOverride("_method"))
port = 8000;
app.engine('ejs',ejsMate)
url = "mongodb://127.0.0.1:27017/project_1"


main().then(()=>{
    console.log("connection successful")
}).catch((err)=>{
    console.log(err)
});

async function main() {
    await mongoose.connect(url)
};


let undoObj = null;

app.get('/listings', wrapAsync( async (req,res,next)=>{
    
         let listings = await Listing.find({});
        res.render('allListings', {listings})
}))

app.get('/listings/createNew', wrapAsync((req,res)=>{
    res.render('new.ejs')
}))

app.get('/listings/:id', wrapAsync( async (req,res)=>{

    let {id} = req.params;
    let listing = await Listing.findById(id)
    if(!listing){
        throw new extendError(400,"Invalid Listing Id")
    }
    res.render('show.ejs',{listing})
}))

app.post('/listing/createNew', wrapAsync(async (req,res)=>{
    const {error, value} = listingSchema.validate(req.body)
    if(error){
        console.log(error)
        throw new extendError(400,error.message)
    }
    console.log(value)
    const list = new Listing(value.listing);
    await list.save()
    res.redirect('/listings')

}))
//edit listing
app.post("/edit", wrapAsync(async (req,res)=>{
    let {id} = req.body;
    let listing = await Listing.findById(id)
    console.log(listing.title)
    res.render("edit.ejs",{listing})
}))

app.put("/listing/edit/:id", wrapAsync(async(req,res)=>{
        const {error, value} = listingSchema.validate(req.body)
    if(error){
        console.log(error)
        throw new extendError(400,error)
    }
    let{id} = req.params;
    await Listing.findByIdAndUpdate(id,value.listing)
    res.redirect("/listings")
}))


//delete listing
app.delete('/listing/:id', wrapAsync(async (req,res)=>{
    let {id} = req.params;
    undoObj= await Listing.findByIdAndDelete(id)
    res.redirect('/listings')
}))

app.post('/listings/undo', wrapAsync(async (req,res)=>{
    if(undoObj){
        const {_id, ...rest} = undoObj.toObject();
        await Listing.create(rest);
        undoObj = null
    }
    res.redirect('/listings')
}))

app.all("/{*splat}", (req, res, next) => {
  next(new extendError(404, "page not found"));
});
app.use((err,req,res,next)=>{
    let {statuscode = 500, message = "Something went wrong" } = err;
    res.status(statuscode).send(message);
})
app.listen(port,"0.0.0.0",()=>{
    console.log(`Post is listning to ${port}`)
}) 