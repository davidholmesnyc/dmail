var Promise    = require("bluebird");
var Handlebars = require("handlebars");
var fs         = Promise.promisifyAll(require("fs"));
var hql = function(object){
  return new Promise(function(resolve, reject){ 
    fs.readFileAsync(object.path)
    .then(function(data){
      var template = Handlebars.compile(data.toString())(object.data);
      return resolve(template)
    })
  })
}
// run " hql.js test" in terminal to run test
process.argv.forEach(function (val, index, array) {
  if(val === 'test'){
    console.log("running test")
    hql({
      "path":"test.sql",
      "data": { to:"myemailAccount@gmail.com",startDate: '10/23/2007', endDate: '05/26/2015' }
    }).then(function(query){
      console.log("HQL",query)
    })
  }
});
module.exports = hql 
