var dmail = function(object){
  var inbox      = require("inbox");
  var Promise    = require("bluebird");
  var Handlebars = require("handlebars");
  var fs         = Promise.promisifyAll(require("fs"));
  var moment     = require('moment');
  var mysql      = require('mysql');
  var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'mysql',
    database : 'dmail'
  });

  function hql(object){
    return new Promise(function(resolve, reject){ 
      fs.readFileAsync(object.path)
      .then(function(data){
        var template = Handlebars.compile(data.toString())(object.data);
        return template
      })
      .then(function(query){
        console.log(query)
        connection.query(query, function(err, result) {
          if(err) reject(err);
          resolve(result)
          
        });
      })
    })
  }

  function hqlite(object){
    return new Promise(function(resolve, reject){ 
      fs.readFileAsync(object.path)
      .then(function(data){
        var template = Handlebars.compile(data.toString())(object.data);
        return template
      })
      .then(function(query){
        console.log(query)
        db.run(query, function(err, result) {
          if(err) reject(err);
          resolve(result)
          
        });
      })
    })
  }
  var sqlite3 = require('sqlite3').verbose();
  var db = new sqlite3.Database('emails.db');
  if(!object){
    var object = {}
  }
  
  
  
  function isJson(str) {
      try {
          JSON.parse(str);
      } catch (e) {
          return false;
      }
      return true;
  }

  this.account = this.account || {}
  this.account.username = object.username || object.user
  this.account.password = object.password || false

  this.oauth = object
  this.url = "imap.gmail.com"
  this.fileName = "./data/"+this.account.username+".json"
  this.insertSqlFile ='./api/sql/insertIntoEmailTable.sql'
  this.insertSqlLiteFile ='./api/sql/insertIntoEmailTable-sql-lite.sql'
  
  
  this.test__ = function(){
    return new Promise(function(resolve, reject){ 

    return resolve("hi")
  })
  }

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
    var from = 0
    var limit = 0
    return new Promise(function(resolve, reject){ 
      self.client.listMessages(from,limit, function(err, messages){

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
    return new Promise(function(resolve, reject){ 
      console.log("saving to DB")
      //console.log("db",data)
     
      hql({
       path:this.insertSqlFile,
       data:data
      })
      .then(function(data){
        console.log("saved to DB")
        resolve(data)
      })
      .error(function(e){
        console.log("error",e)
      })

  })
  }
  this.createMailMetaData = function(fileName){
    return new Promise(function(resolve, reject){
      fs.readFileAsync(fileName)
      .then(function(data){
        var all = []
        
        if( isJson(data) ){
          var data = JSON.parse(data)
          for (var i = data.length - 1; i >= 0; i--) {
            var doc =  data[i]
            if(doc.flags[0] === 'Seen'){
              var seen = 1 
            }else{
              var seen = 0
            }
            all.push({
              to: this.account.username+"@gmail.com",
              from:doc.from.address,
              subject:doc.title,
              uid:doc.UID,
              date:moment(doc.date).format("YYYY/MM/DD HH:mm:ss"),
              seen:seen,
              mailbox:doc.path,
            })
            resolve(all)
          };
        }
        
        
        console.log("saved to "+this.fileName)
      })
    })
  }
  return this
}


module.exports = dmail

