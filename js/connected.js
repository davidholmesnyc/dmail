var _Interval
var io = io.connect()
io.emit('connection')
io.on("status",function(data){
  var percentage = data.percentage
  $('.spinner span').html(percentage+'%')
  if(Number(percentage) >= 100){
    $("#status-tip").hide()
    window.location.replace("/app.html")  
    return clearInterval(_Interval)
  }

  clearInterval(_Interval)
   _Interval = setInterval(function(){
    console.log("interval")
    percentage = Number(percentage) + 1
    $('.spinner span').html(percentage+'%')
  },5000)

  $('#status-update').html(data.message)
  console.log("data",data)
})