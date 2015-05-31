$(function(){
  if(config.EMAIL_LIMIT < 0 || config.EMAIL_LIMIT > 0 ){

    var html  = '<div class="alert alert-warning demo-warning">'
        html +='Demo only grabs last '+Math.abs(config.EMAIL_LIMIT)+' emails because of privacy,storage and performance concerns.'
        html +='<br/>'
        html +='For all emails please <a href="https://github.com/davidholmesnyc/dmail" target="_blank">Download Dmail for free on Github</a>'
        html +='</div>'
    $('body').append(html)
  }
})
