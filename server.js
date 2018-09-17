const express= require('express');
const bodyParser= require('body-parser');
//const cookieParser= require('cookie-parser');
const session = require('express-session')
//const MongoClient= require('mongodb').MongoClient;
//const passport =require('passport');
//const LocalStrategy = require('passport-local').Strategy;
const app= express();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static('public'))
//app.use(cookieParser())
app.set('view engine', 'ejs');

app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false }
  }))

//app.use(passport.initialize());
//app.use(passport.session());

/*MongoClient.connect("mongodb://localhost:27017", (err,client)=>{
    if (err) return console.log(err);
*/

/* MONGOOSE SETUP */

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/hospital');

const Schema = mongoose.Schema;
const UserDetail = new Schema({
      username: String,
      password: String
    });
const UserDetails = mongoose.model('UserInfo', UserDetail, 'UserInfo');


const Patient = new Schema({
      name: String,
      date:String,
      quote: String

    });
const Patients = mongoose.model('patient', Patient, 'patient');


//db.close();
//var db= client.db('hospital');

/*passport.use(new LocalStrategy(
    function(username, password, done) {
        UserDetails.findOne({
          username: username
        }, function(err, user) {
          if (err) {
            return done(err);
          }
  
          if (!user) {
            return done(null, false);
          }
  
          if (user.password != password){
            return done(null, false);
          }
          return done(null, user);
        });
    }
  ));
*/
 
  
  //Passport Sessions
  /*passport.serializeUser(function(user, done) {
      done(null, user.id);
    });
     
    passport.deserializeUser(function(id, done) {
        UserDetails.findById(id, function (err, user) {
        done(err, user);
      });
    }); 

    app.get('/success', (req, res) => res.sendFile(__dirname +'/views/main.html'));
    app.get('/error', (req, res) => res.send("error logging in")); 
 
*/

 



  app.get('/login', function(req, res) {
    res.sendFile(__dirname +'/views/login.html');
  });

  app.post('/login', 
 /* passport.authenticate('local', { failureRedirect: '/error' }),
  function(req, res) {

    res.redirect('/success?username='+req.user.username);
  });*/
  
  function(req, res) {
    var username= req.body.username
    var password= req.body.password
    UserDetails.findOne({
      username: username
    }, function(err, user) {
      if (err) {
        console.log(err);
      } 

      if (!user) {
        res.send('User not found');
      }

      if(user){

       if (user.password != password){
        res.send('wrong');
      } 
     /// return done(null, user);
        req.session.user = user;
        req.session.user.expires = new Date(
            Date.now() + 3 * 24 * 3600 * 1000); // session expires in 3 days
            //console.log(req.session.user)
          res.redirect('/');}
    });});

    /*UserDetails.findOne({
    username: username 
  }, function(err, user) {
    if (err) {
      return done(err);
    }

    if (!user) {
      return done(null, false);
    }

    if (user.password == password){
        req.session.user = {
            username: req.user.username,
            id: req.user.id
          }; // saving some user's data into user's session
          req.session.user.expires = new Date(
            Date.now() + 3 * 24 * 3600 * 1000); // session expires in 3 days
          
          res.status(200).send('You are logged in, Welcome!');
  }else {
    res.send('incorrect password');
}
});});*/

app.use((req, res, next) => {
    console.log(req.session.user)
    if (req.session.user) {
      next();
    } else {
      res.status(401).send('Authrization failed! Please login');
    }
  });

  app.get('/',function(req,res){
    res.send(`You are seeing this because you have a valid session.
    Your username is ${req.session.user.username} 
    and email is ${req.session.user.email}.
`)
  //  res.sendFile(__dirname +'/views/index.html');
  /* var cursor=db.collection('patient').find().toArray(function(err,results){
           console.log(results)
   console.log(cursor);
});*/

        Patients.find({})
        .then((data)=>{
           console.log(data);
         })
        .catch((err)=>{
          console.log(err);
        })
    });

  app.get('/find', function(req,res){
    res.sendFile(__dirname +'/views/find.html');});

    app.get('/details', function(req,res){
        res.render('details');});
    

  app.post('/search', function(req,res){
    
  /* var cursor=db.collection('patient').find().toArray(function(err,results){
           console.log(results)
   console.log(cursor);
});*/ 
        Patients.find({name:req.body.name})
        .then((data)=>{
            var photos=[];  
          // console.log(data);
          data.forEach(function(item){
            photos= photos.concat(item.quote)});
            var dates=[];  
            // console.log(data);
            data.forEach(function(item){
              dates= dates.concat(item.date)});
            //  res.render('collection', {pics: photos})});
           res.render('details',{pics: photos,name:data[0].name, data:data, date:dates});
          console.log(photos);
         })
        .catch((err)=>{
          console.log(err);
        })
    });
 

app.post('/add', function(req,res){
    //console.log(req.body);


//var collection=db.collection('patient');
/*collection.save(req.body),(err, result)=>{
    if (err) return console.log(err);
   
   
}
console.log('Saved to database');
res.redirect('/');
*/
const patient = new Patients({
    name: req.body.name ,
    date:req.body.date,
    quote: req.body.quote});


patient.save()
.then((data)=> {
  console.log(data);
  res.send('Saved to database');
 })
.catch((err)=> {
  console.log(err);
})});
/*

app.post('/addsupplies', function(req,res){
    //console.log(req.body);


var collection=db.collection('supplies');
collection.save(req.body),(err, result)=>{
    if (err) return console.log(err);
   
   
}
console.log('Saved to database');
res.redirect('/');
}); */


app.put('/details',(req,res)=>{/*
    db.collection('patient').findOneAndUpdate({name: 'ray'},{
        $set:{
        name:req.body.name,
        quote:req.body.quote}
        },
        {sort:{id:-1},
        upsert:true
    },(err, result)=>{
        if (err) return res.send(err)
        res.send(result)
    })
})*/
console.log(req.body.name);
/*Patients.findOneAndUpdate({name:req.body.name}, {$set: req.body}, function (err, patient) {
    if (err) return res.send(err);
    res.send('Patient Data udpated.');
});*/
});


app.delete('/quotes', (req,res)=>{
   /* db.collection('patient').findOneAndDelete({name: req.body.name},
        (err, result)=>{
        if (err) return res.send(err)
        res.send({message: 'A darth vadar quote got deleted'})
    })*/  
})  

/*function checkAuthentication(req,res,next){
    if(req.isAuthenticated()){
        //req.isAuthenticated() will return true if user is logged in
       
        return next();
    } else{
        res.redirect("/login");
    }
}*/

app.listen(3000, ()=>{
 console.log('Listening on port 3000');
   
    
});

