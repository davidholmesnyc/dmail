var dmail = function(object){
  var dir = process.cwd()
  var inbox      = require("inbox");
  var Promise    = require("bluebird");
  var Handlebars = require("handlebars");
  var fs         = Promise.promisifyAll(require("fs"));
  var moment     = require('moment');
  var db     = require('moment');
  var hql     = require(dir+'/controllers/hql/hql.js');
  var privateConfigPath =  dir+'/_config.js'
  // settings

  if (fs.existsSync(privateConfigPath)) {
    var config  = require(privateConfigPath);
  }else{
    var config  = require( __dirname+'/config.js');
  }

  // sqllite 
  var sqlite3 = require('sqlite3').verbose();
  var db = new sqlite3.Database(dir+'/data/'+config.DATABASE);

  this.account = this.account || {}
  this.account.username = object.username || object.user
  this.account.password = object.password || false
  this.oauth = object
  this.url = "imap.gmail.com"
  this.fileName = dir+"/data/"+this.account.username+".json"
  this.createTableSQL = dir+'/modals/createEmailTable.sql'
  this.insertSqlFile =dir+'/modals/insertIntoEmailTable.sql'
  
  this.connect = function(){
    return new Promise(function(resolve, reject){ 
      var self = this 
      if(self.account.password){
        var auth = {
              user: self.account.username,
              pass: self.account.password
          }
      }else{
        var auth = {
        XOAuth2:{
            user: self.oauth.user,
            clientId: self.oauth.clientId,
            clientSecret: self.oauth.clientSecret,
            refreshToken: self.oauth.refreshToken,
            accessToken: self.oauth.clientId,
            timeout:self.oauth.timeout
        }
        }
        
      }
      self.client = inbox.createConnection(false, self.url, {
          secureConnection: true,
          auth:auth
      });
      self.client.connect();
      self.client.on("connect", function(){
          console.log("Successfully connected to email server");
          this.connected = true;
          return resolve(self)
           
      });
    })
  }

  this.getMessages = function(total){
    var self = this
    
    if(Number(self.total) <= Math.abs(config.EMAIL_LIMIT) ){
      var from  = 0
      var limit = 0
      
    }else{
      var from = self.total
      var limit = config.EMAIL_LIMIT
    }

    return new Promise(function(resolve, reject){ 
      self.client.listMessages(from,limit, function(err, messages){
        if(err) throw err;
      if(messages)
        resolve(messages)
      if(err)
       reject(err)
      });
    })
  }

  this.getInbox =  function(inbox){
    return new Promise(function(resolve, reject){ 
     var self = this 
     self.client.openMailbox(inbox, function(error, info){
      if(error) throw error;
      self.total = info.count
      console.log("Message count in INBOX: " + info.count);
      resolve(info.count)
     });
    })
  }

  this.writeToDisk = function(filename,data){
    var fs = require('fs');
    var stream = fs.createWriteStream(filename);
    stream.once('open', function(fd) {
      stream.write(JSON.stringify(data));
      stream.end();
    });
  }

  this.saveToDB = function(data){
    var self = this
    return new Promise(function(resolve, reject){ 
      console.log("saving to DB")
      //console.log("db",data)
      // create table 
     hql({
      path:self.createTableSQL,
      data:null
     })
     .then(function(query){
        db.run(query,function(){
          hql({
           path:self.insertSqlFile,
           data:data
          })
          .then(function(query){
            console.log(query)
            db.run(query)
            resolve("created")
          })
        })
     })
  })
  }

  this.createMailMetaData = function(fileName){
    return new Promise(function(resolve, reject){
      fs.readFileAsync(fileName)
      .then(function(data){
        var all = []
        
        
          var data = JSON.parse(data)
          for (var i = data.length - 1; i >= 0; i--) {
            var doc =  data[i]
            if(doc.flags[0] === 'Seen'){
              var seen = 1 
            }else{
              var seen = 0
            }
            all.push({
              to: this.account.username,
              from:doc.from.address,
              subject:doc.title,
              uid:doc.UID,
              date:moment(doc.date).format("YYYY-MM-DD HH:mm:ss"),
              seen:seen,
              mailbox:doc.path,
            })
            
          };
          resolve(all)
       
        console.log("saved to "+this.fileName)
      })
    })
  }
  function isJson(str) {
      try {
          JSON.parse(str);
      } catch (e) {
          return false;
      }
      return true;
  }

  return this
}

module.exports = dmail

