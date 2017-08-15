var express = require('express');
var app = express(); //init Express
var bodyParser = require('body-parser');
var router = express.Router();
var mailer = require('nodemailer');


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

router.post('/sendMail',function(req,res){
    var userName = req.body.userName;
    var password = req.body.password;
    var content = req.body.content;
    var sendTo = req.body.sendTo;

    let transporter = mailer.createTransport({
    host: 'smtp.rediffmail.com', //your mails smtp
    port: 465,
    secure: true, // secure:true for port 465, secure:false for port 587
    auth: {
        user: '***your mail-id***',
        pass: 'password'
        }
    });

    let mailOptions = {
        from: '"your_name" <saptarshidey.2009@rediffmail.com>', // sender address
        to: 'To address', // list of receivers
        subject: 'Hello ', // Subject line
        text: 'Hello world ?', // plain text body
        html: '<b>Hello world ?</b>' // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message %s sent: %s', info.messageId, info.response);
    });

})


//associate router to url path
app.use('/api', router)

var ports = process.env.PORT || 5000;
//start the server
app.listen(ports);
console.log("listening on port: "+ports);