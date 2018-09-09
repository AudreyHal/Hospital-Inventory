const express= require('express');
const bodyParser= require('body-parser');
//const MongoClient= require('mongodb').MongoClient;
const passport =require('passport');
const LocalStrategy = require('passport-local').Strategy;
const app= express();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static('public'))

app.use(passport.initialize());
app.use(passport.session());

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
      quote: String
    });
const Patients = mongoose.model('patient', Patient, 'patient');


//db.close();
//var db= client.db('hospital');

passport.use(new LocalStrategy(
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

 
  
  //Passport Sessions
  passport.serializeUser(function(user, done) {
      done(null, user.id);
    });
     
    passport.deserializeUser(function(id, done) {
        UserDetails.findById(id, function (err, user) {
        done(err, user);
      });
    }); 

    app.get('/success', (req, res) => res.send("Welcome "+req.query.username+"!!"));
    app.get('/error', (req, res) => res.send("error logging in")); 
 

app.get('/', function(req,res){
    res.sendFile(__dirname +'/views/index.html');
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
 



  app.get('/login', function(req, res) {
    res.sendFile(__dirname +'/views/login.html');
  });

  app.post('/login',
  passport.authenticate('local', { failureRedirect: '/error' }),
  function(req, res) {
    res.redirect('/success?username='+req.user.username);
  });

app.post('/add', function(req,res){
    //console.log(req.body);


//var collection=db.collection('patient');
/*collection.save(req.body),(err, result)=>{
    if (err) return console.log(err);
   
   
}
console.log('Saved to database');
res.redirect('/');
*/});
/*

app.post('/addsupplies', function(req,res){
    //console.log(req.body);


var collection=db.collection('supplies');
collection.save(req.body),(err, result)=>{
    if (err) return console.log(err);
   
   
}
console.log('Saved to database');
res.redirect('/');
});


app.put('/quotes',(req,res)=>{
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
})


app.delete('/quotes', (req,res)=>{
    db.collection('patient').findOneAndDelete({name: req.body.name},
        (err, result)=>{
        if (err) return res.send(err)
        res.send({message: 'A darth vadar quote got deleted'})
    })   
})  */
app.listen(3000, ()=>{
 console.log('Listening on port 3000');
   
    
});

