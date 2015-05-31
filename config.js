var config = {
  "google":{
    "CLIENTID":"YOUR GOOGLE CLIENT ID ",
    "CLIENTSECRET":"YOUR GOOGLE CLIENT SECERT",
    "REDIRECTURL":"YOUR GOOGLE OAUTH REDIRECTURL URL",
    
    "SCOPES":[
      'https://www.googleapis.com/auth/gmail.readonly',
      'https://www.googleapis.com/auth/userinfo.email',
      'https://mail.google.com/'
    ]
  },
  "EMAIL_LIMIT":0, // 0 = unlimited  // Do negatives to get last emails for example -10 gets last 10 emails
  "PORT":5000,
  "DATABASE":"emails.db",
  "COOKIESECRET":"blklaslknn3i093248021"
}
module.exports = config