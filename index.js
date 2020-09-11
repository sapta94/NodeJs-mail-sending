var express = require('express');
var app = express(); //init Express
var bodyParser = require('body-parser');
var router = express.Router();
var mailer = require('nodemailer');
const cors = require('cors');
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const Nexmo = require('nexmo');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.options('*', cors());

const oauth2Client = new OAuth2(
    process.env.clientID, // ClientID
    process.env.clientSecret, // Client Secret
    "https://developers.google.com/oauthplayground" // Redirect URL
);

oauth2Client.setCredentials({
    refresh_token: process.env.refreshToken
});
//const accessToken = oauth2Client.getAccessToken()



router.post('/sendMail',function(req,res){
    var content = req.body.content;
    var sender = req.body.sender;
    var mobile = req.body.mobile;

    console.log(process.env.userName,' ',typeof process.env.password)

    let transporter = mailer.createTransport({
    service: 'gmail', //your mails smtp
    // secure:true for port 465, secure:false for port 587
    auth: {
        type: "OAuth2",
        user: "dey7.kol@gmail.com", 
        clientId: process.env.clientID,
        clientSecret: process.env.clientSecret,
        refreshToken: process.env.refreshToken,
        accessToken: accessToken
   }
    });

    

    let mailOptions = {
        from: '"SD" <dey7.kol@gmail.com>', // sender address
        to: 'saptarshidey.2009@rediffmail.com', // list of receivers
        subject: 'Message from portfolio ', // Subject line
        text: 'From: '+sender+'\n Mobile: '+mobile+'\n'+content, // plain text body
    };

    console.log(mailOptions)

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        res.json({
            message:"success"
        })
        console.log('Message %s sent: %s', info.messageId, info.response);
    });

})

router.post('/sendSms',async function(req,res){
    const content = req.body.content;
    const sender = req.body.sender;
    const mobile = req.body.mobile; 
    try{
        const nexmo = new Nexmo({
            apiKey: process.env.apiKey,
            apiSecret: process.env.apiSecret,
          });
          
          const from = 'Portfolio';
          const to = '918981235949';
          const text = 'From: '+sender+'\n Mobile: '+mobile+'\n'+content
          
        await nexmo.message.sendSms(from, to, text);
        return res.send({
            message:"success",
        })
    }catch(err){
        console.log(err)
        return res.send({
            message:"fail",
            error:err
        })
    }
    

})

//associate router to url path
app.use('/api', router)

var ports = process.env.PORT || 5000;
//start the server
app.listen(ports);
console.log("listening on port: "+ports);