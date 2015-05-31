
// libraries and controllers  
var dmail   = require( __dirname+'/controllers/dmail/dmail.js');
var hql     = require( __dirname+'/controllers/hql/hql.js');
var _       = require('lodash');
var Promise = require('bluebird')
var fs      = Promise.promisifyAll(require("fs"));
var moment  = require('moment');
var heapdump = require('heapdump');
var dir = process.cwd()
var privateConfigPath =  __dirname+'/_config.js'

// settings
if (fs.existsSync(privateConfigPath)) {
  var config  = require(privateConfigPath);
}else{
  var config  = require( __dirname+'/config.js');
}

var PORT    = config.PORT

// express server 
var express = require('express');
var app     = express();
var api     = express();
var router  = express.Router(); 

var cookieParser = require('cookie-parser')
app.use(cookieParser( config.COOKIESECRET ))

app.use('/api', api);
app.use(express.static( __dirname+'/css/'));
app.use(express.static( __dirname+'/js/'));
app.use(express.static( __dirname+'/'));
app.use(express.static( __dirname+'/views/'));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  req.query.to = req.signedCookies["_account"]
  next();
});

api.use(function(req, res, next) {
  req.query.to = req.signedCookies["_account"]
  req.query.___id = "1234"
  next();
});

// sqllite 
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(dir+'/data/'+config.DATABASE);

// google oauth 
var google = require('googleapis');
var OAuth2 = google.auth.OAuth2;
var oauth2Client = new OAuth2(config.google.CLIENTID, config.google.CLIENTSECRET, config.google.REDIRECTURL);

var url = oauth2Client.generateAuthUrl({
  access_type: 'offline', // 'online' (default) or 'offline' (gets refresh_token)
  scope: config.google.SCOPES // If you only need one scope you can pass it as string
});

// utils


function addslashes(str) {
  return (str + '')
    .replace(/[\\"']/g, '\\$&')
    .replace(/\u0000/g, '\\0');
}

app.get("/",function(req,res){
  res.clearCookie("_account")
  res.sendFile(__dirname+'/views/login.html')
})  
app.get("/config",function(req,res){
  // hide client secret 
  var _config = JSON.parse( JSON.stringify(config) )
  _config.google.CLIENTSECRET = ''
  res.send("var config = "+JSON.stringify(_config) )
})  


// api endpoints 
api.get("/oauthLogin",function(req,res){
  oauth2Client.getToken(req.query.code, function(err, tokens) {
    if(!err) {
      oauth2Client.setCredentials(tokens);
      var gmail = google.gmail({ version: 'v1', auth: oauth2Client });
      gmail.users.getProfile({userId: 'me'},saveOauth);
      function saveOauth(err,data){
        res.cookie('_account',data.emailAddress, { maxAge: 900000, httpOnly: true,signed:true });
        var oauth = {}
        oauth.tokens = tokens 
        oauth.email = data.emailAddress
        createStatusSocket(oauth)
        res.send("oauth connected")
      }
    }
  })
})


api.get('/logout',function(req,res){
  res.clearCookie('_account');
  res.redirect("/")
})
api.get('/connected',function(req,res){
  hql({
    path:__dirname+'/modals/checkForAccount.sql',
    data:req.query
  })
  .then(function(data){
    if(Number(data[0].count) >=1){
      res.redirect("/app.html")
    }else{
      res.sendFile(__dirname+'/views/connected.html') 
    }
  })
  
})

api.get('/count',function(req,res){
  hql({
    path:__dirname+'/modals/count.sql',
    data:req.query
  })
  .then(function(query){
    db.all(query,function(err,rows){
      console.log("err",err)
      res.send(JSON.stringify(rows))
    })
  })
})

api.get('/top',function(req,res){
  hql({
    path:__dirname+'/modals/top.sql',
    data:req.query
  })
  .then(function(query){
    db.all(query,function(err,rows){
      
      res.send(JSON.stringify(rows))
    })
  })
})

api.get('/startAndEnd',function(req,res){
  hql({
    path:__dirname+'/modals/startAndEnd.sql',
    data:req.query
  })
  .then(function(query){
    db.all(query,function(err,rows){
      
      res.send(JSON.stringify(rows))
    })
  })
})


// start server 
var server = app.listen(PORT, function() {
  console.log('Express is listening to http://localhost:'+PORT);
});

// Start of socket.io connections 
var io = require('socket.io').listen(server);
function createStatusSocket(oauth){
io.on('connection', function(socket){
    console.log("websocket is ready for "+oauth.email)
    socket.on('disconnect', function(){
      console.log('user disconnected');
    });
   if(oauth.tokens != undefined){
      dmail({
         user:oauth.email,
         clientId: config.google.CLIENTID,
         clientSecret: config.google.CLIENTSECRET,
         refreshToken: oauth.tokens.refresh_token,
         accessToken: oauth.tokens.access_token,
         timeout:3600
       })
       .connect()
       .then(function(){
        io.to(socket.id).emit("status",{percentage:"10",message:"Please wait while we import all your emails"})
        console.log("connecting to inbox for "+this.account.username)
        return this.getInbox("INBOX")
       })
       .then(function(total){
        if(config.EMAIL_LIMIT < 0 || config.EMAIL_LIMIT > 0 ){
          var totalCount = Math.abs(config.EMAIL_LIMIT)
        }

        if(Number(this.total) <= Math.abs(config.EMAIL_LIMIT) ){
          var totalCount = total
        }

        io.to(socket.id).emit("status",{percentage:"30",message:"We are importing meta data for <strong>"+totalCount+"</strong> emails"})
        console.log("getting inbox data for "+this.account.username)
        return this.getMessages(total)
       })
       .then(function(data){
        io.to(socket.id).emit("status",{percentage:"50",message:"We are saving your email to disk"})
        console.log("writing full json to disk for  "+this.account.username)
        return this.writeToDisk(this.fileName,data)
       })
       .then(function(path){
         io.to(socket.id).emit("status",{percentage:"60",message:"Creating compact Dmail Meta Data Object"})
         console.log("creating json mail meta data for "+this.account.username)
         return this.createMailMetaData(this.fileName)
       })
       .then(function(data){
        io.to(socket.id).emit("status",{percentage:"80",message:"We are saving the data to DB"})
        console.log("saving to db "+this.account.username)
        return this.saveToDB(data)
       })
       .then(function(){
        
        io.to(socket.id).emit("status",{percentage:"100",message:"Done importing"})
        console.log("done importing")
       })
   }
 })
}