const accountSid = 'ACbeea18e2dff0b5a8cd5444abc090c07e'; 
const authToken = '[Redacted]'; 
const client = require('twilio')(accountSid, authToken); 
 
client.messages 
      .create({ 
         body: 'Hello! This is an editable text message. You are free to change it and write whatever you like.', 
         from: 'whatsapp:+14155238886',       
         to: 'whatsapp:+919365722389' 
       }) 
      .then(message => console.log(message.sid)) 
      .done();