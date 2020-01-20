var express = require('express');
var app = express(); //init Express
var bodyParser = require('body-parser');
var router = express.Router();
var mailer = require('nodemailer');
const cors = require('cors');


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.options('*', cors());




router.post('/sendMail',function(req,res){
    var content = req.body.content;
    var sender = req.body.sender;
    var mobile = req.body.mobile;

    console.log(process.env.userName,' ',process.env.password)

    let transporter = mailer.createTransport({
    host: 'smtp.rediffmail.com', //your mails smtp
    port: 465,
    secure: true, // secure:true for port 465, secure:false for port 587
    auth: {
        user: process.env.userName,
        pass: process.env.password
        }
    });

    

    let mailOptions = {
        from: '"SD" <saptarshidey.2009@rediffmail.com>', // sender address
        to: 'dey7.kol@gmail.com', // list of receivers
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


//associate router to url path
app.use('/api', router)

var ports = process.env.PORT || 5000;
//start the server
app.listen(ports);
console.log("listening on port: "+ports);