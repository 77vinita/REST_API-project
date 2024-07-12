const express = require("express");
const app = express();
const  port = 8080;
const path = require("path");
const {v4:uuidv4} = require("uuid");

//install package method-override
const methodOverride = require ("method-override");
app.use(methodOverride("_method"));

//Middleware Setup
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}));
app.use(express.json());


let pages = [
    {
        id : uuidv4(),
        username : "nancy",
        bio : "I find solace in dedicating my leisure hours to comforting and caring for stray cats and dogs.",
        post : "/cats.jpg"
    },{ 
            id : uuidv4(),
            username : "david",
            bio : "Exploring new places is my way of finding peace and expanding my horizons.",
            post : "/travel.jpg"
    }
];

//index route - list all posts
app.get("/instagram",(req,res)=> {
    res.render("index.ejs", {pages});
});

//create route
app.get("/instagram/new",(req,res) => {
    res.render("new.ejs");
});

//view route- view individual post
app.get("/instagram/:id",(req,res) => {
    let {id} =req.params;
    let page = pages.find((p) => id === p.id);
    // if (!page) {
    //     return res.status(404).send("Page not found"); // Handle case where page with given id is not found
    // }
    res.render("show.ejs",{page});
});

//Post route - to create new post
app.post("/instagram", (req,res) => {
    let {username, bio, post} = req.body;
    let id = uuidv4();
    pages.push ({id, username, bio, post});
    res.redirect("/instagram");
});

//PATCH request
app.patch("/instagram/:id", (req,res) => {
    let {id}= req.params;
    let newBio= req.body.bio;
    let newPost= req.body.post;
    let page= pages.find((p) => id === p.id);
    page.bio= newBio;
    page.post= newPost;
    res.redirect("/instagram");
});

//Edit route
app.get("/instagram/:id/edit",(req,res) => {
    let {id}= req.params;
    let page= pages.find((p)=> id === p.id);
    res.render("edit.ejs",{page});
});

//Delete route
app.delete("/instagram/:id", (req,res) => {
    let {id} =req.params;
    pages= pages.filter((p) => id != p.id);
    res.redirect("/instagram");
})

//Start server
app.listen(port,() => {
    console.log(`listening to port ${port}`);
});