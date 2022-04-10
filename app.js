const express=require("express");
const bodyParser=require("body-parser");
const ejs=require("ejs");
const mongoose=require("mongoose");
const app=express();

app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({
    extended:true
}))
//connect mongo 3t and create a db
mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser:true})

//user schema
const userSchema={
    email: String,
    password: String
};

//models
const User=new mongoose.model("User",userSchema);
app.get("/",(req,res)=>{
   res.render("home"); 
})
app.get("/login",(req,res)=>{
    res.render("login"); 
 })
 app.get("/register",(req,res)=>{
    res.render("register"); 
 })

 app.post("/register",(req,res)=>{
    //using the name of input from form let ceate a new user
    const newUser=new User({
      email:req.body.username,//usename is the name in input form
      password : req.body.password 
    })
    newUser.save((err)=>{
        if(err)
        console.log(err);
        else
        res.render("secrets");
    })
 })

  app.post("/login",function(req,res){
      const username=req.body.username;
      const password=req.body.password;

      User.findOne({email:username},function(err,foundUser){
          if(err)
          console.log(err);
          else{
              if(foundUser){
                  if(foundUser.password===password)
                  {
                      res.render("secrets");
                  }
                 
              }
          }
      })
  })
app.listen(3000,function(){
    console.log("Server started on port 3000.");
})