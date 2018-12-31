const express= require('express');
const bodyParser= require('body-parser');
const session = require('express-session')
const app= express();
const port=process.env.PORT || 3000
const dotenv=require('dotenv').config({silent:true});


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static('public'))
app.set('view engine', 'ejs');

app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false }
  }))
 

/* MONGOOSE SETUP */

const mongoose = require('mongoose');
var url1='mongodb://localhost/hospital';
var url2='mongodb://admin1:admin1@ds145584.mlab.com:45584/escor-hospital';
var url=process.env.MONGO_URI;
mongoose.connect(url);

const Schema = mongoose.Schema;
const UserDetail = new Schema({
      username: String,
      password: String
    });
const UserDetails = mongoose.model('UserInfo', UserDetail, 'UserInfo');


const Patient = new Schema({
      name: String,
      date:String,
      details: String

    });
const Patients = mongoose.model('patient', Patient, 'patient');


  app.get('/', function(req, res) {
    res.render('login',{ alert:"none", msg:"0"})
  });
 
  app.post('/', 
   function(req, res) {
    var username= req.body.username 
    var password= req.body.password


    if (!req.body.username ||!req.body.password) {
      res.render('login',{ alert:"block", msg:"Please fill all required fields"})}

      else{
    UserDetails.findOne({
      username: username
    }, function(err, user) {
      if (err) 
      { res.render('login',{ alert:"block", msg:"An error occured. Please try again"});

            } 

      if (!user) {
        res.render('login',{ alert:"block", msg:"User not found"})
        
      }

      if(user){

       if (user.password != password){
        res.render('login',{ alert:"block", msg:"Incorrect Password"})
      } else{
    
        req.session.user = user;
        req.session.user.expires = new Date(
            Date.now() + 3 * 24 * 3600 * 1000); // session expires in 3 days
           
          res.redirect('/main');}}
    });}});

 
app.use((req, res, next) => {
      if (req.session.user) {
      next();
    } else {
     res.redirect("/")
    }
  });

  app.get('/main',function(req,res){
 var name=[];
name.push(req.session.user.username);
    
    res.render('index', {names:name[0]} );
 
    });

  app.get('/find', function(req,res){ 
    res.render('find',{ alert:"none", msg:""});});

    app.get('/add', function(req,res){
      res.render('add',{ alert:"none", msg:"",status:"success"});});
  

    app.get('/details', function(req,res){
        res.render('details');});

     
          
            app.get('/delete', function(req,res){
              res.render('delete',{ alert:"none", msg:"",status:"success"});});

            

              app.post('/delete', function(req,res){
                if (req.body.firstname =="" || req.body.lastname =="" ){ res.render('delete',{msg:"Please fill in empty fields", alert:"block",status:"danger"})}
               else{
                 var name=req.body.firstname +" " + req.body.lastname ;
               var fullname = name.toUpperCase();
                       Patients.find({name:fullname},function(err,data) {
                         if(err){res.send('try again later')}
                          if (!data.length){res.render('delete',{msg:'No account with that name exists.', alert:"block", status:"danger"});}
                       if(data){
                         res.render('confirmation',{data:data});
                       }
                        
                 })
               }
               });
               
               app.post('/confirmation', function(req,res){
                var name=req.body.name;
                
                  Patients.deleteMany({name:name},function(err,data) {
                         if(err){res.send('try again later')}
                        if(data)  {
                         res.render('delete',{msg:'One record deleted.', alert:"block", status:"success"});
                       }
                        
                 })
               
               });
    

  app.post('/search', function(req,res){
 if (req.body.firstname =="" || req.body.lastname =="" ){ res.render('find',{msg:"Please fill in empty fields", alert:"block"})}
else{
  var name=req.body.firstname +" " + req.body.lastname ;
var fullname = name.toUpperCase();
        Patients.find({name:fullname},function(err,data) {
          if(err){res.send('try again later')}
        if (!data.length) {res.render('find',{msg:'No account with that name exists.', alert:"block"});}
        else {
          console.log(data); 
          res.render('details',{data:data});
        }
         
  })
}
});
 

app.post('/add', function(req,res){
  if (req.body.firstname =="" || req.body.lastname =="" || req.body.date =="" || req.body.details =="" ){ 
    res.render('add',{msg:"Please fill in empty fields", alert:"block",status:"danger"})} 
    else{
var name=req.body.firstname +" " + req.body.lastname ;
var fullname = name.toUpperCase();

const patient = new Patients({
    name: fullname ,
    date:req.body.date,
    details: req.body.details});


patient.save()
.then((data)=> {
    res.render('add',{msg:"Saved to database", alert:"block", status:"success"})
 })
.catch((err)=> {
 res.send('add',{msg:"An error Occured", alert:"block", status:"danger"});
})}});

app.get('/logout',function(req,res){
  if(req.session){
      //delete session object
      req.session.destroy(function(err){
          if(err){res.send("An error occured");}
          else{
              return res.redirect('/')
          }
      })
  }
});
app.listen(port, ()=>{
// console.log('Listening on port 3000');
   
    
});

                  