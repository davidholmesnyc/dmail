var url  = 'https://accounts.google.com/o/oauth2/auth?access_type=offline'
    url += '&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fgmail.readonly%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email%20https%3A%2F%2Fmail.google.com%2F'
    url += '&response_type=code'
    url += '&client_id='+config.google.CLIENTID
    url += '&redirect_uri='+config.google.REDIRECTURL
    url += '&approval_prompt=force'
    
function login() {
  var win       =   window.open(url, "windowname1", 'width=800, height=600');
  try{
    var pollTimer =   window.setInterval(function() { 
      if(win.location.pathname === '/api/oauthLogin'){
        win.close()
        window.location.href = "/api/connected";
      } 
    }, 500);
  }catch(e){

  }
}