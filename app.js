//3rd level encryption as when we push on git hub our secret key is public and even i can get to know password by get request
require('dotenv').config();
const express=require("express");
const bodyParser=require("body-parser");
const ejs=require("ejs");
const mongoose=require("mongoose");
const encrypt=require("mongoose-encryption");
//const md5=require("md5");
//becrrypt we are going to use as md5 due to poor encrypting its hased password can be cracked
const bcrypt=require('bcrypt');
const saltRounds=10;
//md5 uses hash function to convert password to hashed form 
//in case of comparing we compares hashed password only
const app=express();

app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({
    extended:true
}))
//connect mongo 3t and create a db
mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser:true})

//user schema
const userSchema=new mongoose.Schema({
    email: String,
    password: String
});
//second level of encryption of password
//const secret="Thisisourlittlesecret.";
//moved to .env so that it can't be public 
//console.log(process.env.API_KEY); it prints means we are included env

//as secret is no longer defined
// userSchema.plugin(encrypt,{secret:secret,encryptedField:["password"]});//encrypt field is for all the fields that we wants to encrypt 

// remove plugin for 3rd step of authentication 
// userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedField:["password"]});
// using it we encrypted our password in DB but at the time of decrypting password===password we are getting plane password 
// so this is bad so lets move to stage -2
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
    bcrypt.hash(req.body.password,saltRounds,function(err,hash){
        const newUser=new User({
            email:req.body.username,//usename is the name in input form
            password :hash
          })
          newUser.save((err)=>{
              if(err)
              console.log(err);
              else
              res.render("secrets");
          })
    })
    
 })

  app.post("/login",function(req,res){
      const username=req.body.username;
      //const password=md5(req.body.password);
        const password=req.body.password;
      User.findOne({email:username},function(err,foundUser){
          if(err)
          console.log(err);
          else{
              if(foundUser){
                //   if(foundUser.password===password)//both hashed version matches one another
                //   {
                //       res.render("secrets");
                //   }
                 bcrypt.compare(password,foundUser.password,function(err,result){
                    if(result==true)
                    {
                        res.render("secrets");
                    }
                 })
              }
          }
      })
  })
app.listen(3000,function(){
    console.log("Server started on port 3000.");
})